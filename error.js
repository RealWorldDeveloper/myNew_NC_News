const badRequestHandler = (req, res) => {
    return res.status(404).send({ msg: "Bad request!!!" });
  };
  
  const errorHandler = (err, req, res, next) => {
    if (err.code === "23503") {
      return res.status(404).send({ msg: "Article not found" });
    }
    if (err.code === "22P02") {
      return res.status(400).send({ msg: "Invalid article_id provided" });
    }
    if (err.code === "23502") {
      return res.send(400).send({ msg: "Invalid username provided" });
    }
  
    res.status(500).send({ msg: "Internal server error" });
  };
  module.exports = { errorHandler, badRequestHandler };