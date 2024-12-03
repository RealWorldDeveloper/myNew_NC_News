const express = require("express");
const cors =require('cors')
const {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
  updateArticleVotes,
  deleteComment,
  getUsers
} = require("./controller");
const {errorHandler} =  require('./error')
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests only from localhost:3000
  methods: ['GET', 'POST'],        // Specify allowed HTTP methods
  credentials: true                 // Allow credentials like cookies, if needed
}));

// api Endpoint
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments",getComments);
app.post('/api/articles/:article_id/comments',commentPost)
app.patch('/api/articles/:article_id', updateArticleVotes);
app.delete('/api/comments/:comment_id',deleteComment)
app.get("/api/users", getUsers);

// middleware
app.use(errorHandler);

module.exports = app;
