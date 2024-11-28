const db = require('./db/connection')
const commentError =(req,res,next)=>{
    const reqBody = req.body
    const { article_id } = req.params;
    
    if(!reqBody.username || !reqBody.body ){
        return res.status(400).send({msg: 'No username or body found for this article'})
    }
    next()
}
module.exports = commentError