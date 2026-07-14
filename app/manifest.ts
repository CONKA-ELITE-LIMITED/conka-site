import type { MetadataRoute } from "next";
import { BRAND_DESCRIPTION, COMPANY } from "@/app/lib/site";

/**
 * Web app manifest (SCRUM-1141). A brand-identity signal alongside the
 * Organization JSON-LD, and what a browser reads when a user adds the site to
 * their home screen. Icon is the existing 512x512 `app/icon.png`, served at
 * /icon.png by Next's file-based icon convention.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.name} - Daily Nootropic Brain Shots`,
    short_name: COMPANY.name,
    description: BRAND_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
