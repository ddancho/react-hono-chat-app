import { HTTPException } from "hono/http-exception";
import dotenv from "dotenv";

function getConfigOutput() {
  const configOutput = dotenv.config({ path: "./.env" });

  if (configOutput.error || configOutput.parsed === undefined) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }

  return configOutput.parsed;
}

const {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_TOKEN_EXP_MS,
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  CORS_ORIGIN,
} = getConfigOutput();

if (
  PORT === undefined ||
  NODE_ENV === undefined ||
  JWT_SECRET === undefined ||
  JWT_TOKEN_EXP_MS === undefined ||
  JWT_COOKIE_EXP_SEC === undefined ||
  JWT_COOKIE_NAME === undefined ||
  CORS_ORIGIN === undefined
) {
  throw new HTTPException(500, {
    message: "Internal Server Error, env var missing",
  });
}

export {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_TOKEN_EXP_MS,
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  CORS_ORIGIN,
};
