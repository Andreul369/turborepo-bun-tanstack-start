import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// tsconfigPaths is the plugin that enables path aliases
const config = defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json', '../api/tsconfig.json', '../../packages/ui/tsconfig.json'],
    }),
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
    tanstackStart(),
    nitro({ preset: 'bun' }),
    viteReact({
      // https://react.dev/learn/react-compiler
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              target: '19',
            },
          ],
        ],
      },
    }),
    tailwindcss(),
  ],
});

export default config;
