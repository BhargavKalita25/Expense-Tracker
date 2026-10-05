import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { initDB } from "./config/db.js";

const PORT = process.env.PORT || 5100;

function bootstrap() {
  try {
    initDB();
    app.listen(PORT, () => {
      console.log(`Expense Tracker API server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
}

bootstrap();
