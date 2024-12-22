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
  deleteCommentModel,
  getUserModel,
  createUserModel,
  loginModel,
} = require("./model");
//CORE TASK-2: Get api
const getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
//CORE TASK-3: Get topics
const getTopics = (req, res, next) => {
  getTopicsModel()
    .then((topic) => {
      res.status(200).send({ topics: topic });
    })
    .catch((err) => {
      next(err);
    });
};
//CORE TASK-4: Get articles
const getArticles = (req, res, next) => {
  articlesModel()
    .then((article) => {
      article.forEach((element) => {
        element.comment_count = Number(element.comment_count);
      });
      res
        .status(200)
        .send({ success: true, message: "Successfully fetch data", article });
    })
    .catch((err) => {
      next(err);
    });
};
//CORE TASK-5: Get comments
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
//CORE TASK-6: Post comments
const commentPost = (req, res, next) => {
  const { article_id } = req.params;
  const reqBody = req.body;
  if (!reqBody.username || !reqBody.body) {
    return res.status(400).send({ msg: "Invalid username provided" });
  }
  commentPostModel(article_id, reqBody).then((result) => {
    res.status(201).send({ comment: result });
  });
};
//CORE TASK-7: Get articles by id
const getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  getArticalsbyId(article_id)
    .then((result) => {
      if (isNaN(article_id)) {
        return res.status(400).send({ msg: "Bad request" });
      }
      if (result.length === 0) {
        return res.status(404).send({ msg: "not found" });
      }
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};
//CORE TASK-8: PATCH /api/articles/:article_id
const updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesModel(article_id, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
//CORE TASK-9: DELETE /api/comments/:comment_id
const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentModel(comment_id)
    .then(() => {
      res.status(204).send(); // No Content
    })
    .catch((err) => {
      if (err.code === "23503") {
        return res.status(404).send({ msg: "Comment not found" });
      }
    });
};
// CORE: GET /api/users
const getUsers = (req, res, next) => {
  getUserModel()
    .then((response) => {
      res.status(200).send({ user: response });
    })
    .catch((err) => {
      next(err);
    });
};
//Post Create /api/users/adduser
const addUser = (req, res, next) => {
  const reqBody = req.body;
  createUserModel(reqBody)
    .then((response) => {
      res
        .status(200)
        .json({ success: true, msg: "Thank you for registration", response });
    })
    .catch((err) => {
      next(err);
    });
};
// login Controller
const login = (req, res, next) => {
  const { username, password } = req.body;
  loginModel().then((response) => {
const findUser = response.rows.find(user => user.username === username)
if(!findUser){
  return res.status(401).json({succcess:false, msg: 'Sorry no user exists'})
}
else{
  if(findUser.password === password){
    return res.status(201).json({success:true, msg: 'Thank you for login'})
  }
  else{
    return res.status(401).send({msg: 'Soryy access denied. incorrect username or password'})
  }
}
  
})
  .catch(err =>{
    console.error('DataBase Error', err)
    return res.status(500).json({ success: false, msg: 'Internal server error, please try again later.' })
  })
  
 
};
module.exports = {
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
};
