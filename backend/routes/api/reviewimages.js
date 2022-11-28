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
    return res.status(404).json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }



  const review = await Review.findOne({
    where: {
      userId: image.reviewId
    }
  })

  if(review.userId !== req.user.id){
    const err = new Error('You are not the owner of this spot')
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
