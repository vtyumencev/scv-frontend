import type {Ref} from "vue";

export interface Translation {
    type: string,
    default: string,
    value: Ref<string>
}