export interface VideoController {
    isPlaying: boolean,
    videoToggle(): void,
    pause(): void,
    play(): void,
    navigatePrev(): void,
    navigateNext(): void
}