/**
 * Created by ljr on 2016/8/29.
 */
(function($){
   function carousel(targetName,dur){
       /*设定间隔 默认5s*/
       var duration=5000;
       /*步骤*/
       var step=0;
       /*定时器引用变量*/
       var timer=null;
       /*步长*/
       var speed=0;
        /*数据最大长度*/
       var maxLength=0;

       //获取步长
       speed=$(targetName).parent().width();
       //获得运动间隔时间
       duration=dur?dur:duration;
       //获得最大步数
       var maxLength=$(targetName).children().length-1;

       //设置右按钮最大长度
       $(targetName).siblings().find('.curpage').html('1');
       $(targetName).siblings().find('.totalpage').html('/'+maxLength);

        /*console.log('maxlength:'+maxLength);*/
       //左移动操作 点击向右箭头 图片左移动
       function moveLeft(){
           if(step == maxLength){
               step = 0;
               $(targetName).css('left',0);
           }
           step++;
           /*console.log(step);*/

           $(targetName).stop().animate({left:-speed*step},700,'linear').parent().find('.curpage').html(step==maxLength?1:step+1);
       }
       timer = window.setInterval(moveLeft,duration);

       //右移动操作 点击向左箭头 图片右移动
       function moveRight(){
           if(step == 0){
               step = maxLength;
               $(targetName).css('left',-step*speed);
           }
           step--;
           /*console.log(step);*/

           $(targetName).stop().animate({left:-speed*step},700,'linear').parent().find('.curpage').html(step+1);
       }

       /*绑定鼠标滑动事件*/
       $(targetName).parent().on('mouseover',function(){
           window.clearInterval(timer);
       }).on('mouseout',function(){
           timer = window.setInterval(moveLeft,duration);
       });

       /*绑定箭头点击事件*/
       $(targetName).siblings('.slider_prev').on('click',moveRight).siblings('.slider_next').on('click',moveLeft);
   }
    $.extend({
        carousel : carousel
    });

    $.fn.extend({
        carousel : carousel
    })
})(jQuery);