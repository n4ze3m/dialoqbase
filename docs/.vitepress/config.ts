import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dialoqbase",
  description: "Create chatbots with ease",
  lastUpdated: true,
  head: [
    [
      "script",
      {
        src: "https://static.cloudflareinsights.com/beacon.min.js",
        "data-cf-beacone": '{"token": "7bc549b39629497a9668db8e00ec41eb"}',
        defer: "",
      },
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
        ],
      },
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
