const app = getApp();
Page({
  data: {
    item: []
  },
  onLoad: function(params) {
    var that = this;
    wx.request({
      url:'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo',
      data:{},
      success: function(res){
        var datas = res.data.data.movieDetails.filter(item => {
          return item.id == params.id;
        });
        // console.log(datas[0].stills)
        that.setData({
          item:datas[0]
        })
      }
    })
  }
})