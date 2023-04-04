import type {Video} from "@/types/Video";
import type {Choir} from "@/types/Choir";


export interface VideosFilter {
    selected: string[],
    is_active: boolean,
    filterCallback(videos: Video, selectedAttributes: string[]): boolean
}