import { Router } from "express";
import { validateCreateAndEditPostData } from "../middlewares/postAndPutValidation.mjs";
import connectionPool from "../utils/db.mjs";

const postsRouter = Router();

postsRouter.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 6, category, keyword } = req.query;
    let query = `select * from posts where 1=1 `;
    let queryParams = [];
    const offset = (page - 1) * limit;

    if (category) {
      query += ` and category ilike $${queryParams.length + 1}`;
      queryParams.push(`%${category}%`);
    }
    if (keyword) {
      query += ` and keyword ilike $${queryParams.length + 1}`;
      queryParams.push(`%${keyword}%`);
    }
    query += `limit $${queryParams.length + 1} offset $${
      queryParams.length + 2
    }`;
    queryParams.push(limit, offset);
    const results = await connectionPool.query(query, queryParams);

    const countQuery = `SELECT COUNT(*) AS total FROM posts WHERE 1=1`;
    let countQueryParams = [];
    if (category) {
      countQuery += ` AND category ILIKE $${countQueryParams.length + 1}`;
      countQueryParams.push(`%${category}%`);
    }
    if (keyword) {
      countQuery += ` AND keyword ILIKE $${countQueryParams.length + 1}`;
      countQueryParams.push(`%${keyword}%`);
    }

    const countResult = await connectionPool.query(
      countQuery,
      countQueryParams
    );
    const totalPosts = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalPosts / limit);
    const currentPage = page;
    const nextPage = Number(currentPage) + 1;
    const outputData = {
      totalPosts: totalPosts,
      totalPages: totalPages,
      currentPage: currentPage,
      limit: limit,
      posts: results.rows,
      nextPage: nextPage,
    };
    return res.status(200).json(outputData);
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postsRouter.get("/:postId", async (req, res) => {
  try {
    const postIdFromClient = req.params.postId;
    const results = await connectionPool.query(
      `select * from posts where id = $1`,
      [postIdFromClient]
    );
    if (!results.rows[0]) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post" });
    }
    return res.status(201).json({
      data: results.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postsRouter.post("/", [validateCreateAndEditPostData], async (req, res) => {
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
    return res.status(500).json({
      message: "Server could not create post because database connection",
      error: err.message
    });
  }

  return res.status(201).json({
    message: "Created post sucessfully",
  });
});

postsRouter.put(
  "/:postId",
  [validateCreateAndEditPostData],
  async (req, res) => {
    try {
      const postIdFromClient = req.params.postId;
      const updatedPost = { ...req.body, date: new Date() };
      const results = await connectionPool.query(
        `update posts
    set
    title=$2,
    image=$3,
    category_id=$4,
    description=$5,
    content=$6,
    status_id=$7
    where id=$1`,
        [
          postIdFromClient,
          updatedPost.title,
          updatedPost.image,
          updatedPost.category_id,
          updatedPost.description,
          updatedPost.content,
          updatedPost.status_id,
        ]
      );
      console.log(results);
      if (results.rowCount === 0) {
        return res.status(404).json({
          message: "Server could not find a requested post to update",
        });
      }
      return res.status(200).json({ message: "Updated post sucessfully" });
    } catch (err) {
      return res.status(500).json({
        message: "Server could not update post because database connection",
      });
    }
  }
);

postsRouter.delete("/:postId", async (req, res) => {
  try {
    const postIdFromClient = req.params.postId;
    const results = await connectionPool.query(
      `delete from posts where id = $1`,
      [postIdFromClient]
    );
    console.log(results);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to delete" });
    }
    return res.status(200).json({ message: "Deleted post sucessfully" });
  } catch {
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

export default postsRouter;
