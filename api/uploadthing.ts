import { createRouteHandler } from "uploadthing/server";

import { uploadRouter } from "../src/server/uploadthing";

const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    isDev: false,
  },
});

export default {
  fetch(request: Request) {
    return uploadthingHandler(request);
  },
};
