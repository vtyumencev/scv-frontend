export interface Place {
    stageElements: Array<{
        width: number,
        top: number,
        left: number,
        deathStrengthX: number,
        deathStrengthY: number,
        assets: {
            light: string,
            dark: string
        }
    }>,
}