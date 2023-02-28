import type { Video } from "./Video";

export interface Choir {
    id: number,
    name: string,
    region_id: number,
    type_id: number,
    director: string
    rehearsal_time: string,
    contact_address: string,
    contact_phone: string,
    contact_email: string,
    contact_website: string,
    description: string,
    videos: Array<Video>
}