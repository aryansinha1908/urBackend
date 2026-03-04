const express = require('express');
const router = express.Router();
const authorization = require('../middleware/authMiddleware');
const { getAllReleases, createRelease } = require('../controllers/release.controller');

// GET ALL RELEASES (Public)
router.get('/', getAllReleases);

// CREATE RELEASE (Admin Only)
router.post('/', authorization, createRelease);

module.exports = router;
