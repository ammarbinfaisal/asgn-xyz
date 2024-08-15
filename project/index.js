const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// User CRUD operations
app.post("/users", async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { posts: true },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Post CRUD operations
app.post("/posts", async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, authorId: Number(authorId) },
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: true },
  });
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  });
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;