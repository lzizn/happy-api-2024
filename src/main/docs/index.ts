import paths from "./paths";
import components from "./components";
import schemas from "./schemas";

export default {
  openapi: "3.0.0",
  info: {
    title: "Happy - Connect people with near orphanages",
    version: "1.0.0",
    contact: {
      name: "Laian Braum",
      email: "braumlaian@gmail.com",
      url: "https://www.linkedin.com/in/laianbraum",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Main",
    },
  ],
  paths,
  schemas,
  components,
};
