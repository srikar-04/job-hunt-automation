import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "database url is required"),
  FRONTEND_URL: z.string().min(1, "frontend url is required"),
  CORS_ORIGIN: z.string().min(1, "cors origin is required"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),

  AUTH_SECRET: z.string().min(1, "auth secret not found"),
  AUTH_GOOGLE_ID: z.string().min(1, "google auth id not found"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "google auth secret not found"),
  AUTH_GITHUB_ID: z.string().min(1, "github auth id not found"),
  AUTH_GITHUB_SECRET: z.string().min(1, "github auth secret not found"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
