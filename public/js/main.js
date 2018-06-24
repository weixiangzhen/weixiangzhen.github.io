// start
$(function ($) {
  //  简历的内容
  var $bio_contents = $('.bio-content'),
    $collapse = $('.main-navigation .collapse'),
    // 菜单栏
    $menu_lis = $('.main-navigation .menu li'),
    $message = $('.bio-content .message'),
    $library = $('.library'),
    $database = $('.database');

  var cur_index = 0, last_index = 0,
    is_finish = false,
    is_message_finish = false,
    librarys = [],
    databases = [];

  if (clientInfo === 'pc') {
    $message.html('<span>上下滑动切换图片</span>');
  } else {
    $message.html('<span>点击图片进行切换</span>');
  }

  //初始化简历内容 
  $($bio_contents[0]).fadeIn(1000, function () {
    is_finish = true;
  });

  // 简历内容切换
  function switchBio(new_index) {
    if (!is_finish || last_index == new_index)
      return;

    $collapse.collapse('hide');

    var $cur_content = $bio_contents.eq(new_index);
    var $last_content = $bio_contents.eq(last_index);

    if (!is_message_finish && $cur_content.data('content') == '4') {
      is_message_finish = true;
      $message.fadeIn(3000, function () {
        $(this).fadeOut(1000);
      });
    }

    $last_content.fadeOut(500, function () {
      $cur_content.fadeIn(500, function () {
        is_finish = true;
        last_index = new_index;
      });
      if ($cur_content.data('content') == '3') {
        librarys = [];
        databases = [];

       var lw = $library.width(),
        dw = $database.width();        

        
        $library.find('canvas').each(function (i) {
          if(lw > 700) {
            this.width = 150;
            this.height = 150;
            $(this).css('padding','0 1.5em');
          }else if(lw > 500) {
            this.width = 100;
            this.height = 100;
            $(this).css('padding','0 1em');
          }
          var c = new z.Chart(this);
          c.ratePie($(this).data('progress'));
          librarys.push(c);
        });

        $database.find('canvas').each(function (i) {
          if(dw > 500) {
            this.width = 150;
            this.height = 150;
            $(this).css('padding','0 1.5em');
          }
          var c = new z.Chart(this);
          c.ratePie($(this).data('progress'));
          databases.push(c);
        });
      }
    });
    is_finish = false;
  }

  $menu_lis.click(function (event) {
    event.preventDefault();
    cur_index = $(this).index();
    switchBio(cur_index);
  });

  // 实战项目，通过滑动切换
  var $design = $('.bio-content .design'),
    $designBoxs = $design.children('.box');

  var unit = $($designBoxs[0]).innerHeight() + parseInt($('body').css('font-size').slice(0, -2)) * 2;
  $design.css('height', unit * $designBoxs.length);

  // 图片滑动函数
  function slide(dir) {
    var len = $designBoxs.length;

    if (($($designBoxs[len - 1]).attr('data-pos') == '1' && dir == -1)
      || ($($designBoxs[0]).attr('data-pos') == '1' && dir == 1)) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var $designBox = $($designBoxs[i]);
      var val = parseInt($designBox.attr('data-pos')) + dir;
      $designBox.css('top', (val * unit));
      $designBox.attr('data-pos', val);
    }
    return true;
  }

  slide(0);

  // 判断是否点击，开始的坐标
  var isBegan = false, startX = 0, startY = 0, H = 0;

  function _handlerStart(e) {
    isBegan = true;
    if (typeof e.button == 'number') {
      startX = e.clientX;
      startY = e.clientY;
      return;
    }
    startX = e.originalEvent.targetTouches[0].clientX;
    startY = e.originalEvent.targetTouches[0].clientY;
  }

  function _handlerMove(parent, e) {
    if (isBegan) {
      var t = typeof e.button, endX = 0, endY = 0;
      if (t == 'number') {
        endX = e.clientX;
        endY = e.clientY;
      } else {
        endX = e.originalEvent.targetTouches[0].clientX;
        endY = e.originalEvent.targetTouches[0].clientY;
      }
      var dx = endX - startX,
        dy = endY - startY;

      if ($(parent).data('content') == 4) {
        if (dy >= 50) {
          (t != 'number') || slide(1);
          isBegan = false;
        } else if (dy <= -50) {
          (t != 'number') || slide(-1);
          isBegan = false;
        }
      }

      if (dx >= 100) {
        (cur_index == 0 || !is_finish) || cur_index--;
        switchBio(cur_index)
        isBegan = false;
      } else if (dx <= -100) {
        (cur_index >= 3 || !is_finish) || cur_index++;
        switchBio(cur_index)
        isBegan = false;
      }
    }
  }

  var slide_dir = -1;
  function _handlerEnd(parent, e) {
    if (typeof e.button != 'number' && isBegan && $(parent).data('content') == 4) {
      if (slide_dir == -1) {
        if (!slide(slide_dir)) {
          slide_dir = 1;
          slide(slide_dir);
        }
      } else {
        if (!slide(slide_dir)) {
          slide_dir = -1;
          slide(slide_dir);
        }
      }
    }
    isBegan = false;
  }

  function addStar(parent, e) {
    var xPos = 0,
      yPos = 0;
    if (typeof e.button == 'number') {
      xPos = e.originalEvent.clientX;
      yPos = e.originalEvent.clientY;
    } else {
      xPos = e.originalEvent.targetTouches[0].clientX;
      yPos = e.originalEvent.targetTouches[0].clientY;
    }

    $(parent).append('<div class="draw" style="left:' + xPos + 'px;top:' + yPos + 'px;color:hsla(' + H + ',100%,70%,1)">✮</div>');

    $('.draw').each(function () {
      var $div = $(this);
      setTimeout(function () { $div.remove(); }, 800);
    });
  }

  // 事件处理，为所有的简历内容设置
  $bio_contents.bind('mousedown touchstart', function (e) {
    _handlerStart(e);
  });

  $bio_contents.bind('mousemove touchmove', function (e) {
    _handlerMove(this, e);

    addStar(this, e);
  });

  $bio_contents.bind('mouseup touchend', function (e) {
    _handlerEnd(this, e);
  });

  setInterval(function () {
    if (H <= 360) { H++; }
    else { H = 0; }
  }, 10);

});