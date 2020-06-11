const state = {
    singer: {},
    playing: false, //播放的状态
    playlist: [], //设置播放列表，初始值为空
    currentIndex: -1, //保存用户点击了哪一首歌曲，默认是-1
    fullScreen: false, //正常的播放器是否正常加载，与模拟播放器的状态是相反的，只能显示一个
}

export default state