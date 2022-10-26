import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import p from './package.json';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            solidPlugin(),
            {
                enforce: 'pre',
                resolveId(id) {
                    if (id === 'viewerjs') {
                        return {
                            external: true,
                            id: 'https://cdn.jsdelivr.net/npm/viewerjs/dist/viewer.esm.min.js',
                        };
                    }
                },
            },
            mode === 'analyze' &&
                (visualizer({ open: true, filename: 'visualizer/stat.html' }) as any),
        ],
        server: {
            port: 3000,
        },
        resolve: {
            alias: {
                // '@cn-ui/sortable': './src/components/sortable/index',
                // viewerjs: 'https://unpkg.com/viewerjs',
            },
        },
        define: {
            __version__: JSON.stringify(p.version),
        },
        optimizeDeps: {
            include: [
                'lodash-es',
                'copy-to-clipboard',
                'viewerjs',
                '@vant/area-data',
                'mitt',
                'zxcvbn',
            ],
            exclude: ['@cn-ui/core'],
        },
    };
});
