const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("./"); // Make sure to export app from app.js

const prisma = new PrismaClient();

describe("CRUD API", () => {
  let userId;
  let postId;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("User CRUD", () => {
    test("CREATE: should create a new user", async () => {
      const res = await request(app).post("/users").send({
        email: "test@example.com",
        name: "Test User",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe("test@example.com");
      userId = res.body.id;
    });

    test("READ: should get all users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("READ: should get a specific user", async () => {
      const res = await request(app).get(`/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.email).toBe("test@example.com");
    });

    test("UPDATE: should update a user", async () => {
      const res = await request(app).put(`/users/${userId}`).send({
        name: "Updated Name",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Updated Name");
    });
  });

  describe("Post CRUD", () => {
    test("CREATE: should create a new post", async () => {
      const res = await request(app).post("/posts").send({
        title: "Test Post",
        content: "This is a test post",
        authorId: userId,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Post");
      postId = res.body.id;
    });

    test("READ: should get all posts", async () => {
      const res = await request(app).get("/posts");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("READ: should get a specific post", async () => {
      const res = await request(app).get(`/posts/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(postId);
      expect(res.body.title).toBe("Test Post");
    });

    test("UPDATE: should update a post", async () => {
      const res = await request(app).put(`/posts/${postId}`).send({
        title: "Updated Post Title",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Post Title");
    });

    test("DELETE: should delete a post", async () => {
      const res = await request(app).delete(`/posts/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Post deleted successfully");
    });
  });

  describe("User DELETE", () => {
    test("DELETE: should delete a user", async () => {
      const res = await request(app).delete(`/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
    });
  });
});
