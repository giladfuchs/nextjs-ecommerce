
export const baseUrl = process.env.BASE_URL
    ? new URL(process.env.BASE_URL)
    : "http://localhost:3000";
