import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
