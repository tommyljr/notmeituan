/**
 * Created by Administrator on 2016/8/30.
 */
/*一个倒计时方法 传入一个总时间*/
(function($){
    function countdown(clock,endDataTimeStr){
        var endDT=new Date(endDataTimeStr).getTime();

        var timer=setInterval(function(){

            var nowDT=new Date().getTime();
            var times=endDT-nowDT;
            if(times<1000){
                clearInterval(timer);
                $(clock).find('.countdown_time').html(0);
                return;
            }
            var tmpHours=Math.floor(times/(60*60*1000));
            var tmpMinutes=Math.floor((times/(60*60*1000)-tmpHours)*60);
            var tmpSeconds=Math.floor(((times/(60*60*1000)-tmpHours)*60-tmpMinutes)*60);
            tmpHours='0'+(tmpHours>99?99:tmpHours);
            tmpHours=tmpHours.substring(tmpHours.length-2,tmpHours.length);
            tmpMinutes='0'+tmpMinutes;
            tmpMinutes=tmpMinutes.substring(tmpMinutes.length-2,tmpMinutes.length);
            tmpSeconds='0'+tmpSeconds;
            tmpSeconds=tmpSeconds.substring(tmpSeconds.length-2,tmpSeconds.length);

            $(clock).find('.countdown_hour1').html(tmpHours[0]).siblings('.countdown_hour2').html(tmpHours[1])
                .siblings('.countdown_min1').html(tmpMinutes[0]).siblings('.countdown_min2').html(tmpMinutes[1])
                .siblings('.countdown_sec1').html(tmpSeconds[0]).siblings('.countdown_sec2').html(tmpSeconds[1]);
        },1000);
    }

    $.extend({
        countdown:countdown
    });

    $.fn.extend({
        countdown:countdown
    });
})(jQuery);

