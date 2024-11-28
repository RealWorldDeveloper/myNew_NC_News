const express = require("express");
const {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
} = require("./controller");
const commentError = require('./error')
const app = express();
// middleware
app.use(express.json());

// api Endpoint
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments",getComments);
app.post('/api/articles/:article_id/comments',commentError,commentPost)

app.use((req, res, next) => {
  res.status(404).send({ error: "Bad request!!! Not Found", getComments });
  next();
});
module.exports = app;
