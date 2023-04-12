import type {RouteLocationRaw} from "vue-router";

export interface BookObject {
    name: string | null,
    is_in_book: boolean,
    route: RouteLocationRaw | null,
    order: number,
    front_object: {
        left: number,
        bottom: number,
        width: number,
        asset_url: string,
        asset_mask_component: string | null
    },
    map_mask: {
        left: number,
        bottom: number,
        width: number,
        asset_component: string,
    } | null
}