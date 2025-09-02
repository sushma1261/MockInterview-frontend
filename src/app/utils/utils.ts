export const getBaseUrl = () => {
  console.log("BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
};
