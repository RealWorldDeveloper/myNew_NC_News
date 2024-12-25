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
  authotization,
  logoutUser
} = require("./controller");
const {errorHandler} =  require('./error')
const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', // Development domain
  'https://subtle-gaufre-8c35c7.netlify.app', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Add methods you expect to use
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers like Authorization (for token-based auth)
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
app.post('/api/users/logout', logoutUser)
// middleware
app.use(errorHandler);

module.exports = app;