const express = require("express");
const {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
  updateArticleVotes,
  deleteComment
} = require("./controller");
const {errorHandler,badRequestHandler} =  require('./error')
const app = express();
app.use(express.json());

// api Endpoint
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments",getComments);
app.post('/api/articles/:article_id/comments',commentPost)
app.patch('/api/articles/:article_id', updateArticleVotes);
app.delete('/api/comments/:comment_id',deleteComment)

// middleware
app.use(badRequestHandler, errorHandler);

module.exports = app;
