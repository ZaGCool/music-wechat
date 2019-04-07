// pages/play/play.js
import url from "../../config/urllib.js"
// 从全局方法中获取当前的全局app对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放歌曲对象
    song:{},
    // 歌曲总时间
    duration:0,
    // 当前播放时间
    current:0,
    // 拖拽播放滑块的控制
    isDown:true,
    // 播放按钮的图片切换
    playSrc:"../../assets/images/pause.png",
    // 旋转图片的状态控制
    isRot:'running'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当页面加载的时候 获取导航url传过来的参数
    let {id} = options 
    console.log("===="+id)
    // id = 1346104327
    // id = 536570450
    // 发起请求 获取对应的歌曲详情
    wx.request({
      url: `${url.songUrl}?ids=${id}`,
      success:res=>{
        //console.log(res)
        // 将对应的歌曲对象信息 设置到song数据中
        this.setData({
          song:res.data.songs[0]
        })

        // 设置标题为当前的歌名
        wx.setNavigationBarTitle({
          title: this.data.song.name
        })

      }
    })
    

    // 将全局的song进行解构
    let { song } = app.globalData;
    // 如果song为空，首次赋值， 使用wx创建一个内置音频上下文对象 赋给全局song变量
    if (!song){
      song = app.globalData.song = wx.createInnerAudioContext()
    }
    // song 相当于全局的song 这里直接使用进行操作
    // 设置src 音频地址  执行暂停方法  播放方法  触发播放事件打印当前播放的音频上下文对象
    song.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    song.pause()
    song.play()
    song.onPlay(res=>{
      console.log('开始播放了')
    })
    // 延迟0.5秒 执行 歌曲进度更新的事件
    setTimeout(()=>{
      // 执行这步 后面才可以触发事件 ？
      song.currentTime;
      song.onTimeUpdate(res => {
        //console.log(song.duration)
        // 获取当前的音频时间 判断当前的数据duration是否不相同 此时进行更新
        if (this.data.duration != song.duration) {
          this.setData({
            duration: song.duration
          })
        }
        // 如果isDown是true 则 更新当前的current时间
        if(this.data.isDown){
          this.setData({
            current:song.currentTime
          }) 
        }

       
        
      })
    },500)
  },
  changing(e){
    // 当 正在拖动滑块的时候 设置isDown为false 不改变当前时间的变量
    this.setData({
      isDown:false
    })
  },
  changed(e){
    // 当拖动完毕之后 设置isDown为true 设置当前的时间
    //console.log(e.detail)  // 从事件对象的详情中获取当前滑块的value值 
    this.setData({
      isDown:true,
      current:e.detail.value  
    })
    // 设置全局音频song对象的音频轨道定位在 当前值
    app.globalData.song.seek(e.detail.value);
    
  },
  mode_tap(){

  },
  play_tap(e){
    // 点击播放 解构song音频对象
    let {song } = app.globalData
    // 根据是否暂停 来进行切换 播放和暂停方法 并设置按钮的图片地址 和旋转图片的状态
    if(song.paused){
      song.play();
      this.setData({
        playSrc: '../../assets/images/pause.png',
        isRot:"running"
      })
     
    }else{
      song.pause();
      this.setData({
        playSrc: '../../assets/images/play.png',
        isRot: "paused"
      })
    }
  },
  toggle_tap(action){
    let { song_list: arr, song } = app.globalData

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == this.data.song.id) {
        if(action=='prev'){
          if (arr[i - 1].id) {
            wx.navigateTo({
              url: '/pages/play/play?id=' + arr[i - 1].id,
            })
          } else {
            console.log('已经是第一页了')
          }

        }else if(action == 'next'){
          if (arr[i + 1].id) {
            wx.navigateTo({
              url: '/pages/play/play?id=' + arr[i + 1].id,
            })
          } else {
            console.log('已经是最后一页了')
          }
        }
       

      }
    }
  },
  prev_tap(){
    this.toggle_tap('prev')
  },
  next_tap(){
    this.toggle_tap('next')
  },
  menu_tap(){
    // 当点击tap事件 则导航跳转到lrcs页面 携带当前的歌曲的id过去
    wx.navigateTo({
      url: '/pages/lrcs/lrcs?id='+this.data.song.id,
    })
  }
   
})