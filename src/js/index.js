$(function () {
    /**
     * @description tab标签页切换
     * @param el 当前被点击的tab标签
     * @param className 点击被激活时的类名
     * @param elList 当前一组的tab标签
     * @param callback 回调函数
     * */
    function tabChange(el, className, elList, callback = function () {}) {
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
        switch (item) {
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
        for (var i = 0; i < img.length; i++) {
            $bannerContainer.append('<div class="banner-img" style="width:' + document.body.offsetWidth + 'px;background-image:url(http://image.yaosuce.com' + img[i].picture + ')"></div>');
        }
        callback($bannerContainer, $('.banner-img-container>div'), document.body.offsetWidth, 5000, 'left', 2000);
    }

    // 参考价格
    var referencePrice = {
        // 0原料药，1中药
        type: 0,
        yuanliaoData: [],
        zhongyaoData: [],
        changeType: function () {
            this.type === 0 ? this.type = 1 : this.type = 0;
            if (this.type === 0) {
                $('.slide-container.zhongyao').css('zIndex',-1);
                $('.slide-container.yuanliao').css('zIndex',1)
            }
            if (this.type === 1) {
                $('.slide-container.yuanliao').css('zIndex',-1);
                $('.slide-container.zhongyao').css('zIndex',1)
            }
        },
        init: function (yuanliaoData, zhongyaoData) {
            $('.slide-container.zhongyao').css('zIndex',-1);
            $('.slide-container.yuanliao').css('zIndex',1)
            this.yuanliaoData = yuanliaoData;
            this.zhongyaoData = zhongyaoData;

            var $slideContainer = $('.slide-container');
            $slideContainer.empty();
            for (var i = 0; i < this.yuanliaoData.length; i = i + 2) {

                $('.slide-container.yuanliao').append(`
                    <div>
                        <p><span class="product-name">${this.yuanliaoData[i].productname}</span> <span class="price">${this.yuanliaoData[i].price}</span><span>${this.yuanliaoData[i].qualitystandard}</span></p>
                        <p><span class="product-name">${this.yuanliaoData[i + 1] ? this.yuanliaoData[i + 1].productname : ''}</span> <span class="price">${this.yuanliaoData[i + 1] ? this.yuanliaoData[i + 1].price : ''}</span><span>${this.yuanliaoData[i + 1] ? this.yuanliaoData[i + 1].qualitystandard : ''}</span></p>
                    </div>
                `)

            }
            this.zhongyaoData.map(i=>{
                var marketsGroup = [];
                i.tbProductTcmOriginplace.map(j=>{
                    marketsGroup.push(`<span class="markets">${j.markets} :</span><span class="price">${j.price}</span>`)
                });
                $('.slide-container.zhongyao').append(`
                    <div>
                        <p><span class="product-name">${i.productName}</span><span>${i.tbProductTcmOriginplace[0].specification}</span></p>
                        <p class="markets-group">${marketsGroup.join('')}</p>    
                    </div>
                `)
            });

            lunbo($('.slide-container.zhongyao'), $('.slide-container.zhongyao>div'), 50, 2000, 'top', 1000);
            lunbo($('.slide-container.yuanliao'), $('.slide-container.yuanliao>div'), 50, 2000, 'top', 1000);
        },
        gotoProducts: null
    };

    // 现货
    var goods = {
        type:'api',
        api:[],
        basics:[],
        featureApi:[],
        ingredients:[],
        midbody:[],
        natural:[],
        selfSupport:[],
        tcm:[],
        changeType:function (type) {
			this.type = type;
			$('#xianhuo').find('.item-content').empty();
			switch (this.type){
                case 'api':
                    this.rendererData(this.api);
                    break;
                case 'basics':
                    this.rendererData(this.basics);
                    break;
                case 'featureApi':
                    this.rendererData(this.featureApi);
                    break;
                case 'ingredients':
                    this.rendererData(this.ingredients);
                    break;
                case 'midbody':
                    this.rendererData(this.midbody);
                    break;
                case 'natural':
                    this.rendererData(this.natural);
                    break;
                case 'selfSupport':
                    this.rendererData(this.selfSupport);
                    break;
                case 'tcm':
                    this.rendererData(this.tcm);
                    break;
                default:
                    this.rendererData(this.api)

            }
		},
        rendererData:function (data) {
            var dom = [];
            data.map(i=>{
				dom.push(`<div class="product-item">
                        <h4 class="item-title">${i.chanpmc}</h4>
                        <div class="item-info">${i.chund}</div>
                        <div class="item-company">${i.qiymc}</div>
                    </div>`)
            });
			$('#xianhuo').find('.item-content').append(dom.join(''))
		},
        init:function (goodData) {
            this.api = goodData.api;
            this.basics = goodData.basics;
            this.featureApi = goodData.featureApi;
            this.ingredients = goodData.ingredients;
            this.midbody = goodData.midbody;
            this.natural = goodData.natural;
            this.tcm = goodData.tcm;
            this.selfSupport = goodData.selfSupport;
            this.rendererData(this.api);
		}
    };

    // 用以存放请求回来的数据
    var fetchData = {};
    // 请求首页数据
    $.ajax({
        url: 'http://localhost:3000/app/index/list',
        type: 'POST',
        dataType: 'json',
        success: function (res) {
            fetchData = res.data;
            console.log(res.data);

            // banner轮播
            initBannerLunbo(fetchData.banner, lunbo);
	        //初始化参考价格
            referencePrice.init(fetchData.api, fetchData.tcm);
            //初始化现货
            goods.init(fetchData.goods);
            // 跳转全部 的点击事件
            $('.more').click(function () {
                checkMore($(this).parents('div.item-container')[0].id)
            });
            // 导航列表的点击事件
            $('.nav-list .nav-item').click(function () {
                checkMore($(this).data('name'))
            });

            // tab标签的切换事件
            $('.tabbar-container>span').click(function () {
                var callback;
                switch ($(this).closest('[id]')[0].id) {
                    case 'price':
                        referencePrice.changeType();
                        break;
                    case 'xianhuo':

                    default:
                }
                tabChange($(this), 'tabbar-selected', $(this).parent().find('span'), callback)
            });

            $('.tabbar-list td').click(function () {
                goods.changeType($(this).data('type'));
                tabChange($(this), 'selected', $('.tabbar-list td'))
            });


            window.onunload = function () {
                // 清除计时器
                // clearInterval(timer1)
            };

        },
        error: function (err) {
            alert('网络错误');
            console.log(err)
        }
    })
});