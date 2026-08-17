// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // GitHub Pages is static. Netlify uses TanStack Start's native server adapter.
    ...(isGitHubPagesBuild
      ? {
          spa: { enabled: true },
        }
      : {}),
  },
  vite: {
    // GitHub Pages is a project site; Netlify and local development use the root path.
    base: isGitHubPagesBuild ? "/RCCzoundja/" : "/",
    // GitHub Pages needs a Node-compatible prerendering server. Netlify uses its
    // native Vite/Nitro integration and must not receive this Node server preset.
    ...(isGitHubPagesBuild ? { plugins: [nitro({ preset: "node-server" })] } : {}),
  },
});
