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
} = require("./model");
//get api
const getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
//get topics
const getTopics = (req, res) => {
  getTopicsModel().then((topic) => {
    res.status(200).send({ topics: topic });
  });
};
// get articles
const getArticles = (req, res, next) => {
  articlesModel().then((article) => {
    article.forEach((element) => {
      element.comment_count = Number(element.comment_count);
    });
    res.status(200).send({ article });
  });
};
//get comments
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
// post comments
const commentPost = (req, res) => {
    const { article_id } = req.params;
    const reqBody = req.body;
    commentPostModel(article_id, reqBody).then((result) => {
      res.status(201).send({ comment: result });
    })

  
};

// get articles by id
const getArticleId = (req, res) => {
  const { article_id } = req.params;
  getArticalsbyId(article_id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ msg: "articles not found" });
      }
      res.status(200).send({ articles: result });
    })
    .catch(() => {
      if (isNaN(article_id)) {
        res.status(404).send({ msg: "Invalid article_id provided" });
      }
    });
};
module.exports = {
  getApi,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  commentPost,
};
