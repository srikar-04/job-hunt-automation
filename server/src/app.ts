import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import ApiError from "./utils/apiError.js";
import ApiResponse from "./utils/apiResponse.js";

const app = express();

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
