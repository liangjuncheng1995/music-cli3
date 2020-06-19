import { getLyric } from "@/api/song.js";
import { ERR_OK } from "@/api/config";
import { Base64 } from 'js-base64';
export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
    async getLyric() {
        if(this.lyric) {
            return this.lyric
        }
        var result = await getLyric(this.mid)
        if(result.retcode === ERR_OK) {
            this.lyric = Base64.decode(result.lyric)
            return this.lyric
        } else {
            return 'no lyric'
        }
    }
}


export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterString(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        
        // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
        // url:`https://thirdparty.gting.com/${musicData.songid}.m4a?fromtag=38`
        // url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C100${musicData.songmid}.m4a?fromtag=38`
    })
}

function filterString(singer) {//组装合唱的歌手名
    let ret = []
    if(!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}