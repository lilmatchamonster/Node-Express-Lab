const express = require('express');

const db = require('./db.js');

const router = express.Router();
const parser = express.json();

router.use(parser);

router.get('/', async (req, res) => {
  try {
    const posts = await db.find(req.query);
    res.status(200).json(posts);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      error: "The posts information could not be retrieved." 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      error: "The post information could not be retrieved."
    });
  }
});

router.post("/", async (req, res) => {
  const newPost = req.body
  const goodPost = (newPost.title && newPost.contents) ? true : false;

  try {
    if(goodPost) {
      const post = await db.insert(newPost);
      res.status(201).json(post);
    }
    else if (!goodPost) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "This post has been deleted" });
    } 
    else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      error: "The post could not be removed"
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newPost = req.body
  const goodPost = (newPost.title && newPost.contents) ? true : false;

  try {
    const post = await db.update(req.params.id, req.body);
    if (post && goodPost) {
      res.status(200).json(post);
    }
    else if (!goodPost) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    }
    else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      error: "The post information could not be modified."
    });
  }
});

module.exports = router;
