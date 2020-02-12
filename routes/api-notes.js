const express = require('express');
const router = express.Router();
const Note = require('../model/Note')

/* GET home page. */
router.post('/', async function(req, res, next) {
    const note = new Note(req.body);
    note.date = Date.now();

    try {
        const savedNote = await note.save();
        console.log(savedNote);
        res.status(200).send(savedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        console.log('deletedNote: ',deletedNote);
        res.status(200).send(deletedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log('updatedNote: ',updatedNote);
        res.status(200).send(updatedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;
