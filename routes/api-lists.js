const express = require('express');
const router = express.Router();
const List = require('../model/List');

/* GET home page. */
router.post('/', async function(req, res, next) {
  const list = new List(req.body);
  list.date = Date.now();

  try {
    const savedList = await list.save();
    console.log(savedList);
    res.status(200).send(savedList);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  // console.log('delete: ', req.params.id);

  // const list = new List(req.body);

  try {
    const deletedList = await List.findByIdAndDelete(req.params.id);
    console.log('deletedList: ',deletedList);
    res.status(200).send(deletedList);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log('updatedList: ',updatedList);
    res.status(200).send(updatedList);
  } catch (err) {
    res.status(400).send(err);
  }
});


module.exports = router;
