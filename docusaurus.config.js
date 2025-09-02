// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Politique informatique de l\'Abes',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://politique_informatique_abes_baseurl_placeholder',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'abes-esr', // Usually your GitHub org/user name.
  projectName: 'abes-politique-informatique', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  // Dépendance qui permet la recherche sur le site. Ne fonctionne pas en localhost
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
      })
    ],
    require.resolve('docusaurus-plugin-matomo')
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: ({versionDocsDirPath, docPath}) =>
            `https://github.com/abes-esr/abes-politique-developpement/edit/polinfo/${versionDocsDirPath}/${docPath}`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Politique informatique de l\'Abes',
        logo: {
          alt: 'Logo Abes',
          src: 'img/logo-abes-cercle-130x130.svg',
        },
        items: [
           //{
           //  type: 'docSidebar',
           //  sidebarId: 'tutorialSidebar',
           //  position: 'left',
           //  label: 'Documents',
           //},
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/abes-esr/abes-politique-developpement',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      footer: {
        style: 'light',
        logo: {
          alt: 'Logo Abes',
          src: 'img/logo-abes-cercle-130x130.svg',
          href: 'https://abes.fr/',
          target: '_new',
          width: 50,
          height: 50,
        },
        links: [
        ],
        copyright: `Agence bibliographique de l\'enseignement supérieur`,
      },
      // chargement des thèmes par défaut si aucun thème custom
      // prism: {
      //   theme: prismThemes.github,
      //   darkTheme: prismThemes.dracula,
      // },

       // configuration pour le relevé de statistiques - penser à renseigner le siteId lors de l'activation
      matomo: {
        matomoUrl: 'https://piwik.abes.fr/',
        siteId: '39',
        phpLoader: 'matomo.php',
        jsLoader: 'matomo.js',
      },
    }),
};

export default config;
