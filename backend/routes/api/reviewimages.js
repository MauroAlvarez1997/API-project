const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// router.get('/', async(req, res) => {
//   const reviewImages = await ReviewImage.findAll();

//   res.json(reviewImages)
// });


router.delete('/:imageId', requireAuth, async(req, res)=> {
  const imageId = req.params.imageId;

  const image = await ReviewImage.findOne({
    where: {
      id: imageId
    }
  })

  if(!image){
    return res.json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }

    await image.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })


})



module.exports = router;
