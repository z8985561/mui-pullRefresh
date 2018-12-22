//重消积分模块
//页面加载请求数据
//把数据渲染到指定的列表
$(function(){
  !function(){
    //页面适配 页面加载时自动计算设置content-wrap高度
    $(".content-wrap .help-award-box").height($(window).height()-25-$(".base-header").height()-$(".content-wrap .top").height());
    var page = 1,
        html = "";

    //获取数据函数
    function getData(){
      var _this = this,
          url = "http://123.com?page="+page;

      Mock.mock(url,{
        "status|1-2":1,
        "page":page,
        "data|8":[{
          "proTitle":"@csentence(24)",//产品标题
          'orderTime':'@datetime()',//下单时间
          'integral|200-400':300//重消积分
        }]
      })
      $.ajax({
        url:"http://123.com",
        dataType:"json",
        data:{
          page:page++
        },
        success:function(res){
          console.log(res)
        if(res.status == 2){//如果状态码等于3 没有更多数据
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
        html += template('repeat-integral-tpl', res);
        //插入到对应的列表
        $(".repeat-integral-list").html(html);
        //上拉加载事件继续生效
        _this.endPullupToRefresh(false)
        }
    })
    }

      //初始化上拉加载 默认触发一次上拉加载
      mui.init({
      pullRefresh : {
        container:'#js-repeat-integral',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
          height:0,//可选.默认50.触发上拉加载拖动距离
          auto:true,//可选,默认false.自动上拉加载一次
          contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
          contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
          callback :getData//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
      }
      });
  }()
})