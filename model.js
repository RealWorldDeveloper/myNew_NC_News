const db = require("./db/connection");
const { forEach } = require("./db/data/test-data/comments");
// topic model
const getTopicsModel = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};
//articles model

const articlesModel = () => {
  const text =
    "SELECT articles.author,articles.article_id, articles.title,articles.topic,articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

  return db.query(text).then((res) => {
    
    return res.rows;
  });
};

// articles id model
function getArticalsbyId(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      return result.rows[0];
    });
}
module.exports = { getArticalsbyId, getTopicsModel, articlesModel };
