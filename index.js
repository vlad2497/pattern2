import express from "express";
import { engine } from "express-handlebars";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import { config } from "dotenv";

config();
const PORT = process.env.PORT || 3001;
const MOVIE_DB_HOST = process.env.MOVIE_DB_HOST || "";
const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY || "";
const MOVIE_DB_LANG = process.env.MOVIE_DB_LANG || "";

const app = express();
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

app.get("/status", (request, response) => {
  const status = {
    age: 25,
    name: "Vlad",
    fullName: "Vlad55555",
  };

  response.send(status);
});
