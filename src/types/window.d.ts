export { }
declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        YT: any,
        onYouTubeIframeAPIReady(): any,
        test(): any
    }
}