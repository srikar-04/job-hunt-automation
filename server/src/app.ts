import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import ApiError from "./utils/apiError.js";
import ApiResponse from "./utils/apiResponse.js";
import { ExpressAuth } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import Google from "@auth/express/providers/google";
import helmet from "helmet";
import { env } from "./config/env.schema.js";
import cors from "cors";
import { urlencoded } from "express";
import { authConfig } from "./config/auth.config.js";

const app = express();

// securtiy middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        formAction: ["'self'", "http://localhost:3000"],
      },
    },
    hsts:
      env.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-Id",
      "X-Request-Time",
    ],
  })
);

// body parsing middlewares
app.use(express.json({ limit: "10kb" }));
app.use(urlencoded({ extended: true, limit: "10kb" }));

app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth(authConfig));

app.get("/", (_req: Request, res: Response) => {
  res.send("in base route /");
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error caught by middleware:", err);

  if (err instanceof ApiError) {
    const errorResponse = new ApiResponse(err.statusCode, {}, err.message);
    return res.status(err.statusCode).json({
      ...errorResponse,
      errors: err.errors,
    });
  }

  // Handle unexpected errors
  return res
    .status(500)
    .json(new ApiResponse(500, {}, "Internal Server Error"));
});

export default app;
