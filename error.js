const errorHandler = (err, req, res, next) => {
  // postgres error
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err) {
    return res.status(404).send({ msg: "no contents found" });
  }

  res.status(500).send({ msg: "Internal server error" });
};
module.exports = { errorHandler };
