const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */
const testTopics = require("../db/data/test-data/topics");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end());

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
});
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
        expect(Object.keys(topics[0])).toEqual(["slug","description"]);
      });
  });
  test("should respond with 404 if request not found", () => {
    return request(app)
      .get("/api/badtopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toEqual("Bad request!!! Not Found");
      });
  });
});
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
  test("404: responds with invalid id provided", () => {
    return request(app)
      .get("/api/articles/a")
      .expect(404)
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
// describe("GET /api/articles", () => {
//   test("200: Responds an articles array of article objects,", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then(({body})=>{
//           const {article} = body
          
//         expect(Array.isArray(article)).toBe(true);
//         article.forEach(obj => {
          
//           expect(obj).toEqual(
//             expect.objectContaining({
//                 article_id: expect.any(Number),
//                 title: expect.any(String),
//                 topic: expect.any(String),
//                 author: expect.any(String),
//                 created_at: expect.any(String),
//                 votes: expect.any(Number),
//                 article_img_url: expect.any(String),
//                 comment_count: expect.any(Number),
//             })
//           )
//         })
//       })
//   });
// });