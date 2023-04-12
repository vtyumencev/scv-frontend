import type {Video} from "@/types/Video";
import type {Choir} from "@/types/Choir";

export interface VideosFilter {
    filterCallback(videos: Video, selectedAttributes: string[]): boolean
}