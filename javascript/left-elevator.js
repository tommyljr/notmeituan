/**
 * Created by Administrator on 2016/9/2.
 */
/*
*
* 1. 需要传入一个.category-list 通过下面的.category-floor的个数确定产生几个小方块
* 2. 通过id 再传入一个id 名称 background对应的position对应 的对象 获得图片的位置 和图片下面名字的位置
* 3. 给每一个小方块绑定一个data-id 的属性 点击后通过查找 对应的框框 让其置顶
* 4  控制 left-elevator的top值上下范围
*     scrollTop< 最顶上 第一个 category-content 的 offsetTop
*                的时候 left-elevator top  就是 第一个 category-content 的 offsetTop - scrollTop
*     scrollTop>  最顶上 第一个 category-content 的 offsetTop
*     且 小于 最后一个 category-floor 的 offsetTop + 最后一个category-floor高度 - 左电梯的高度
*               的时候 left-elevator top就是0
*     scrollTop > 最后一个 category-floor 的 offsetTop + 最后一个 category-floor高度 - 左电梯的高度
 *      最后一个 category-floor 的 offsetTop + 最后一个 category-floor高度 - 左电梯的高度 -scrollTop
* 5  控制右边距 right= 中间主体的左边距 + 主体宽 1170 +25
*              resize的时候 如果 clientWidth小于 主体宽 1170 +2*（右边工具栏的offsetWidht+右边工具栏的 right）
*              电梯就要display=none
*
* */
//制造一个要绑定的数据  这数据本应从db里查询到的 我也就是省略了

var categoryData=[
    {'id':'category001','cateName':'美食','cateIcon':'F-glob-meishi'},
    {'id':'category002','cateName':'休闲娱乐','cateIcon':'F-glob-xiuxianyule'},
    {'id':'category003','cateName':'电影','cateIcon':'F-glob-dianying'},
    {'id':'category004','cateName':'酒店','cateIcon':'F-glob-jiudian'},
    {'id':'category005','cateName':'生活服务','cateIcon':'F-glob-shenghuo'},
    {'id':'category006','cateName':'购物','cateIcon':'F-glob-wanggou'},
    {'id':'category007','cateName':'丽人','cateIcon':'F-glob-jiankangliren'},
    {'id':'category008','cateName':'旅游','cateIcon':'F-glob-lvyou'}
];

var otp={
    data:categoryData,
    elevatorClassName:'.left-elevator',
    cateList:'.category-list',
    rightToolClass:'.right-tool'
};

//单例模式
var leftElevator=(function(){

    //生成html 并绑定
    function makeElevatorCeil(categoryData,eleName){
        var innerStr='';
        for(var i= 0,len=categoryData.length;i<len;i++){
            innerStr+=' <div data-id="'+categoryData[i]['id']+'" top-value="'+ $('#'+categoryData[i]['id']).children('.category-content').offset().top +'"> ';
            innerStr+=' <a href="javascript:;">';
            innerStr+=' <i class="F-glob '+categoryData[i]['cateIcon']+'"></i>';
            innerStr+=' <span>'+categoryData[i]['cateName']+'</span>';
            innerStr+=' </a>';
            innerStr+=' </div>';
        }
        $(eleName).html(innerStr);
    }

    //控制电梯的位置和 选中的样式
    function runElevator(elevatorClassName,topMin,topMax){
        //控制在滚动过程中电梯的位置
        var $elevator=$(elevatorClassName);
        /*console.log($(window).scrollTop()<topMin,topMin );*/
        if($(window).scrollTop()<topMin){
            $elevator.css('top',topMin-$(window).scrollTop());
        }else if($(window).scrollTop()>topMin && $(window).scrollTop()<topMax){
            $elevator.css('top',0);
        }else if($(window).scrollTop()>topMax){
            $elevator.css('top',topMax-$(window).scrollTop());
        }

        //控制滚动过程中选中的样式
        $(elevatorClassName).children('div').each(function(index,item){
            /*console.log( $(window).scrollTop,$(item).attr('top-value'));*/
           if( $(window).scrollTop()>$(item).attr('top-value')){
                $(item).children('a').addClass('select').parent().siblings().children('a').removeClass('select');
            }else{
               if(index==0){
                   $(item).children('a').addClass('select');
               }
           }
        })

    }

    return{
        init:function(options){
            //-->根据数据造个电梯
            makeElevatorCeil(options.data,options.elevatorClassName);

            //-->准备电梯移动中的top 最大值和最小值
            //避免滚动时重复计算 影响性能
            var $elevator=$(options.elevatorClassName);
            var $eleCeils=$elevator.children('div');

            //控制滚动过程中 电梯top值的范围
            var topMin=parseFloat($eleCeils.eq(0).attr('top-value')),
                $lastCate=$('#'+$eleCeils.eq($eleCeils.length-1).attr('data-id')),
                topMax=$lastCate.offset().top+$lastCate.outerHeight()-$elevator.outerHeight();

            //-->绑定调整电梯位置和选中的方法 先执行一遍再说 防止刷新后没有正确的位置
            runElevator(options.elevatorClassName,topMin,topMax);

            //-->在window滚动事件中，绑定调整电梯位置和选中的方法
            $(window).on('scroll',function(){
                runElevator(options.elevatorClassName,topMin,topMax);
            });

            //为每个电梯间绑定点击事件，这个其实可以用委托的方法，不过好像我弄不清e.target
            $elevator.children('div').click(function(){
                $('body,html').stop().animate({scrollTop:parseInt($(this).attr('top-value'))+1},800);
                //加1是为了解决就差那么一点点是属于上一个类型的
            });

            //为resize绑定控制电梯的右边距问题；

            var $rightTool=$(options.rightToolClass);
            var clientWidthMin=1170+2*($rightTool.outerWidth()+parseFloat($rightTool.css('right')));
            if($(window).width()<clientWidthMin){
                $elevator.hide();
            }else{
                $elevator.show();
            }

            $elevator.css('right',$('.content-body').offset().left+1170+25);
            $(window).resize(function(){
                $elevator.css('right',$('.content-body').offset().left+1170+25);
                if($(window).width()<clientWidthMin){
                    $elevator.hide();
                }else{
                    $elevator.show();
                }
            })
        }
    }
})();

leftElevator.init(otp);