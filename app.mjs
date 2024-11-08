import express from "express";
import connectionPool from "./utils/db.mjs";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/profile", (req, res) => {
  const testResponse = {
    data: {
      name: "john",
      age: 20,
    },
  };
  return res.status(200).json(testResponse);
});

app.post("/posts", async (req, res) => {
  const newPost = {
    ...req.body,
  };

  try {
    await connectionPool.query(
      `insert into posts (title, image, category_id , description ,content, status_id)
    values ($1,$2,$3,$4,$5,$6)`,
      [
        newPost.title,
        newPost.image,
        newPost.category_id,
        newPost.description,
        newPost.content,
        newPost.status_id,
      ]
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server could not create post because database connection",
      error: err.message,
    });
  }

  return res.status(201).json({
    message: "Created post sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
