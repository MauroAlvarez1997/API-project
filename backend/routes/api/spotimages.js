const express = require('express');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async(req, res) => {
  const spotimages = await SpotImage.findAll();

  res.json(spotimages)
});


module.exports = router;
