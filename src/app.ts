import express from "express";
import router from "@routes/delivery.routes";
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
app.use("/api", router);
app.use("/", routes);

export default app;
