import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    plugins: [
        vue(),
        svgLoader()
    ],
    build: {
        rollupOptions: {
            // https://rollupjs.org/guide/en/#outputmanualchunks
            output: {
                manualChunks: {
                    'index-desk-masks': [
                        './public/images/homepage/masks/desk/leipzig.svg',
                        './public/images/homepage/masks/map/leipzig.svg',
                        './public/images/homepage/masks/desk/dresden.svg',
                        './public/images/homepage/masks/map/dresden.svg',
                        './public/images/homepage/masks/desk/chemnitz.svg',
                        './public/images/homepage/masks/map/chemnitz.svg',
                        './public/images/homepage/masks/desk/ost.svg',
                        './public/images/homepage/masks/map/ost.svg',
                        './public/images/homepage/masks/desk/west.svg',
                        './public/images/homepage/masks/map/west-2.svg',
                        './public/images/homepage/masks/desk/nord.svg',
                        './public/images/homepage/masks/map/north.svg',
                        './public/images/homepage/masks/desk/kinder-jugend.svg',
                        './public/images/homepage/masks/desk/proberaum.svg',
                        './public/images/homepage/masks/desk/mediathek.svg',
                        './public/images/homepage/masks/desk/neutral.svg',
                    ]
                },
            },
        }
    }
})
