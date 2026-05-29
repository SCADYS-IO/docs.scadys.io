import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Scadys Docs',
  favicon: 'img/favicon.svg',

  url: 'https://docs.scadys.io',
  baseUrl: '/',

  organizationName: 'SCADYS-IO',
  projectName: 'docs.scadys.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mdd400-v29',
        path: 'mdd400-v2.9',
        routeBasePath: 'mdd400/v2.9',
        sidebarPath: './sidebars-mdd400-v2.9.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'wti400-v12',
        path: 'wti400-v1.2',
        routeBasePath: 'wti400/v1.2',
        sidebarPath: './sidebars-wti400-v1.2.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-duo-v11',
        path: 'canbench-duo-v1.1',
        routeBasePath: 'canbench-duo/v1.1',
        sidebarPath: './sidebars-canbench-duo-v1.1.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-duo-v12',
        path: 'canbench-duo-v1.2',
        routeBasePath: 'canbench-duo/v1.2',
        sidebarPath: './sidebars-canbench-duo-v1.2.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-truez-v11',
        path: 'canbench-truez-v1.1',
        routeBasePath: 'canbench-truez/v1.1',
        sidebarPath: './sidebars-canbench-truez-v1.1.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-truez-v12',
        path: 'canbench-truez-v1.2',
        routeBasePath: 'canbench-truez/v1.2',
        sidebarPath: './sidebars-canbench-truez-v1.2.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'about',
        path: 'about',
        routeBasePath: 'about',
        sidebarPath: './sidebars.js',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'SCADYS.IO',
        logo: {
          alt: 'Scadys Logo',
          src: 'img/logo.svg',
        },
        items: [
          {label: 'MDD400', to: '/mdd400/v2.9', position: 'left'},
          {label: 'WTI400', to: '/wti400/v1.2', position: 'left'},
          {
            type: 'dropdown',
            label: 'CANBench Duo',
            to: '/canbench-duo/v1.1',
            position: 'left',
            items: [
              {label: 'v1.1 — fabricated prototype (current)', to: '/canbench-duo/v1.1'},
              {label: 'v1.2 — schematic refresh (next version)', to: '/canbench-duo/v1.2'},
            ],
          },
          {
            type: 'dropdown',
            label: 'CANBench TrueZ',
            to: '/canbench-truez/v1.1',
            position: 'left',
            items: [
              {label: 'v1.1 — fabricated prototype (current)', to: '/canbench-truez/v1.1'},
              {label: 'v1.2 — schematic refresh (next version)', to: '/canbench-truez/v1.2'},
            ],
          },
          {label: 'About', to: '/about', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Documentation generated and maintained with AI assistance — verify critical values against source schematics · <a href="https://github.com/SCADYS-IO/docs.scadys.io/discussions" style="color:inherit;text-decoration:underline">Submit feedback or corrections</a><br/>Copyright © ${new Date().getFullYear()} GM Consolidated Holdings Pty Ltd. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
