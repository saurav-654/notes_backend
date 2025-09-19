const express = require('express');
const { login } = require('../Controller/authController');
const { addUser } = require('../Controller/addUser');
const { addNotes } = require('../Controller/addNotes');
const { protect } = require('../Middleware/auth');
const { getNotes, getSpecificNote } = require('../Controller/getNotes');
const { editNote } = require('../Controller/editNote');
const { deleteNote } = require('../Controller/deleteNote');
const { upgraderole } = require('../Controller/upgraderol');
const { getUserNotes } = require('../Controller/getUserNotes');

const router = express.Router();

router.post('/login', login);
router.post('/adduser',addUser);
router.post('/addnotes',addNotes);
router.get('/notes',protect,getNotes);
router.get('/notes/:noteId',protect,getSpecificNote);
router.put('/notes/:noteId', protect, editNote);
router.delete('/notes/:noteId', protect, deleteNote);
router.post('/tenants/:slug/upgrade', protect, upgraderole);
router.get('/userNotes',protect,getUserNotes)

module.exports = router;
