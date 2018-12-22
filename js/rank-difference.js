$(function(){
      // mui.init({
			// 	swipeBack: false
			// });
    //页面适配 页面加载时自动计算设置content-wrap高度
    $(".rank-difference-box").height($(window).height()-25-$("#sliderSegmentedControl").height()-$(".content-wrap .top").height());

    !function(){
      var page = 1;
      mui("#item1mobile-list").pullRefresh({
        up: {
        height : 0,//可选.默认50.触发上拉加载拖动距离
        auto : true,//可选,默认false.自动上拉加载一次
        contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore : '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback:getData("differential",page,'#item1mobile-list')//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
      })
    }()

    //请求数据函数
    //page 为获取第几页数据 默认为第一页
    function getData(category,page,domName){
      var page = page,
          domName = domName,
          category = category;
      function reqData(){
        var _this = this;
        var url = 'http://123.com?category='+category+"&page="+page;

        //数据模拟
        Mock.mock(url, {
            'status|1-3':3,//状态码 1 成功 2 失败 3表示没有更多数据
            'page':page,//表示页数
            "data|5": [{   // 随机生成5数据
                'userName': '@cname',  // 用户名称
                'userPortrait|1': ["img/portrait-1.png","img/portrait-2.png","img/portrait-3.png","img/portrait-4.png","img/portrait-5.png"],   //用户头像
                'award|5-30': 30,  // 获取奖励
                'productImg|1':["img/product-1.png","img/product-2.png"],//产品图片
                'productTitle':'@csentence(12)',//产品标题
                'quantity|1-10':10,//购买数量
                'price|300-500.2':350,//产品单价
                'orderStatus|1':["代付款","代发货","已发货","待收货","已完成"],//订单状态
                'orderNumber':/[a-z][a-z][a-z]\d{18}/,//订单编号
                'orderTime':'@datetime()',//下单时间
                'tax|1-20':20,//税费
                'integral|200-300':300//重消积分
            }]
        });
        //请求事件
        $.ajax({
                url:'http://123.com',//接口地址
                data:{
                  category:category,
                  page:page++//页数
                },
                dataType:'json',//数据类型
                success:function(res){
                  console.log(res)
                if(res.status == 3){//如果状态码等于3 没有更多数据
                  window.setTimeout(function(){
                    //触发一次伪加载
                    _this.endPullupToRefresh(false);
                  },500)
                  //执行没有禁用上来加载 显示 没有更多数据
                  _this.endPullupToRefresh(true);
                  //停止函数执行
                  return;
		            }
                var listDomName = domName + " " + ".rank-difference-list";
                  $(listDomName).append(template('rank-difference-tpl', res));
                  //上拉加载事件继续生效
                  _this.endPullupToRefresh(false);
                }
              })
      }
      return reqData;
    }

				document.getElementById('slider').addEventListener('slide', function(e) {
          var page = 1;
          console.log(e)
					if (e.detail.slideNumber === 1) {
            if($("#item2mobile-list .rank-difference-list").data("flag")){
              $("#item2mobile-list .rank-difference-list").data("flag",false)
              mui("#item2mobile-list").pullRefresh({
                up: {
                height : 0,//可选.默认50.触发上拉加载拖动距离
                auto : true,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore : '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback:getData("peers",page,'#item2mobile-list')//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
              })
            }

					} else if (e.detail.slideNumber === 2) {
            if($("#item3mobile-list .rank-difference-list").data("flag")){
              $("#item3mobile-list .rank-difference-list").data("flag",false)
              mui("#item3mobile-list").pullRefresh({
                up: {
                height : 0,//可选.默认50.触发上拉加载拖动距离
                auto : true,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore : '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback:getData("supra",page,'#item3mobile-list')//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
              })
            }
					} else if (e.detail.slideNumber === 3) {
            if($("#item4mobile-list .rank-difference-list").data("flag")){
              $("#item4mobile-list .rank-difference-list").data("flag",false)
              mui("#item4mobile-list").pullRefresh({
                up: {
                height : 0,//可选.默认50.触发上拉加载拖动距离
                auto : true,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore : '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback:getData("recommend",page,'#item4mobile-list')//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
              })
            }
					}
				});

        //tab切换事件
				var sliderSegmentedControl = document.getElementById('sliderSegmentedControl');
				mui('.mui-input-group').on('change', 'input', function() {
					if (this.checked) {
						sliderSegmentedControl.className = 'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-' + this.value;
						//force repaint
						sliderProgressBar.setAttribute('style', sliderProgressBar.getAttribute('style'));
					}
				});
})