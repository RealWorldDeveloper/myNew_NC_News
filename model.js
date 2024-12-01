const { response } = require("./app");
const db = require("./db/connection");
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
// comments model
const commentModel = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [id]
    )
    .then((res) => {
      const comments = res.rows;
      return comments;
    });
};
// comment post
const commentPostModel = (article_id,reqBody) => {
const{username, body} = reqBody
 return db.query( `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id,username,body])
 .then(result =>{
  if (!result.rows[0]) {
    throw { code: '22P02', message: 'Invalid data provided' }; // In case of a malformed query
  }
  return result.rows[0]
 })
 
};

// articles id model
function getArticalsbyId(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {          
      return result.rows;
    })
    
}

//CORE: PATCH /api/articles/:article_id Model
const updateArticleVotesModel = (article_id,inc_votes)=>{
  return db
  .query(
    `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *;`,
    [inc_votes, article_id]
  )
  .then((result) => {
   return result.rows[0]; 
  });
}
//DELETE /api/comments/:comment_id Model
const deleteCommentModel = (comment_id)=>{
return db.query('DELETE FROM comments WHERE comment_id =$1',[comment_id])
.then(response =>{
  if(response.rowCount === 0){
    throw { code: '23503' };
  }
})
}
//CORE GET /api/users Model
const getUserModel =()=>{
  return db.query(`SELECT* FROM users`)
  .then(response =>{  
    // if(response.rowCount === 0){
    //   throw {error: '02000'}
    // }
    return response.rows
  })
}

module.exports = {
  getArticalsbyId,
  getTopicsModel,
  articlesModel,
  commentModel,
  commentPostModel,
  updateArticleVotesModel,
  deleteCommentModel,
  getUserModel
};
