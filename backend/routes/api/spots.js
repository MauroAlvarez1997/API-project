const express = require('express');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async(req, res) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
      }
    ]
  });

  let spotList = [];
  spots.forEach( spot => {
    spotList.push(spot.toJSON())
  });

  spotList.forEach(spot => {
    let sum = 0
    spot.Reviews.forEach(review => {
      sum += review.stars
    });
    spot.avgRating = sum / spot.Reviews.length
    delete spot.Reviews
  })

  spotList.forEach(spot => {
    spot.SpotImages.forEach(image => {
      if(image.preview === true){
        spot.previewImage = image.url
      }
    })
    if(!spot.previewImage){
      spot.previewImage = 'There are no images available for this location at this time.'
    }
    delete spot.SpotImages
  })

  const obj = {}
  obj.Spots = spotList
  res.json(obj)
});


module.exports = router;
