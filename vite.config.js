import tailwindcss from "@tailwindcss/vite";
import laravel from "laravel-vite-plugin";
import react from '@vitejs/plugin-react';
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    // resolve: {
    //     alias: {
    //         '@': '/resources/js',
    //     },
    // },
});
