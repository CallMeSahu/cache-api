const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const cache = new Map();
const MAX_CACHE_SIZE = 10;

const checkCacheSize = (req, res, next) => {
  if (cache.size >= MAX_CACHE_SIZE) {
    return res.status(400).json({
      error: `Cache is full. Maximum size is ${MAX_CACHE_SIZE}`,
    });
  }
  next();
};

app.post("/cache", checkCacheSize, (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({
      error: "Both key and value are required",
    });
  }

  cache.set(key, value);
  res.status(201).json({
    message: "Cached successfully",
    key,
    value,
  });
});

app.get("/cache/:key", (req, res) => {
  const { key } = req.params;

  if (!cache.has(key)) {
    return res.status(404).json({
      error: "Key not found",
    });
  }

  res.json({
    key,
    value: cache.get(key),
  });
});

app.delete("/cache/:key", (req, res) => {
  const { key } = req.params;

  if (!cache.has(key)) {
    return res.status(404).json({
      error: "Key not found",
    });
  }

  cache.delete(key);
  res.json({
    message: "Deleted successfully",
    key,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
