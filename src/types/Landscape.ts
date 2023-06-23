import type { Video } from "@/types/Video";
import type { Place } from "@/types/Place";

export interface Landscape {
    name: string,
    background_image: string | null,
    background_image_dark: string | null,
    title_gen: string,
    videos_filter: () => Video[],
    has_no_enter_room?: boolean,
    /**
     * Default place to be shown instead of selected place for a video
     */
    bound_place?: Place;
}