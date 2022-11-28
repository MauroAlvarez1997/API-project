const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// router.get('/:reviewId', async(req, res) => {
//   const reviewId = req.params.reviewId;
//   const { url } = req.body;
//   const targetReview = await Review.findByPk(reviewId, {
//     include: {
//       model: ReviewImage
//     }
//   });
//   res.json(targetReview)
// });
// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res)=>{
  const reviewId = req.params.reviewId;
  const { url } = req.body;
  const targetReview = await Review.findByPk(reviewId, {
    include: {
      model: ReviewImage
    }
  });

  if(!targetReview){
    res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }


  if(targetReview.ReviewImages.length >= 10){
    res.json({
      "message": "Maximum number of images for this resource was reached",
      "statusCode": 403
    })
  }

  const newReviewImage = await ReviewImage.create({
    reviewId,
    url
  })
  const jsonReviewImage = newReviewImage.toJSON()
  delete jsonReviewImage.reviewId;
  delete jsonReviewImage.createdAt;
  delete jsonReviewImage.updatedAt;

  res.json(jsonReviewImage)
});

// Get all Reviews of the Current User
router.get('/current', requireAuth, async(req, res)=> {
  const currentUser = req.user.id;
  const userReviews = await Review.findAll({
    where: {
      userId: currentUser
    },
    include: [
      {
        model: User
      },
      {
        model: Spot,
        include: {
          model: SpotImage
        }
      },
      {
        model: ReviewImage
      }
    ]
  });

  const jsonReviewArr = []
  userReviews.forEach(review => {
    jsonReviewArr.push(review.toJSON())
  });

  jsonReviewArr.forEach(review=> {
    delete review.User.username
    review.ReviewImages.forEach(reviewImage=> {
      delete reviewImage.reviewId
      delete reviewImage.createdAt
      delete reviewImage.updatedAt
    })
  });

  jsonReviewArr.forEach(review=> {
    delete review.Spot.description;
    delete review.Spot.createdAt;
    delete review.Spot.updatedAt;
    review.Spot.SpotImages.forEach( spotImage => {
      if(spotImage.preview){
        review.Spot.previewImage = spotImage.url
      }else{
        review.Spot.previewImage = "There are no immages at this time"
      }
    })
    delete review.Spot.SpotImages
  })

  const obj = { Reviews: jsonReviewArr}

  res.json(obj)
});

//Edit a Review
router.put('/:reviewId', requireAuth, async(req, res)=> {
  const reviewId = req.params.reviewId
  const {review, stars} = req.body
  if(!review || !stars){
    res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }
  const reviewToEdit = await Review.findByPk(reviewId);
  if(!reviewToEdit){
    res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  const updated = reviewToEdit.set({
    review,
    stars
  })
  updated.save()
  res.json(updated)
})



router.delete('/:reviewId', requireAuth, async(req, res)=> {
  const reviewId = req.params.reviewId;

  const review = await Review.findOne({
    where: {
      id: reviewId
    }
  })

  if(!review){
    return res.json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }

    await review.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })


})


module.exports = router;
