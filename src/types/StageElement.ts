export interface StageElement {
    width: number,
    top: number,
    left: number,
    deathStrengthX: number,
    deathStrengthY: number,
    assets: {
        light: string,
        dark: string
    },
    textBoxTranslation?: string
}