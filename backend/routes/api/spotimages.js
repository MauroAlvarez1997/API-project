const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async(req, res) => {
  const spotimages = await SpotImage.findAll();

  res.json(spotimages)
});

router.delete('/:imageId', requireAuth, async(req, res)=> {
  const imageId = req.params.imageId;

  const image = await SpotImage.findOne({
    where: {
      id: imageId
    }
  })

  if(!image){
    return res.status(404).json({
      "message": "Spot Image couldn't be found",
      "statusCode": 404
    })
  }

  const spot = await Spot.findOne({
    where: {
      id: image.spotId
    }
  })


  if(req.user.id !== spot.ownerId){
    const err = new Error('You are not the owner of this image')
    err.status = 403
    throw err
  }

    await image.destroy()
    return res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })


})


module.exports = router;
