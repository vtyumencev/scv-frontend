import type {Video} from "@/types/Video";

export interface VideosFilter {
    filterCallback(videos: Video, selectedAttributes: string[]): boolean
}