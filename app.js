const express = require('express')
const {getApi , getTopics, getArticleId, getArticles}  = require('./controller')
const app = express()
// middleware
app.use(express.json())


// api Endpoint
app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleId)


app.use((req, res, next) => {
    res.status(404).send({error: "Bad request!!! Not Found"} );
next()
});
module.exports = app