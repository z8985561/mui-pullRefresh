//帮扶奖明显页面交互功能实现
//1.实现日期筛选功能并通过用户选择后的日期请求数据渲染到页面
//2.实现上拉加载分页功能 如果存在多页数据用户可以上拉加载页面


//数据接口说明 
//接口传值
//dateTime 用户选择的日期
//page 加载第几页的数据


$(function(){
		//当前的日期
	var nowDate = new Date().getFullYear()+"-"+(new Date().getMonth() + 1) + "-" + new Date().getDate(),
		page = 1,//默认请求第一页
		_this,//声明一个this用于保存首次页面加载后的上拉加载触发对象
		html = "";//页面加载的结构
	//页面适配 页面加载时自动计算设置content-wrap高度
    $(".content-wrap .help-award-box").height($(window).height()-25-$(".base-header").height()-$(".content-wrap .top").height());

    //设置显示当前的日期
    $("#js-date").children("span").eq(0).html(nowDate);

    //初始化上拉加载 默认触发一次上拉加载
	mui.init({
	pullRefresh : {
	  container:'#goodsList',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
	  up : {
	    height:0,//可选.默认50.触发上拉加载拖动距离
	    auto:true,//可选,默认false.自动上拉加载一次
	    contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
	    contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
	    callback :reqData//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	  }
	}
	});

	//请求数据函数
	//datetime 为查询时间 默认为当天的时间nowDate
	//page 为获取第几页数据 默认为第一页
	function reqData(dateTime){
		var dateTime = dateTime || nowDate,
		    url = 'http://123.com?'+"dateTime="+dateTime+"&page="+page;
		    //这里用于保存 首次页面加载后的上拉加载触发对象
		    _this = this;
		//数据模拟
		Mock.mock(url, {
		    'status|1-3':3,//状态码 1 成功 2 失败 3表示没有更多数据
		    'page':page,//表示页数
		    "data|5": [{   // 随机生成5数据
		        'userName': '@cname',  // 用户名称
		        'userRanking|1-100': 100,    // 用户排名
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
		          dateTime:dateTime,//日期
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
		          //调用模板引擎 追加到html
		          html += template('test', res);
		          //插入到对应的列表
		          $(".help-award-list").html(html);
		          //上拉加载事件继续生效
		          _this.endPullupToRefresh(false)
		        }
		      })
	}

	//日期筛选按钮事件 触发日期筛选组件
	$("#js-date").on("tap",function () {
		//保存当前this
        var that = $(this);
        //清空html
        html = "";
        page = 1;//恢复第一页
        var dtpicker = new mui.DtPicker({
                      type: "date",//设置日历初始视图模式
                      beginDate: new Date(2017, 12, 01),//设置开始日期
                      endDate: new Date(2030, 12, 30),//设置结束日期
                      labels: ['年', '月', '日'],//设置默认标签区域提示语
                  })
        //当用户选定日期后执行的事件
        dtpicker.show(function(e) {
        	//清空对应列表的数据
            $(".help-award-list").html(html);
            //重启上拉加载的事件
            mui('#goodsList').pullRefresh().refresh(true);
            //用户选地的具体日期
            var dateTime = e.text;
            that.children("span").eq(0).html(dateTime);
            //触发数据请求时间 _this为触发上拉加载的对象
            reqData.call(_this,dateTime);
        })
    })
})