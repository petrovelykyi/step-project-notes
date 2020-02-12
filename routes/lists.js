const express = require('express');
const router = express.Router();
const List = require('../model/List');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const list = new List({
    title: "Title list",
    tasks: [
      {
        t1: "екгу",
        t2: "t2"
      },
      {
        t1: "t1",
        t2: "t2"
      },
      {
        t1: "t1",
        t2: "t2"
      },
    ]
  });

  try {
    const savedList = await list.save();
    console.log(savedList);
  } catch (err) {
    res.status(400).send(err);
  }

  res.render('lists/list', { title: 'Express' });
});

module.exports = router;
