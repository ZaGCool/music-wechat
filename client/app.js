//app.js
App({
  globalData: {
    // 当前的song为音频上下文对象
    song:null,
    // 单个榜单的歌曲的列表
    song_list: null,
    // 当前的lrc时间 比如 “00:24”
    currentLrc:"",
    // 当前歌曲的lrcs的时间key的存储数据
    lrcs:[]
  }
})