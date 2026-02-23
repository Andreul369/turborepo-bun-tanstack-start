import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: '../../packages/i18n/project.inlang',
      outdir: '../../packages/i18n/src/paraglide',
      outputStructure: 'message-modules',
      cookieName: 'paraglide-locale',
      strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
      urlPatterns: [
        {
          pattern: '/:path(.*)?',
          localized: [
            ['de', '/de/:path(.*)?'],
            ['es', '/es/:path(.*)?'],
            ['fr', '/fr/:path(.*)?'],
            ['it', '/it/:path(.*)?'],
            ['en', '/:path(.*)?'],
          ],
        },
      ],
    }),
    nitro({ preset: 'bun' }),
    // this is the plugin that enables path aliases
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});

export default config;
