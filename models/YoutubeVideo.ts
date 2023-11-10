import * as dotenv from "dotenv";
import { ColumnType } from "../Database/ColumnType";

const env = dotenv.config();
const YT_API_KEY = env?.parsed?.YOUTUBE_API_KEY as string;

interface IYoutubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
}

export default class YoutubeVideo implements IYoutubeVideo {
    @ColumnType('string')
    id: string ='';
    @ColumnType('string')
    title: string='';
    @ColumnType('string')
    description: string='';
    @ColumnType('string')
    thumbnail: string='';
    @ColumnType('string')
    publishedAt: string='';
    @ColumnType('string')
    channelId: string='';
    @ColumnType('string')
    channelTitle: string='';
    constructor(id: string, title: string, description: string, thumbnail: string, publishedAt: string, channelId: string, channelTitle: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
        this.publishedAt = publishedAt;
        this.channelId = channelId;
        this.channelTitle = channelTitle;
    }
}

export class YoutubeHelper{

    static getVideoIdFromUrl(url: string): string {
        const videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return videoId.substring(0, ampersandPosition);
        }
        return videoId;
    }

    static getVideoUrlFromId(id: string): string {
        return `https://www.youtube.com/watch?v=${id}`;
    }

    static getEmbedUrlFromId(id: string): string {
        return `https://www.youtube.com/embed/${id}`;
    }

    static getThumbnailFromId(id: string): string {
        return `https://img.youtube.com/vi/${id}/0.jpg`;
    }

    static retrieveVideoInfoFromId(id: string): Promise<IYoutubeVideo> {
        return new Promise<IYoutubeVideo>((resolve, reject) => {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YT_API_KEY}`;
            fetch(url)
                .then(res => res.json())
                .then(json => {
                    const video = json.items[0];
                    const videoId = video.id;
                    const videoTitle = video.snippet.title;
                    const videoDescription = video.snippet.description;
                    const videoThumbnail = video.snippet.thumbnails.default.url;
                    const videoPublishedAt = video.snippet.publishedAt;
                    const videoChannelId = video.snippet.channelId;
                    const videoChannelTitle = video.snippet.channelTitle;
                    const youtubeVideo = new YoutubeVideo(videoId, videoTitle, videoDescription, videoThumbnail, videoPublishedAt, videoChannelId, videoChannelTitle);
                    resolve(youtubeVideo);
                })
                .catch(err => reject(err));
        });
    }

}