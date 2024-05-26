import type {RouteLocationRaw} from "vue-router";
import type {Component, Ref} from "vue";

export interface BookObject {
    name: string | null|Ref,
    is_in_book?: boolean,
    route?: RouteLocationRaw,
    order: number,
    z_index: number,
    front_object: {
        left: number,
        bottom: number,
        width: number,
        asset_url: string,
        asset_mask_component?: string | Component
    },
    map_mask?: {
        left: number,
        bottom: number,
        width: number,
        asset_component: string,
    },
    is_label_centered?: boolean
}