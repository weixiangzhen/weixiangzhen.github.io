(function () {
  "use strict";

  z.Common = new function () {
    this.rnd = function (min, max) {
      if (arguments.length < 2) {
        max = min;
        min = 0;
      }

      if (min > max) {
        var hold = max;
        max = min;
        min = hold;
      }

      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this.getOrbitRange = function (x, y) {
      var v = Math.max(x, y);
      v = Math.round(Math.sqrt(v * v + v * v));
      return v / 2;
    };
  }

  // 星星对象
  z.Star = function (or) {
    //轨道的半径大小
    this.orbitR = or;
    // 本身的半径
    this.r = z.Common.rnd(60, this.orbitR) / 20;

    this.targetAlpha = z.Common.rnd(2, 8) / 10;
    this.alpha = 0;
    this.degree = z.Common.rnd(0, 360);
    // 速度
    this.speed = z.Common.rnd(this.orbitR) / 5000;
  }

  z.Star.prototype = {
    constructor: z.Star,
    getOrbitR: function () {
      return this.orbitR;
    },
    getAlpha: function () {
      return this.alpha;
    },
    setAlpha: function (alpha) {
      this.alpha = alpha;
    },
    setR: function (r) {
      this.r = r;
    },
    getR: function () {
      return this.r;
    },
    setDegree: function (degree) {
      this.degree = degree;
    },
    getDegree: function () {
      return this.degree;
    },
    setSpeed: function (speed) {
      this.speed = speed;
    },
    getSpeed: function () {
      return this.speed;
    },
    change: function () {
      this.degree += this.speed;
    }
  }

  // 宇宙对象
  z.Cosmos = (function () {
    var canvas, context;

    function Cosmos() {
      // 星星的默认数量
      this.maxStar = 200;

      this.size = { width: 0, height: 0 };

      // 中心点
      this.orbitX = this.size.width / 2;
      this.orbitY = this.size.height / 2;

      this.stars = [];
      this.isRound = true;

      this.hue = 230;
      this.timestamp = 0;
    }

    Cosmos.prototype = {
      constructor: Cosmos,
      init: function () {
        if (!this.size.width || !this.size.height) return;
        // 添加
        for (var i = 0; i < this.maxStar; i++) {
          var or;
          if (i > Math.floor(this.maxStar *3/ 5) && this.isRound)
            or = z.Common.getOrbitRange(this.size.width, this.size.height) / 2;
          else
            or = z.Common.rnd(z.Common.getOrbitRange(this.size.width, this.size.height));
          this.add(or);
        }
      },
      add: function (or) {
        this.stars.push(new z.Star(or));
      },
      setRound: function (isRound) {
        this.isRound = isRound;
      },
      setHue: function (hue) {
        this.hue = hue;
      },
      setCanvas: function (cvs) {
        if (!cvs) throw Error('画布未定义或者不能为空！！！');

        canvas = cvs;
        this.size = { width: cvs.width, height: cvs.height };
        context = cvs.getContext('2d');

        // 中心点
        this.orbitX = this.size.width / 2;
        this.orbitY = this.size.height / 2;
      },
      start: function () {
        this.init();
      },
      restart: function () {
        this.stars = [];
        this.timestamp = 0;
        this.init();        
      },
      setMaxStar: function (max) {
        this.maxStar = max;
      },
      draw: function (ctx) {
        // 清空画布
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // 背景色
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'hsla(' + this.hue + ', 64%, 6%, 2)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 画星星    
        ctx.globalCompositeOperation = 'lighter';

        this.timestamp++;
        for (var i = 0, l = this.stars.length; i < l; i++) {
          var star = this.stars[i];
          if (star.getR() <= 0) continue;
          var x = Math.cos(star.getDegree() * Math.PI / 180) * star.getOrbitR() + this.orbitX,
            y = Math.sin(star.getDegree() * Math.PI / 180) * star.getOrbitR() + this.orbitY;

          var gradient = ctx.createRadialGradient(x, y, 0, x, y, star.getR());
          gradient.addColorStop(0, '#fff');
          gradient.addColorStop(0.1, 'hsl(' + (10 + 2 * i) + ', 61%, 33%)');
          gradient.addColorStop(0.4, 'hsl(' + (100 + i) + ', 64%, 6%)');
          // gradient.addColorStop(0.1, 'hsl(' + (160) + ', 61%, 33%)');
          // gradient.addColorStop(0.4, 'hsl(' + (160) + ', 61%, 33%)');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;

          if (star.getAlpha() < star.targetAlpha && this.timestamp >= 40) {
            if (this.timestamp % 20 === 0) {                         
              star.setAlpha(star.getAlpha() + 0.05);
            }
          }else if(this.timestamp >= 300){
            var blink = z.Common.rnd(10);

            if (blink <= 3 && star.getAlpha() > 0) {
              star.setAlpha(star.getAlpha() - 0.05);
            } else if (blink >= 7 && star.getAlpha() < 0.8) {
              star.setAlpha(star.getAlpha() + 0.05);
            }
          } 
          ctx.globalAlpha = star.getAlpha();
          ctx.beginPath();
          ctx.arc(x, y, star.getR(), 0, 2 * Math.PI, !1);
          ctx.fill();

          star.change();
        }
      },
      run: function () {
        if (!context) return;

        this.draw(context);
      }
    }
    //实例容器
    var instance = null;

    return {
      getInstance: function () {//返回Singleton的实例
        if (!instance) instance = new Cosmos;
        return instance;
      }
    };
  })();

  var lastTime = 0,
    vendors = ['webkit', 'moz'];
  for (var x = 0, l = vendors.length; x < l && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  var anim = function (timestamp) {
    window.requestAnimationFrame(anim);
    z.Cosmos.getInstance().run();
  }
  window.requestAnimationFrame(anim);

})();


/*Cosmos.prototype.anim = function () {
    // 兼容
    window.requestAnimationFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (a, b) {
          window.setTimeout(a, 1e3 / 60)
        }
    }();
    var a = function () {      
      this.draw();
      window.requestAnimationFrame(a);
    }.bind(this);
    window.requestAnimationFrame(a)
  }*/