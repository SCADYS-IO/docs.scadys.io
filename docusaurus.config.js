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
        id: 'mdd400',
        path: 'mdd400',
        routeBasePath: 'mdd400',
        sidebarPath: './sidebars-mdd400.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'wti400',
        path: 'wti400',
        routeBasePath: 'wti400',
        sidebarPath: './sidebars.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-duo',
        path: 'canbench-duo',
        routeBasePath: 'canbench-duo',
        sidebarPath: './sidebars.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'canbench-truez',
        path: 'canbench-truez',
        routeBasePath: 'canbench-truez',
        sidebarPath: './sidebars.js',
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
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'SCADYS.IO',
        logo: {
          alt: 'Scadys Logo',
          src: 'img/logo.svg',
        },
        items: [
          {label: 'MDD400', to: '/mdd400', position: 'left'},
          {label: 'WTI400', to: '/wti400', position: 'left'},
          {label: 'CANBench Duo', to: '/canbench-duo', position: 'left'},
          {label: 'CANBench TrueZ', to: '/canbench-truez', position: 'left'},
          {label: 'About', to: '/about', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Scadys`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
