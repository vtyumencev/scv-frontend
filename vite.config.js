import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    plugins: [
        vue(),
        svgLoader({
            //defaultImport: 'raw'
        }),
    ],
    build: {
        rollupOptions: {
            // https://rollupjs.org/guide/en/#outputmanualchunks
            output: {
                manualChunks: {
                    'index-desk-masks': [
                        '/src/components/masks/desk/leipzig.svg',
                        '/src/components/masks/map/leipzig.svg',
                        '/src/components/masks/desk/dresden.svg',
                        '/src/components/masks/map/dresden.svg',
                        '/src/components/masks/desk/chemnitz.svg',
                        '/src/components/masks/map/chemnitz.svg',
                        '/src/components/masks/desk/ost.svg',
                        '/src/components/masks/map/ost.svg',
                        '/src/components/masks/desk/west.svg',
                        '/src/components/masks/map/west-2.svg',
                        '/src/components/masks/desk/nord.svg',
                        '/src/components/masks/map/north.svg',
                        '/src/components/masks/desk/kinder-jugend.svg',
                        '/src/components/masks/desk/proberaum.svg',
                        '/src/components/masks/desk/mediathek.svg',
                        '/src/components/masks/desk/neutral.svg',
                    ]
                },
            },
        }
    }
})
