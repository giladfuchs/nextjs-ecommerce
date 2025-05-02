const isDev = process.env.NODE_ENV === "development";

export const API_URL = isDev
  ? "http://localhost:4000"
  : "https://yaara-api-nu.vercel.app";

export const baseUrl = isDev
  ? "https://yaara-tau.vercel.app/"
  : "http://localhost:3000";

export const SITE_NAME = "יערה";

export const MAX_FILE_SIZE_MB = 1;
