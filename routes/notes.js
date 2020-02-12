const express = require('express');
const router = express.Router();
const Note = require('../model/Note');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const note = new Note({
    title: "title",
    text: "Some text"
  });

  try {
    const savedNote = await note.save();
    console.log(savedNote);
  } catch (err) {
    res.status(400).send(err);
  }

  res.render('notes/note', { title: 'Express' });
});

module.exports = router;
