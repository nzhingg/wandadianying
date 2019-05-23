# 圣诞节即将来临，带上那个心仪的她（他）去万达看场电影吧
![](https://user-gold-cdn.xitu.io/2017/12/18/1606545178bc4205?w=446&h=295&f=gif&s=142535)
前几天和朋友约着去万达看IMAX版的正义联盟，刚好可以弄个抽奖，满60减20，无奈运气太差，让十个人帮忙抽就是抽不到，后来刚好要仿一个小程序，就想着那就万达电影吧！
## 项目现有功能
* 列表式渲染数据
* 在本地缓存中存储数据和获取数据
* 页面跳转和传参页面跳转
* swiper和scroll基础滑动事件
* 动态设置导航条
## 项目效果与具体实现
### 文件

![](https://user-gold-cdn.xitu.io/2017/12/18/160654c2f046c78b?w=203&h=312&f=png&s=12168)
### 1.首页及底部tabbar转换

![](https://user-gold-cdn.xitu.io/2017/12/17/16064b0e37a23d60?w=290&h=508&f=gif&s=378880)
具体index.wxml实现：

```
<!--小程序中的标签不是div,p,a等标签，而是采用了自定义的view等组件，view就相当于div标签-->
<view class="container">
  <!--WXML页面中的数据都来自对应Page的data,数据绑定使用{{}}将变量包起来-->
  <!--navigator组件是用于页面跳转的，url就是对应点击之后的页面路径-->
  <navigator class="page__hd" url="../cinemas/cinemas">
    <!--这里的store就是动态数据，需要去Page中的data中设置-->
      <view class="page__hd_store">当前影院:{{store}}></view>
      <button class="btn">切换</button>
  </navigator>
  <!--在组件上使用wx:for控制属性绑定一个数组，使用数组中各项的数据重复渲染组件。主页的电影信息就是一个个列表
  默认数组的当前项的下标变量名默认为index，数组当前项的变量名默认为item，所以在Page页面中只需要设置movies就可以，
  for循环里的数据都可以用item. 来获取数据-->
  <!--scroll-view是可滚动视图区域，scroll-y="true"表示垂直方向上可滚动，默认为false,如果要设置水平方向上滑动，即scroll-x="true"-->
  <scroll-view class="page__bd" wx:for="{{movies}}" wx:key="{{index}}" scroll-y="true">
    <view class="movies">
    
      <!--传参页面跳转-->
      <navigator url="../detailedInfo/detailedInfo?id={{item.id}}">
        <view class="item">
          <view class="movie__hd">
            <image class="movie" src="{{item.image}}" />
          </view>
          <view class="movie__bd">
            <text class="movie__bd_name">{{item.movieName}}</text>
            <text class="movie__bd_jd">{{item.edition}}</text>
            <text class="movie__bd_introduction">{{item.introduction}}</text>
            <text class="movie__bd_actor">{{item.actor}}</text>
          </view>
        </view>
      </navigator>
      
      <view class="movie__ft">
        <text class="movie__ft_score">{{item.score}}</text>
        <navigator url="../ticket/ticket">
          <button class="btn big">购票</button>
        </navigator>
      </view>
    </view>
  </scroll-view>
</view>
```
这个index.wxml给出了比较详细的注释，电影信息列表除了数据其他的都是一样的，所以这里用了for循环来重复渲染组件，后面的代码中也有许多地方使用了for循环；这里还使用了传参页面跳转，后面会有解释。
具体index.js实现：
```
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
    consoloe.log("onLoad");
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
    console.log("onShow");
  },
  
  // 监听页面初次渲染完成
  onReady: function() {
    console.log("onReady");
  }
})
```
我的数据是用[easy-mock](https://www.easy-mock.com/)写的，[电影信息](https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo#!method=get)是我写的一个借口，有需要可以自取哦。这个js代码中涉及到了微信小程序的生命周期函数和本地缓存，本地缓存会在后面解释，为了避免大家混淆生命周期函数的执行顺序，我把它们的执行顺序打印出来：

![](https://user-gold-cdn.xitu.io/2017/12/17/16064c8b259726db?w=607&h=167&f=png&s=18484)

### 2.电影院信息实现将数据存储在本地缓存中

![](https://user-gold-cdn.xitu.io/2017/12/17/16064d25da4412b1?w=290&h=508&f=gif&s=157697)

具体cinemas.js实现：
```
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
```
代码中使用了wx.setStorage这个API来实现将数据存储在本地缓存中，需要从本地缓存中获取数据时使用wx.getStorage即可。将数据存储在相应的key中，然后根据相应的key来获取数据，在index.js中就使用了key为"cinema"的wx.getStorage来获取选中的电影院名称；在index.js中wx.getStorage必须放在onShow函数中，不能放在onLoad函数中，因为onLoad函数一个页面只会调用一次，如果再换一个电影院，那页面是不会显示我选择的电影院的，而onShow函数是每打开页面都会调用一次，所以必须放在onShow函数中！！！

这里需要注意的是，同一个微信用户，同一个storage上限为10M，所以最好不要存储照片等内存较大的内容。
### 3.电影详情页实现传参页面跳转

![](https://user-gold-cdn.xitu.io/2017/12/17/16064e6a5d81a859?w=290&h=508&f=gif&s=1226757)
具体detailedInfo.wxml实现：
```
<!--pages/detailedInfo/detailedInfo.wxml-->
<view class="container">
    <view class="page__hd">
        <!--电影封面图片-->
        <image class="page__hd_movie" src="{{item.image}}" />
        <!--电影详情页头部背景图片-->
        <image class="page__hd_movie-background" src="{{item.image}}" />
        <view class="page__hd_info">
            <text class="info__movieName">{{item.movieName}}</text>
            <text class="info__EnglishName">{{item.EnglishName}}</text>
            <text class="info__time">{{item.time}}</text>
            <text class="info__type">{{item.type}}</text>
            <text class="info__showTime">{{item.showTime}}</text>
            <text class="info__introduction">{{item.introduction}}</text>
        </view>
        <view class="page__hd_score">
            <text class="score">9.7</text>
        </view>
    </view>
    <view class="page__bd">
        <view class="bd__movieSynopsis">{{item.synopsis}}</view>
        <view class="bd__movieParticipants">
            <scroll-view class="scroll-view_participants" scroll-x="true">
                <view class="content" style="display:inline-block">
                    <text class="movieDirector font">导演</text>
                    <view class="scroll-view__content">
                        <image class="directorImag" src="{{item.directorImage}}" />
                        <text class="director">{{item.director}}</text> 
                    </view>
                    <text class="movieActors font">演员</text>
                    <view class="scroll-view__content-actors" wx:for="{{actors}}" wx:key="{{index}}">
                        <image class="actorImage" src="{{item.image}}"/>
                        <text class="actor">{{item.name}}</text>
                        <!-- <text class="role">{{item.role}}</text> -->
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="bd__movieStills">
            <text class="image">图片</text>
            <navigator class="numbers" url="../stills/stills?id={{item.id}}">
                <text class="number">{{item.stillsNum}}></text>
            </navigator>
            <scroll-view scroll-x="true" style="white-space: nowrap;display:flex">
                <view class="stills" style="display:inline-block" wx:for="{{stills}}" wx:key="{{index}}">
                    <image class="still" src="{{item.image}}" />
                </view>
            </scroll-view>
        </view>
    </view>
    <view class="page__ft" bindtap="toTicket">
        <view class="ticket">立即购票</view>
    </view>
</view>

```
页面底部的“立即购票”是用固定定位display:fixed来实现


电影信息详情页的头部背景使用了同级元素和定位来实现，css代码如下：
```
.pege__hd {
    width: 750rpx;
    height: 382rpx;
    position: relative;
    background-color: pink;
    overflow: hidden;
}
.page__hd_movie-background {
    width: 750rpx;
    height: 150rpx;
    z-index: 1;
    filter: blur(10rpx);
}
.page__hd_movie {
    position: absolute;
    top: 26rpx;
    left: 20rpx;
    width: 224rpx;
    height: 326rpx;
    z-index: 3;
}
```
具体detailed.js实现：
```
// pages/detailedInfo/detailedInfo.js
const app = getApp()
Page({
  data: {
    item: [],
    stills: [],
    actors: [],
    key: ""
  },
  
  //点击跳转到剧照页面
  toTicket: function() {
    wx.navigateTo({
      url: "../ticket/ticket"
    })
  },
  
  onLoad: function(params) {
    var that = this;
    wx.request({
      url:'https://www.easy-mock.com/mock/5a20be8ebe1c8248fef10573/getMoviesInfo/getInfo',
      data:{},
      success: function(res){
        // console.log(res.data.data.movieDetails);
        var datas = res.data.data.movieDetails.filter((item)=>{
          return item.id == params.id;
        })
        that.setData({
          item:datas[0],
          stills:datas[0].stills,
          actors: datas[0].actors,
          key: datas[0].movieName
        });
        console.log(datas[0].movieName);
        wx.setNavigationBarTitle({
          title: that.data.key,
        })
      }
    });
  },
})
```
在onLoad函数中的形参params就是在index.wxml页面的`<navigator url="../detailedInfo/detailedInfo?id={{item.id}}">...</navigator>`中传递过来的id,params是一个json对象，params.id就是对应的id。

在index页面中点击电影需要跳转到相应的电影详细信息页面，在传递数据时我需要通过传递过来的id来筛选我需要的数据，这里使用了filter过滤器。
### 4.购票页面

![](https://user-gold-cdn.xitu.io/2017/12/17/16064f99fe21bd3d?w=290&h=508&f=gif&s=357582)
具体ticket.wxml:
```
<!--pages/ticket/ticket.wxml-->
<view class="container">
    <!--页面头部电影院信息-->
    <view class="page__hd">
        <text class="hd__store">{{store}}</text>
        <text class="hd__position">{{position}}</text>
        <image class="hd__callIcon" src="../../images/call.png" />
        <text class="hd__telephone">0791-83811878</text>
        <image class="hd__mapIcon" src="../../images/map.png" />
        <text class="hd__map">地图</text>
    </view>
    <!--页面中电影海报scroll部分-->
    <view class="page__bd">
        <view class="bgImage" style="background: url('{{bgImage}}');background-size:750rpx 280rpx;background-repeat: no-repeat;"></view>
        <scroll-view class="bd__movies" scroll-x="true" >
            <view class="movies " bindtap="chooseMovie" wx:for="{{movies}}" wx:key="{{index}}" data-index="{{index}}">
                <image class="movie {{chooseMovieIndex==index?'chooseMovie':''}}" src="{{item.image}}"/>
            </view>
        </scroll-view>
    </view>
    <!--页面底部电影票信息-->
    <view class="page__ft">
            <view class="bd__movieInfo">
                <text class="bd__movieName">{{movieName}}</text>
                <text class="bd__time bd__type">{{movieTime}}-{{movieType}}</text>
            </view>
        <view class="swiper-tab">
            <view class="swiper-tab-item {{activeIndex==0?'active':''}}" bindtap="changeTab" data-index="0">今天</view>
            <view class="swiper-tab-item {{activeIndex==1?'active':''}}" bindtap="changeTab" data-index="1">明天</view>
            <view class="swiper-tab-item {{activeIndex==2?'active':''}}" bindtap="changeTab" data-index="2">后天</view>
        </view>
        <swiper current='{{activeIndex}}' bindchange="swiperTab" style="height:100%;">
            <swiper-item>
                <view class="swiper-items">
                    <view class="swiper-item" wx:for="{{today}}" wx:key="{{index}}">
                        <view class="item__hd">
                            <text class="hd__startTime">{{item.startTime}}</text>
                            <text class="hd__endTime">{{item.endTime}}</text>
                        </view>
                        <view class="item__bd">
                            <text class="bd__language">{{item.language}}</text>
                            <text class="bd__room bd__roomType">{{item.room}} {{item.roomType}}</text>
                        </view>
                        <view class="item__ft">
                            <text class="ft__persentPrice">{{item.presentPrice}}</text>
                            <text class="ft__originalPrice">{{item.originalPrice}}</text>
                        </view>
                        <button class="btn">{{item.discountType}}</button>
                    </view>
                </view>
            </swiper-item>
            <swiper-item>
                <view class="swiper-items">
                    <view class="swiper-item" wx:for="{{tomorrow}}" wx:key="{{index}}">
                        <view class="item__hd">
                            <text class="hd__startTime">{{item.startTime}}</text>
                            <text class="hd__endTime">{{item.endTime}}</text>
                        </view>
                        <view class="item__bd">
                            <text class="bd__language">{{item.language}}</text>
                            <text class="bd__room bd__roomType">{{item.room}} {{item.roomType}}</text>
                        </view>
                        <view class="item__ft">
                            <text class="ft__persentPrice">{{item.presentPrice}}</text>
                            <text class="ft__originalPrice">{{item.originalPrice}}</text>
                        </view>
                        <button class="btn">{{item.discountType}}</button>   
                    </view>
                </view>
            </swiper-item>
            <swiper-item>
                <view class="swiper-items">
                    <view class="swiper-item" wx:for="{{afterTomorrow}}" wx:key="{{index}}">
                        <view class="item__hd">
                            <text class="hd__startTime">{{item.startTime}}</text>
                            <text class="hd__endTime">{{item.endTime}}</text>
                        </view>
                        <view class="item__bd">
                            <text class="bd__language">{{item.language}}</text>
                            <text class="bd__room bd__roomType">{{item.room}} {{item.roomType}}</text>
                        </view>
                        <view class="item__ft">
                            <text class="ft__persentPrice">{{item.presentPrice}}</text>
                            <text class="ft__originalPrice">{{item.originalPrice}}</text>
                        </view>
                        <button class="btn">{{item.discountType}}</button>   
                    </view>   
                </view>
            </swiper-item>
        </swiper>
    </view>
</view>

```
page__bd部分点击电影海报背景也随之改变，这是通过在每个电影海报上添加一个chooseMovie点击事件，然后在js代码中设置背景图片为点击的相应的海报来实现效果的。这里的背景模糊，内容不模糊也是和前面一样通过设置同级元素再用定位来实现。

page__ft中点击“今天”“明天”“后天”，swiper-item也随之滑动和滑动swiper-item，“今天”“明天”“后天”样式改变这个效果是通过给他们对应的盒子绑定同一个值activeIndex来实现的。

具体ticket.js代码实现：
```
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
```
## 结尾
最后说下我在写这个小程序时碰到的问题和解决办法
1. 如何实现在cinemas页面中点击数据，返回index页面时显示相应数据

       使用wx.setStorage和wx.getStorage来实现在本地缓存中存取和获取数据
2. 如何实现背景模糊，内容不模糊的效果

       使用同级元素，并用relative和absolute定位，在背景盒子中使用filter:blur(5px)来实现效果。这里需要注意的是一定要设置同级元素，不能使用父子，因为在父元素中使用filter属性，子元素也会模糊。
3. 数据渲染时使用for循环，for循环会带着包含for语句的那个盒子一起循环，我在写ticket页面底部电影票场次信息样式代码的时候把position:relative写在了外面的swiper-items中，导致后面数据全在一起
4. 如何实现动态设置导航条
    
        在onLoad函数的数据请求中设置导航条的信息，然后使用wx.setNavigationBarTitle设置数据

文章到这里就结束了，欢迎一起交流学习：
* qq: 2258190228
* github: [万达电影](https://github.com/nzhingg/lesson/tree/master/wxapp_wandadianying)，欢迎fork,欢迎star


记得带上心仪的她（他）去万达看电影哦！

