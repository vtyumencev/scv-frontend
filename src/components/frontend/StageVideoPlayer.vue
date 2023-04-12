<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, watch } from "vue";

const youtubeAPIisReady = ref(false);
const videoPlayer = ref<any>(null);

const props = defineProps({
    videoId: {
        type: String,
        default: null
    },
    videoController: {
        type: Object,
        default: null
    }
});

watch(() => props.videoId,(newValue) => {
    videoController.isPlaying.value = false;
    videoPlayer.value.destroy();
    youtubePlayerInit();
})

const videoController = toRefs(props.videoController)

onMounted(() => {
    youtubePlayerInit();
})

onUnmounted(() => {
    console.debug('Player has been destroyed');
    videoPlayer.value.destroy();
});

const youtubeAPIPrepare = () => {

    return new Promise((resolve) => {
        if (document.getElementById('youtube-iframe-api')) {
            resolve(true);
        }

        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            console.debug('Youtube API is ready');
            youtubeAPIisReady.value = true;
            resolve(true);
        }
    })
}
const youtubePlayerInit = async () => {

    if (! youtubeAPIisReady.value) {
        await youtubeAPIPrepare();
    }

    if (! props.videoId) {
        return;
    }

    videoPlayer.value = new window.YT.Player('stage-video-player', {
        videoId: props.videoId,
        playerVars: {
            rel: 0,
            modestbranding: 0,
        },
        events: {
            'onReady': () => {
                //videoPlayer.value.playVideo();
            },
            'onStateChange': (data: { data: number, target: HTMLElement }) => {
                if (data.data === window.YT.PlayerState.PLAYING || data.data === window.YT.PlayerState.BUFFERING) {
                    videoController.isPlaying.value = true;
                }
                if (data.data === window.YT.PlayerState.PAUSED || data.data === window.YT.PlayerState.ENDED) {
                    videoController.isPlaying.value = false;
                }
            }
        }
    });
}

videoController.videoToggle.value = () => {
    if (videoController.isPlaying.value) {
        videoPlayer.value.pauseVideo();
    } else {
        videoPlayer.value.playVideo();
    }
}

videoController.pause.value = () => {
    videoPlayer.value.pauseVideo();
}

videoController.play.value = () => {
    videoPlayer.value.playVideo();
}

</script>

<template>
    <div id="stage-video-player"></div>
</template>