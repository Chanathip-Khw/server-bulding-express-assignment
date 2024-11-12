export const validateCreateAndEditPostData = (req, res, next) => {
  if (!typeof req.body.title === "string") {
    return res.status(400).json({
      message: "Title must be a string",
    });
  }

  if (!req.body.title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (!typeof req.body.image === "string") {
    return res.status(400).json({
      message: "Image must be a string",
    });
  }

  if (!req.body.image) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  if (!typeof req.body.category_id === "number") {
    return res.status(400).json({
      message: "Image must be a number",
    });
  }

  if (!req.body.category_id) {
    return res.status(400).json({
      message: "Category ID is required",
    });
  }

  if (!typeof req.description === "string") {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      message: "Description ID is required",
    });
  }

  if (!typeof req.content === "string") {
    return res.status(400).json({
      message: "Content must be a string",
    });
  }

  if (!req.body.content) {
    return res.status(400).json({
      message: "Content ID is required",
    });
  }

  if (!typeof req.status_id === "number") {
    return res.status(400).json({
      message: "Status ID must be a number",
    });
  }

  if (!req.body.status_id) {
    return res.status(400).json({
      message: "Status ID is required",
    });
  }

  next();
};
