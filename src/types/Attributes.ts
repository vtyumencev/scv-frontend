import type { Attribute } from "./Attribute"
import type { AttributeLandscape } from "@/types/AttributeLandscape";
import type { AttributePlace } from "@/types/AttributePlace";

export interface Attributes {
    choir_types: Attribute[],
    genres: Attribute[],
    places: AttributePlace[],
    styles: Attribute[],
    regions: Attribute[],
    landscapes: AttributeLandscape[],
}