const db = require("./db/connection");
const { forEach } = require("./db/data/test-data/comments");
// topic model
const getTopicsModel = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};
//articles model

const articlesModel = (id) => {
  const text = "SELECT * FROM articles";

  return db.query(text).then((res) => {
    const articles = res.rows;
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
