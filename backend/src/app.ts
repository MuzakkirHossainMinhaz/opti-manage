import cors from "cors";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";
import ErrorHandler from "./middlewares/ErrorHandler";
import router from "./routes";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api", router);

// default route
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 404 route
app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "404! This Route Not Found.",
    path: `${req.params[0]}`,
  });
});

// global error handler
app.use(ErrorHandler);

export default app;
