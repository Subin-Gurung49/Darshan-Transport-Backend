import express from "express";
import routes from "@routes/index";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Apply middleware

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

export default app;
