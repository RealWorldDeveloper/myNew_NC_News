const endpointsJson = require("./endpoints.json");
const topicData = require("./db/data/test-data/topics");
const articles = require("./db/data/test-data/articles");
const db = require("./db/connection");
const {
  getArticalsbyId,
  getTopicsModel,
  articlesModel,
  commentModel,
  commentPostModel,
  updateArticleVotesModel,
} = require("./model");
//Get api
const getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
//Get topics
const getTopics = (req, res) => {
  getTopicsModel().then((topic) => {
    if(!topic){
      return res.status(404).send({msg: 'Bad request!!! Not Found'})
    }
    res.status(200).send({ topics: topic });
  });
};
// Get articles
const getArticles = (req, res, next) => {
  articlesModel().then((article) => {
    article.forEach((element) => {
      element.comment_count = Number(element.comment_count);
    });
    res.status(200).send({ article });
  });
};
//Get comments
const getComments = (req, res) => {
  const { article_id } = req.params;
  commentModel(article_id)
    .then((result) => {
      res.status(200).send({ comment: result });
    })
    .catch(() => {
      res.status(400).send({ msg: "Invalid article_id" });
    });
};
// Post comments
const commentPost = (req, res) => {
  const { article_id } = req.params;
  const reqBody = req.body;
  if (!reqBody.username || !reqBody.body) {
    return res.status(400).send({ msg: "Invalid username provided" });
  }

  commentPostModel(article_id, reqBody).then((result) => {
    res.status(201).send({ comment: result });
  });
};
// Get articles by id
const getArticleId = (req, res) => {
  const { article_id } = req.params;
      if (isNaN(article_id)) {
        return res.status(400).send({ msg: "Invalid article_id provided" });
      }
  getArticalsbyId(article_id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ msg: "articles not found" });
      }
      res.status(200).send({ articles: result });
    })
};
//PATCH /api/articles/:article_id
const updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== "number") {
    return res
      .status(400)
      .send({ msg: "Bad Request: inc_votes must be a number" });
  }
  updateArticleVotesModel(article_id, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
module.exports = {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
  updateArticleVotes,
};
