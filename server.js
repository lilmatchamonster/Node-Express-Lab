const express = require('express');

const PostsRouter = require("./data/post_router.js");

const server = express();
server.use("/api/posts", PostsRouter);

module.exports = server;