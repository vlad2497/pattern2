import express from "express";
import { engine } from "express-handlebars";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";

config();
const PORT = process.env.PORT || 3001;
const MOVIE_DB_HOST = process.env.MOVIE_DB_HOST || "";
const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY || "";
const MOVIE_DB_LANG = process.env.MOVIE_DB_LANG || "";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/", (request, response) => {
  response.render("index");
});

app.get(
  /\/api\/moviedb\//,
  createProxyMiddleware({
    target: MOVIE_DB_HOST,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/moviedb`]: "",
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.path += `?api_key=${MOVIE_DB_API_KEY}&language=${MOVIE_DB_LANG}`;
    },
  })
);

app.post("/api/form", (request, response) => {
  if (!request.body.surName)
    response.status(403).json({
      message: "Имя обязательно !",
    });
  response.status(200).json(request.body);
});
