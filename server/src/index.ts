import "dotenv/config";

import cookie from "cookie-parser";
import express, {NextFunction, Request, Response} from "express";
import helmet from "helmet";
import process from "node:process";
import volleyball from "volleyball";

import connection from "./postgres/connect.js";
import admin from "./routes/admin.js";
import student from "./routes/student.js";
import teacher from "./routes/teacher.js";

const PORT = process.env.PORT || 4242;
const app = express();

app.use(cookie());
app.use(helmet());
app.use(volleyball);
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, cookie",
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method == "OPTIONS") {
    return res.status(204).end(); // I no no wanna do again
  }
  next();
});

app.use("/admin", admin);
app.use("/teacher", teacher);
app.use("/student", student);

connection.connect().then().catch((err) => {
  console.log(err);
  process.exit(1);
});
app.listen(PORT, (err) => {
  const status = err
    ? `error during starting server ${err}`
    : `server running on ${PORT}`;
  console.log(status);
});
