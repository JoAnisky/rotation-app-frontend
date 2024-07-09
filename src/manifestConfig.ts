interface Icon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

interface Screenshots extends Icon {
  form_factor?: string;
  label: string;
}
interface Manifest {
  name: string;
  short_name: string;
  description: string;
  icons: Icon[];
  theme_color: string;
  background_color: string;
  display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  scope: string;
  start_url: string;
  orientation:
    | "any"
    | "natural"
    | "landscape"
    | "landscape-primary"
    | "landscape-secondary"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary";
  screenshots: Screenshots[];
}

interface ManifestForPlugIn {
  registerType: "prompt" | "autoUpdate";
  includeAssets: string[];
  manifest: Manifest;
}

export const manifestForPlugIn: ManifestForPlugIn = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable_icon.png"],
  manifest: {
    name: "Youturn",
    short_name: "Youturn",
    description: "Application de gestion des rotations des équipes sur les différents stands",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#171717",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    screenshots: [
      {
       src: "/desktop_screenshot.png",
        sizes: "800x463",
        type: "image/png",
        form_factor: "wide",
        label: "Youturn - Rotation manager"
      },
      {
       src: "/mobile_screenshot.png",
        sizes: "715x1267",
        type: "image/png",
        label: "Youturn - Rotation manager"
      }
  ]
  }
};
