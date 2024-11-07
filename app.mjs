import express from "express";

const app = express();
const pert = process.env.PORT || 4000;

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

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})
