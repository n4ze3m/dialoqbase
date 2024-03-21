import { DefaultTheme, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dialoqbase",
  description: "Create chatbots with ease",
  lastUpdated: true,
  head: [
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
    logo: "/logo.png",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Guide", link: "/guide/what-is-dialoqbase" },
      { text: "Reference", link: "/reference/getting-started" },
      { text: "Self Hosting", link: "/guide/self-hosting" },
    ],

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/reference/': { base: '/reference/', items: sidebarReference() }
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/n4ze3m/dialoqbase" },
      { icon: "twitter", link: "https://twitter.com/dialoqbase" },
      { icon: "discord", link: "https://discord.com/invite/SPE3npH7Wu" },
    ],
    footer: {
      message: "MIT Licensed Open Source Project",
      copyright: "Copyright © 2024 Muhammed Nazeem  & Dialoqbase Contributors",
    },
  },
  sitemap: {
    hostname: "https://dialoqbase.n4ze3m.com",
  },
});


function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Introduction",
      collapsed: false,
      items: [
        { text: "What is Dialoqbase", link: "/what-is-dialoqbase" },
        { text: "Why Dialoqbase", link: "/why-dialoqbase" },
      ],
    },
    {
      text: "Self Hosting",
      collapsed: false,
      items: [
        {
          text: "Local Setup",
          link: "/self-hosting",
        },
        {
          text: "Railway Setup",
          link: "/self-hosting-railway",
        },
        {
          text: "Upgrading (local)",
          link: "/upgrading-local",
        },
      ],
    },
    {
      text: "Integrations",
      collapsed: false,
      items: [
        {
          text: "Telegram",
          link: "/integration/telegram",
        },
        {
          text: "Discord",
          link: "/integration/discord",
        },
        {
          text: "Whatsapp (beta)",
          link: "/integration/whatsapp",
        },
      ],
    },
    {
      text: "Development",
      collapsed: false,
      items: [
        {
          text: "Running locally for development",
          link: "/running-locally-for-development",
        },
      ],
    },
    {
      text: "Application",
      collapsed: false,
      items: [
        {
          link:
            "/application/enabling-disabling-user-registration-in-dialoqbase",
          text: "Enabling/Disabling User Registration",
        },
        {
          link: "/application/adjusting-bots-creation-limit-in-dialoqbase",
          text: "Adjusting Bots Creation Limit For Users",
        },
        {
          link:"/application/setting-up-dialoqbase-queue-concurrency",
          text:"Setting up Dialoqbase Queue Concurrency"
        }
      ],
    },
    {
      text: "AI Providers",
      collapsed: false,
      items: [
        {
          text: "Use Local AI Models",
          link: "/localai-model",
        },
        {
          text: "Fireworks",
          link: "/ai-providers/fireworks",
        },
        {
          text: "OpenAI",
          link: "/ai-providers/openai",
        },
        {
          text: "Google",
          link: "/ai-providers/google",
        },
        {
          text: "HuggingFace",
          link: "/ai-providers/huggingface",
        },
        {
          text: "Cohere",
          link: "/ai-providers/cohere",
        },
        {
          text: "Jina",
          link: "/ai-providers/jina",
        },
      ],
    },
  ]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Reference",
      items: [
        {
          text:"Getting Started",
          link:"/getting-started"
        },
        {
          text: "Create Bot",
          link: "/create-bot",
        },
        {
          text: "Add Source",
          link: "/add-source",
        },
        {
          text: "Add File Source",
          link: "/add-file-source",
        },
        {
          text: "Chat with Bot",
          link: "/chat-with-bot",
        }
      ]
    }
  ]
}