import e from "express";

// Routes imports
import UsersRouter from "./src/routes/users.router.js";

// Express app instance
const app = e();

// Express app middlewares.
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

// Express app routes.
app.use("/api/users", UsersRouter);

// Default app export
export default app;