/** @jsxImportSource react */
import { createFileRoute } from "@tanstack/solid-router";
import { ImageResponse } from "@vercel/og";

export const Route = createFileRoute("/{-$locale}/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const title = url.searchParams.get("title") || "Ben Gubler";
        const description =
          url.searchParams.get("description") ||
          "Web development, AI, and building things that matter.";

        return new ImageResponse(
          <div
            style={{
              alignItems: "center",
              background: "#faf6ef",
              color: "#2a2722",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              padding: "72px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ color: "#807668", display: "flex", fontSize: 30 }}>
                bengubler.com
              </div>
              <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05 }}>
                {title}
              </div>
              <div style={{ color: "#4a443c", display: "flex", fontSize: 34 }}>
                {description}
              </div>
            </div>
          </div>,
          { width: 1200, height: 630 },
        );
      },
    },
  },
});
