const express = require('express');
const { avatarController, getAllAvatars } = require('../controllers/avatarController');
const router = express.Router();

router.post("/", avatarController);
router.get("/all", getAllAvatars);

module.exports = router;