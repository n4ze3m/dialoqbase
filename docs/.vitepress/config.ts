import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dialoqbase",
  description: "Create chatbots with ease",
  lastUpdated: true,
  head: [
    // [
    //   "script",
    //   {
    //     src: "https://static.cloudflareinsights.com/beacon.min.js",
    //     "data-cf-beacone": '{"token": "7bc549b39629497a9668db8e00ec41eb"}',
    //     defer: "",
    //   },
    // ],
    [
      "script",
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-226TFN36Z7",
        async: "",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-226TFN36Z7');
      `,
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/what-is-dialoqbase" },
      { text: "Self Hosting", link: "/guide/self-hosting" },
    ],

    sidebar: [
      {
        text: "Introduction",
        collapsed: false,
        items: [
          { text: "What is Dialoqbase", link: "/guide/what-is-dialoqbase" },
          { text: "Why Dialoqbase", link: "/guide/why-dialoqbase" },
        ],
      },
      {
        text: "Self Hosting",
        collapsed: false,
        items: [
          {
            text: "Local Setup",
            link: "/guide/self-hosting",
          },
          {
            text: "Railway Setup",
            link: "/guide/self-hosting-railway",
          },
          {
            text: "Upgrading (local)",
            link: "/guide/upgrading-local",
          },
        ],
      },
      {
        text: "Integrations (beta)",
        collapsed: false,
        items: [
          {
            text: "Telegram",
            link: "/guide/integration/telegram",
          },
          {
            text: "Discord (experimental)",
            link: "/guide/integration/discord",
          }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/n4ze3m/dialoqbase" },
      { icon: "twitter", link: "https://twitter.com/dialoqbase" },
      { icon: "discord", link: "https://discord.com/invite/SPE3npH7Wu" },
    ],
    footer: {
      message: "MIT Licensed Open Source Project",
      copyright: "Copyright © 2023 Muhammed Nazeem",
    },
  },
});
