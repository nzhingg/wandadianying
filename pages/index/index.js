const app = getApp()

Page({
  data: {
    //动态数据
    movies: [],
    store: ""
  },
  //onLoad函数表示页面加载完成后执行
  onLoad: function(res) {
    var that = this;
    //wx.showToast是显示消息提示框，
    wx.showToast({
      title: "加载中...",//提示框中的文字内容
      icon: "loading",//提示框中的图标，只能有两个值，"success"和"loading"
      duration: 500//表示提示框在页面中显示的时间，单位是毫秒
    });
    //wx.request是小程序的API，所有以wx. 为前缀的都是API，
    //wx.request是用于请求数据的
    wx.request({
      //url内就是数据来源
      url: 'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo',
      //success函数表示，当请求数据成功时执行success函数,res是一个形参，即表示请求的数据
      success: function(res){
        //当你不知道数据的结构层是怎样的时候，可以console.log一下查看数据
        console.log(res.data.data);
        //this.setData是设置Page中data的数据,
        //这里是使用that.setData，因为函数中嵌套函数this的指向会发生改变，所以在外层函数中使this指向了that.
        that.setData({
          movies: res.data.data.movieDetails
        })
      }
    });
    console.log("onLoad");
  },
  //页面显示完成后执行onShow函数（每次打开页面都会调用一次），
  onShow: function() {
    var that = this;
    //wx.getStorage是从本地缓存中异步获取指定key对应的内容，这里对应的是我cinemas页面的内容，获取指定的电影院名称
    wx.getStorage({
      key: "cinema",//key中的内容就是我需要的内容
      success: function(res) {
        that.setData({
          store: res.data
        })
      }
    });
    console.log("onShow")
  },
  onReady :function() {
    console.log("onReady")
  }
})