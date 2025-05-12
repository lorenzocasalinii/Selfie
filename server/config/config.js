import dotenv from "dotenv";
dotenv.config();

const config = {
  dbURI: process.env.DB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
};

export default config;