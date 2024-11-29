const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */
const testTopics = require("../db/data/test-data/topics");
const { response } = require("express");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end());

//"GET /api"
describe("GET /api", () => {
  test("200: Responds with an object detailing all of the available API endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("400: Responds with an Bad request if invalid request", () => {
    return request(app)
      .get("/api/badrequest")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toEqual('Bad request!!!');
      });
  });
});
//"GET /api/topics"
describe("GET /api/topics", () => {
  test("200: Responds an array of topic objects, each of which should have the slug,description properties:", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        expect(topics).toEqual(testTopics);
        expect(Array.isArray(topics)).toBe(true);
        expect(Object.keys(topics[0])).toEqual(["slug", "description"]);
      });
  });

});
//GET /api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object, which should have the articles properties:", () => {
    const expectedObject = {
      article_id: 2,
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    };
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual(expectedObject);
      });
  });
  test("400: should return a 400 error if article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/a")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Invalid article_id provided");
      });
  });
  test("404: responds articles not found", () => {
    return request(app)
      .get("/api/articles/101")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("articles not found");
      });
  });
});
//GET /api/articles
describe("GET /api/articles", () => {
  test("200: Responds an articles array of article objects,", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.length).toBe(13);
        expect(Array.isArray(article)).toBe(true);
        article.forEach((element) => {
          expect(element).toEqual({
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Check if article sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        const dates = article.map(
          (articleObj) => new Date(articleObj.created_at)
        );
        expect(dates).toEqual([...dates].sort((a, b) => b - a));
      });
  });
});
//GET /api/articles/:article_id/comments
describe('"GET /api/articles/:article_id/comments', () => {
  test("responds with 200 and an array of comments for a valid article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Array);
        expect(comment[0]).toHaveProperty("comment_id");
        expect(comment[0]).toHaveProperty("body");
        expect(comment[0]).toHaveProperty("article_id");
        expect(comment[0]).toHaveProperty("author");
        expect(comment[0]).toHaveProperty("votes");
        expect(comment[0]).toHaveProperty("created_at");
      });
  });

  test("responds with 200 and an empty array if no comments found", () => {
    return request(app)
      .get("/api/articles/2222/comments")
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual([]);
      });
  });
  test("responds with 400 for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/no_id/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid article_id");
      });
  });
});
//POST /api/articles/:article_id/comments
describe('"POST /api/articles/:article_id/comments add a comment for an article.', () => {
  test("responds with 201 status code with an array of comments object should have comment_id,votes,created_at,author,body,article_id", () => {
    const newComments = {
      username: "butter_bridge",
      body: "This is latestest comments",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComments)
      .expect(201)
      .then((res) => {
        const { comment } = res.body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment.body).toBe(newComments.body);
        expect(comment.author).toBe(newComments.username);
        expect(comment.article_id).toBe(7);
        expect(comment.votes).toBe(0);
        expect(comment.created_at).toBeDefined();
      });
  });

  test("should return an error if required fields are missing or invalid username", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({ username: "grumpy19" })
      .expect(400)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe('Invalid username provided');
      });
  });
});
//PATCH /api/articles/:article_id
describe("PATCH /api/articles/:article_id", () => {
  test("should update the votes of an article and return the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(105);
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
      });
  });
  test("should decrement the votes of an article and return the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(0);
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
      });
  });

  test("should return a 400 error if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "xyz" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: inc_votes must be a number"
        );
      });
  });

});
