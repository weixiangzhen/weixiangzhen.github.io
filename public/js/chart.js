; (function () {
  "use strict";

  z.Chart = function (cvs) {   
    this.ctx = cvs.getContext("2d");
    this.w = cvs.width;
    this.h = cvs.height;   
    this.text = 'null';
    this.r = this.w < this.h ? this.w / 2 : this.h / 2;//先默认环半径为canvas宽度
    // var bgR = (this.r - this.r / 3) / 2;//内环背景半径
    var linkW = this.r - this.r * 2 / 3;//环宽度=(W/2-内半径)
    this.inW = linkW / 3;//内环宽度=环宽度*1/3
    this.outW = linkW * 2 / 3;//外环宽度=环宽度*2/3
    this.inR = 2 * this.r / 3 + this.inW / 2;//内环半径=内半径+内环宽度/2
    this.outR = 2 * this.r / 3 + this.inW + this.outW / 2;//外环半径=内半径+内环宽度+外环宽度/2

    this.curPercent = 0;
    this.defPercent = 100;
  }

  z.Chart.prototype = {
    constructor: z.Chart,
    /*setText: function (str) {
      this.text = str;
    },*/
    animation: function () {
      // 清除画布
      this.ctx.clearRect(0, 0, this.w, this.h);

      // 大半径的底色，一块完整的圆形   
      this.ctx.beginPath();
      var grd = this.ctx.createLinearGradient(0, this.h, this.w, 0);//颜色渐变的起始坐标和终点坐标
      grd.addColorStop(0, "#74DE1C");
      grd.addColorStop(0.3, "#9DDE12");
      grd.addColorStop(0.6, "#B2ED2E");
      grd.addColorStop(1, "#CBF76C");
      this.ctx.strokeStyle = grd;//生成的颜色块赋值给样式        
      this.ctx.lineWidth = this.outW;
      this.ctx.arc(this.w / 2, this.h / 2, this.outR, 0, Math.PI * 2, !1);
      this.ctx.stroke();

      //底色小
      this.ctx.beginPath();
      var grd = this.ctx.createLinearGradient(this.w, 0, 0, this.h);
      grd.addColorStop(0, "#74DE1C");
      grd.addColorStop(0.3, "#9DDE12");
      grd.addColorStop(0.6, "#B2ED2E");
      grd.addColorStop(1, "#CBF76C");
      this.ctx.strokeStyle = grd;
      this.ctx.lineWidth = this.inW;
      this.ctx.arc(this.w / 2, this.h / 2, this.inR, 0, Math.PI * 2, !1);
      this.ctx.stroke();

      //圆心背景
      /*this.ctx.beginPath();
      this.ctx.fillStyle = "#D9E5E5";
      this.ctx.arc(W / 2, H / 2, bgR, 0, Math.PI * 2, false);
      this.ctx.fill();*/

      // 算出当前的角度
      var deg = 360 * this.curPercent / 100;
      //外层     
      this.ctx.beginPath();
      var grd = this.ctx.createLinearGradient(0, this.h, this.w, 0);
      grd.addColorStop(0, "#8BEAF5");
      grd.addColorStop(0.3, "#22A4D4");
      grd.addColorStop(0.6, "#0B72BD");
      grd.addColorStop(1, "#0A5DA0");
      this.ctx.strokeStyle = grd;
      this.ctx.lineWidth = this.outW;
      // 算出弧度
      var r = deg * Math.PI / 180;
      // 因为默认是从x轴右半边开始画的，所以需要-90度
      this.ctx.arc(this.w / 2, this.h / 2, this.outR, 0 - 90 * Math.PI / 180, r - 90 * Math.PI / 180, !1);
      this.ctx.stroke();

      //内层
      this.ctx.beginPath();
      var grd = this.ctx.createLinearGradient(this.w, 0, 0, this.h);
      grd.addColorStop(0, "#8BEAF5");
      grd.addColorStop(0.3, "#22A4D4");
      grd.addColorStop(0.6, "#0B72BD");
      grd.addColorStop(1, "#0A5DA0");
      this.ctx.strokeStyle = grd;
      this.ctx.lineWidth = this.inW;
      this.ctx.arc(this.w / 2, this.h / 2, this.inR, 0 - 90 * Math.PI / 180, r - 90 * Math.PI / 180, !1);
      this.ctx.stroke();

      // 需要显示的文字
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold ' + this.r / 2 + 'px Arial';
      this.text = Math.floor(deg / 360 * 100) + '%';
      var text_w = this.ctx.measureText(this.text).width;
      this.ctx.fillText(this.text, this.w / 2 - text_w / 2, this.h / 2 + this.r / 5);
    },

    ratePie: function (perc) {
      if (perc < 0 || perc > 100) reutrn;
      this.defPercent = perc;

      var timerid = setInterval(function () {
        // 当count等于设定的百分比时，清除定时器
        if (this.curPercent == this.defPercent)
          clearInterval(timerid);
        else
          this.curPercent++;
        // 开始执行动画效果
        this.animation();
      }.bind(this), 2000 / this.defPercent);
    }
  };

})();