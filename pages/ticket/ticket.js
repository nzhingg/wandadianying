Page({
  data: {
    store: "",
    position: "",
    bgImage: "http://images.wandafilm.com/uploadServer/resource/images/2017/11/20171122110450210470.jpg",
    movies: [],
    chooseMovieIndex: 0,
    movieName: "奇门遁甲",
    movieTime: "113分钟",
    movieType: "动作/奇幻",
    activeIndex: 0,
    screening: [],
    today: [],
    tomorrow: [],
    afterTomorrow: []
  },
  chooseMovie: function(e) {
    var that = this;
    let index = e.target.dataset.index;
    wx.request({
      url: 'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo#!method=get',
      success: function(res){
        let movie = res.data.data.movieDetails[index-1];
        // var day = res.data.data.movieDetails[3].screenings[0].day;
        var day1 = movie.screenings.filter((item) => {
          return item.day == '1';
        });
        var day2 = movie.screenings.filter((item) => {
          return item.day == '2';
        });
        that.setData({
          bgImage: movie.image,
          movieName: movie.movieName,
          movieTime: movie.time,
          movieType: movie.type,
          chooseMovieIndex: index-1,
          today: day1,
          tomorrow: day2,
        })
      }
    })
  },
  changeTab: function(e) {
    var index = e.target.dataset.index;
    this.setData({
      activeIndex: index
    });
  },
  swiperTab: function(e) {
    var type = e.detail.current;
    console.log(e);
    this.setData({
      activeIndex:type
    });
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: 'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo#!method=get',
      success: function(res){
        var day1 = res.data.data.movieDetails[0].screenings.filter((item) => {
          return item.day == '1';
        })
        var day2 = res.data.data.movieDetails[0].screenings.filter((item) => {
          return item.day == '2';
        })
        // 设置电影封面，电影放映场次
        that.setData({
          movies: res.data.data.movieDetails,
          today: day1,
          tomorrow: day2,
        });
      }
    });
    // 从本地缓存中获取电影院名称
    wx.getStorage({
      key: "cinema",
      success: function(res) {
        that.setData({
          store:res.data
        })
      }
    });
    // 从本地缓存中获取电影院地址
    wx.getStorage({
      key: "position",
      success: function(res) {
        that.setData({
          position: res.data
        })
      }
    })
  },
})