const express = require('express');
const router = express.Router();
const Note = require('../model/Note');
const List = require('../model/List');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const notes = await Note.find({});
  const lists = await List.find({});
  console.log('lists: ', lists);

  res.render('index', {notes, lists});
});

module.exports = router;
