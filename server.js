import app from "./app.js";
import { DEFAULT_PORT } from "./src/constants/app.constants.js";
import "./src/utils/mongodb.connect.js";

const PORT = process?.env?.PORT || DEFAULT_PORT;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("An error occurred while trying to start the App Server!");
    console.error(err);
  }

  console.info(`Server listening on port ${PORT}!`);
});

server.on("error", (err) => {
  if (err) {
    console.error("An error occurred in the App Server!");
    console.error(err);
  }
});
