export interface Video {
    id: number,
    title: string,
    source_vid: string,
    composer: string,
    duration: number,
    source_id: number,
    source_thumbnail_url: string,
    season_id: number,
    style_id: number,
    place_id: number,
    genre_id: number,
    text: string,
    is_kids_and_youth: boolean,
    is_rehearsal: boolean,
    choir_id: number,
    choir_leader: string | null,
    landscape_id: number | null
}