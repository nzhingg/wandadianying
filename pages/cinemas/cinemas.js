const app = getApp()

Page({
    data: {
        cinemas: [],
        cinema: ''
    },
    chooseCinema:function(e){
        var index = e.currentTarget.dataset.current;
        // 将电影院名称存储在本地缓存中
        wx.setStorage({
            key: "cinema",
            data:this.data.cinemas[index].cinema
        });
        // 将电影院地址存储在本地缓存中
        wx.setStorage({
            key: "position",
            data:this.data.cinemas[index].position
        });
    },
    onLoad: function() {
        var that = this;
        // 从easy-mock请求数据
        wx.request({
            url: 'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo',
            success: function(res) {
                that.setData({
                    cinemas: res.data.data.cinemas,
                });
            }
        })
    }
})