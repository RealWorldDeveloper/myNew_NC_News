const express = require("express");
const cors =require('cors')
const cookie = require('cookie-parser')
const {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
  updateArticleVotes,
  deleteComment,
  getUsers,
  addUser,
  login,
  authotization
} = require("./controller");
const {errorHandler} =  require('./error')
const app = express();
app.use(express.json());
app.use(cors({
  origin:['https://mynew-nc-news.onrender.com/api'],
  credentials:true
}));
app.use(cookie())

// api Endpoint
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments",getComments);
app.post('/api/articles/:article_id/comments',commentPost);
app.post('/api/users/adduser',addUser)
app.patch('/api/articles/:article_id', updateArticleVotes);
app.delete('/api/comments/:comment_id',deleteComment)
app.get("/api/users", getUsers);
app.post("/api/users/login", login);
app.get("/api/users/verify", authotization);
// middleware
app.use(errorHandler);

module.exports = app;
