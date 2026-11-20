import { defineConfig } from "vite";

function videoMimeHeaders() {
  const setVideoMime = (request, response, next) => {
    const pathname = request.url?.split("?")[0].toLowerCase();
    if (pathname?.endsWith(".m4v")) response.setHeader("Content-Type", "video/mp4");
    next();
  };

  return {
    name: "charlie-video-mime",
    configureServer(server) {
      server.middlewares.use(setVideoMime);
    },
    configurePreviewServer(server) {
      server.middlewares.use(setVideoMime);
    }
  };
}

export default defineConfig({
  plugins: [videoMimeHeaders()]
});
