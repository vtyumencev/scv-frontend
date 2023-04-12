import type { Video } from "./Video";

export interface Choir {
    id: number,
    name: string,
    region_id: number,
    type_id: number,
    direction: string
    rehearsal_time: string,
    contact_address: string,
    contact_phone: string,
    contact_email: string,
    contact_website: string,
    description: string,
    videos: Video[] | undefined,
    created_at: string
}