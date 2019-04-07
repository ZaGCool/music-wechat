// pages/list/list.js
import url from '../../config/urllib.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    m_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    // option接受url传过来的参数 并进行解构
    let {id, type} = options
    console.log(id)
    // 发起请求 获取当前榜单的音乐 
    wx.request({
      url: `${url.listUrl}?idx=${id}`,
      success:res=>{
        console.log(res)
        // 成功获取数据之后进行截取前10条
        this.setData({
          m_list:res.data.playlist.tracks.slice(0,10)
        })
        // 设置导航条的标题为当前的type文字
        wx.setNavigationBarTitle({
          title: type
        })
        // 将当前歌曲数组 存入到全局变量中
        app.globalData.song_list = this.data.m_list
      }
    })
  },
  tap(e){
    // 通过tap事件触发 获取当前目标对象绑定的数据 id
    let {id} = e.currentTarget.dataset;
  
    //console.log(id)
    // 跳转到播放页面 携带对应歌曲的id过去
    wx.navigateTo({
      url: '/pages/play/play?id='+id,
    })

  }
})