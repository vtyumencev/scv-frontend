import type { Video } from "@/types/Video";

export interface Preset {
    name: string,
    backgroundImage: string,
    title_gen: string,
    videosFilter: () => Video[],
    has_no_enter_room?: boolean
}