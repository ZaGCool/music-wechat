// pages/lrcs/lrcs.js
import url from "../../config/urllib.js"
let app = getApp()
Page({
  data: {
    lrcs:{
      "0":"歌词正在加载中……"
    },
    currentLrc:''
  },
  onLoad: function (options) {
    let {id } = options

    wx.request({
      url: `${url.lrcUrl}?id=${id}`,
      success:res=>{
        //console.log(res)

        // 获取歌词字符串
        let lrc = res.data.lrc.lyric
        // 使用正则进行匹配
        let re = /\[(.*?)](.*)/g
        let obj = {}
        lrc.replace(re,($0,$1,$2)=>{
          //console.log($1,$2)
          
          obj[$1.substring(0, 5)] = $2
        
        })
        this.setData({
          lrcs:obj
        })
        for(let k in this.data.lrcs){
          app.globalData.lrcs.push(k);
        }
        
      }
    })

     let {song} = app.globalData
      song.currentTime;
      song.onTimeUpdate(res => {
        // 歌词滚动
        // 从全局的音频对象中 获取当前的时间
        let { currentTime: c } = app.globalData.song
        // 进行分秒的处理 得到    "00:24"
        let min = Math.floor(c / 60)
        let sec = Math.floor(c % 60)
        let attr = (min < 10 ? "0" + min : "" + min) + ":" + (sec < 10 ? "0" + sec : "" + sec);
        console.log(attr)

        // 从全局获取lrcs 时间数组查找是否有attr当前时间值 如果有 将全局的当前currentLrc设置 'el-00:24'
        if (app.globalData.lrcs.indexOf(attr) != -1 && "el-" + attr != app.globalData.currentLrc) {
          console.log(123)
          app.globalData.currentLrc = "el-" + attr
          
          this.setData({
            currentLrc: app.globalData.currentLrc
          })
        }
      })
   


  }
})