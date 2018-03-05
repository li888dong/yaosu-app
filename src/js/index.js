$(function () {
    /**
     * @description tab标签页切换
     * @param el 当前被点击的tab标签
     * @param className 点击被激活时的类名
     * @param elList 当前一组的tab标签
     * */
    function tabChange(el, className, elList) {
        elList.removeClass(className);
        el.addClass(className);
    }

    /**
     * @description 轮播滚动函数
     * @param container 轮播的容器
     * @param content 轮播的内容
     * @param size 轮播每次动的距离
     * @param delay 多长时间动一次
     * @param direction 轮播方向
     * @param alternation 停留的间隔
     * @return 返回计时器用以清除
     * */
    function lunbo(container, content, size, delay, direction, alternation) {
        container.append(content.eq(0).clone());
        var len = content.length;
        var curELe = 0;
        var animateObj = {};
        return setInterval(function () {
            if (curELe < len - 1) {
                curELe++;
                animateObj[direction] = -curELe * size + 'px';
                container.animate(animateObj, alternation);
            } else {
                curELe = 0;
                animateObj[direction] = -len * size + 'px';
                container.animate(animateObj, alternation, function () {
                    $(this).css(direction, 0)
                })
            }
        }, delay)
    }
    /**
     * @description 查看更多函数
     * @param item: 要查看更多的具体内容
     *
     * */
    function checkMore(item) {
        switch (item){
            case 'caigou':
                console.log('采购');
                break;
            case 'xianhuo':
                console.log('现货');
                break;
            case 'xiangmu':
                console.log('项目');
                break;
            case 'waimao':
                console.log('外贸');
                break;
            case 'jiance':
                console.log('检测');
                break;
            case 'jishu':
                console.log('技术');
                break;
            case 'piwen':
                console.log('批文');
                break;
            case 'jinrong':
                console.log('金融');
                break;
            default:
        }
    }

    //
    /**
     * @description 初始化banner轮播
     *
     * @param img banner轮播图的图片信息
     * @param callback 回调函数
     * */
    function initBannerLunbo(img, callback) {
        var $bannerContainer = $('.banner-img-container');
        for(var i = 0;i<img.length;i++){
            $bannerContainer.append('<div class="banner-img" style="width:'+document.body.offsetWidth+'px;background-image:url(http://image.yaosuce.com'+img[i].picture+')"></div>');
        }
        callback($bannerContainer, $('.banner-img-container>div'), document.body.offsetWidth, 5000, 'left', 2000);
    }
    // 用以存放请求回来的数据
    var fetchData = {};
    // 请求首页数据
    $.ajax({
        url:'http://localhost:3000/app/index/list',
        type:'POST',
        dataType:'json',
        success:function (res) {
            fetchData = res.data;
            console.log(res.data);
            // 查看全部的点击事件
            $('.more').click(function () {
                checkMore($(this).parents('div.item-container')[0].id)
            });
            // 导航列表的点击事件
            $('.nav-list .nav-item').click(function () {
                checkMore($(this).data('name'))
            });
            // 轮播计时器
            initBannerLunbo(fetchData.banner,lunbo);

            var timer1 = lunbo($('.slide-container'), $('.slide-container>div'), 50, 2000, 'top', 1000);
            // tab标签的切换事件
            $('.tabbar-container>span').click(function () {
                tabChange($(this), 'tabbar-selected', $(this).parent().find('span'))
            });

            $('.tabbar-list td').click(function () {
                tabChange($(this), 'selected', $('.tabbar-list td'))
            });


            window.onunload = function () {
                // 清除计时器
                clearInterval(timer1)
            };

        },
        error:function (err) {
            alert('网络错误');
            console.log(err)
        }
    })
});