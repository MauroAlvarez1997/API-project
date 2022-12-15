const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//Get all Spots
router.get('/', async(req, res) => {

  //--------------------------------------
  let { page, size } = req.query;
    if(page < 1 || size < 1){
      res.status(400).json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "page": "Page must be greater than or equal to 1",
          "size": "Size must be greater than or equal to 1",
          // "maxLat": "Maximum latitude is invalid",
          // "minLat": "Minimum latitude is invalid",
          // "minLng": "Maximum longitude is invalid",
          // "maxLng": "Minimum longitude is invalid",
          // "minPrice": "Maximum price must be greater than or equal to 0",
          // "maxPrice": "Minimum price must be greater than or equal to 0"
        }
      })
    }

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }
  //----------------------



  const spots = await Spot.findAll({
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
      }
    ], ...pagination
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
  // spotList.page = page
  // spotList.size = size

  const obj = {}
  obj.Spots = spotList

  obj.page = page
  obj.size = size

  res.json(obj)
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async(req, res) => {
  const currentUser = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: currentUser
    },
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
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
    if(!spot.avgRating){
      spot.avgRating = 'There are no ratings for this location at this time'
    }
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

//Get details of a Spot from an id
router.get('/:spotId', async(req, res) => {
  const id = req.params.spotId
  const item = await Spot.findOne({
    where: {id},
    include: [
      {
        model: Review
      },
      {
        model: SpotImage
      },
      {
        model: User
      }
    ]
  });

  if(!item){
    let err = new Error("Spot couldn't be found")
    err.status = 404;
    throw err
  }

  let jsonItem = item.toJSON();
  jsonItem.numReviews = jsonItem.Reviews.length

  let sum = 0
  jsonItem.Reviews.forEach(review => {
    sum += review.stars
  })
  jsonItem.avgStarRating = (sum /jsonItem.Reviews.length)
  delete jsonItem.Reviews

  jsonItem.SpotImages.forEach(image=> {
    delete image.spotId
    delete image.createdAt
    delete image.updatedAt
  })

  delete jsonItem.User.username
  jsonItem.Owner = jsonItem.User
  delete jsonItem.User

  res.json(jsonItem)
});

//Create a Spot
router.post('/', requireAuth, async(req, res)=> {
  const {address, city, state, country, lat, lng, name, description, price} = req.body;

  const dataArr = [address, city, state, country, lat, lng, name, description, price]

  dataArr.forEach(data=> {
    if(!data){
      res.status(400).json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          address: "Street address is required",
          city: "City is required",
          state: "State is required",
          country: "Country is required",
          lat: "Latitude is not valid",
          lng: "Longitude is not valid",
          name: "Name must be less than 50 characters",
          description: "Description is required",
          price: "Price per day is required"
        }
      })
    }
  })
// console.log(req.user.id)
  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });

  res.json(newSpot)
})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req, res)=> {
  const spotId = req.params.spotId;
  const {url, preview} = req.body;

  const spot = await Spot.findByPk(spotId)
  if(!spot){
    res.status(404).json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    )
  }

  const newImage = await SpotImage.create({
    spotId,
    url,
    preview
  });

  const result = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  }

  res.json(result)
});
//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res)=> {
  const spotId = req.params.spotId
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  const paramsArr = [address, city, state, country, lat, lng, name, description, price];

  paramsArr.forEach(param => {
    if(!param){
      res.status(400).json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "address": "Street address is required",
          "city": "City is required",
          "state": "State is required",
          "country": "Country is required",
          "lat": "Latitude is not valid",
          "lng": "Longitude is not valid",
          "name": "Name must be less than 50 characters",
          "description": "Description is required",
          "price": "Price per day is required"
        }
      })
    }
  })
  const spot = await Spot.findByPk(spotId);
  if(!spot){
    res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  spot.set({address, city, state, country, lat, lng, name, description, price})
  spot.save();
  res.json(spot)
})

//create review for a spot
router.post('/:spotId/reviews', requireAuth, async(req, res) => {
  const spotId = Number(req.params.spotId);
  const {review, stars} = req.body;
  const userId = req.user.id;

  if(!review || !stars){
    res.status(400).json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }

  const reviewCheck = await Review.findAll({
    where: {
      spotId,
      userId
    }
  })

  // for(let review of reviewCheck){
  //   if(userId == review.userId){
  //     const err = new Error('User already has a review for this spot')
  //     err.status = 403
  //     throw err
  //   }
  // }

  if(reviewCheck.length){
    const err = new Error('User already has a review for this spot')
    err.status = 403
    throw err
  }

  const spot = await Spot.findByPk(spotId)
  if(!spot){
    res.status(404).json(
      {
        message: "Spot couldn't be found",
        statusCode: 404
      }
    )
  }


  const newReviw = await Review.create({
    userId,
    spotId,
    review,
    stars
  });

  res.json(newReviw)

})


router.get('/:spotId/reviews', requireAuth, async(req, res)=> {
  const spotId = req.params.spotId;
  const spotReviews = await Review.findAll({
    where: {
      spotId
    },
    include: [
      {
        model: User
      },
      {
        model: ReviewImage
      }
    ]
  })

  if(!spotReviews.length){
    res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }


  let spotReviewsArr = []
  spotReviews.forEach(review => {
    spotReviewsArr.push(review.toJSON())
  })

  spotReviewsArr.forEach(review=> {
    delete review.User.username
    review.ReviewImages.forEach(image=> {
      delete image.reviewId
      delete image.createdAt
      delete image.updatedAt
    })
  })



  const obj = {}
  obj.Reviews = spotReviewsArr
  res.json(obj)
  // res.json(spotReviewsArr)
})

//create a booking bassed on spot id
router.post('/:spotId/bookings',  requireAuth, async(req, res)=> {
  const spotId = Number(req.params.spotId);
  const {startDate, endDate} = req.body
  const userId = req.user.id

  if(!startDate || !endDate){
    res.status(403).json({
      message: 'can not be left blank'
    })
  }
  // console.log(spotId, req.params.spotId)
  // if(startDate >= endDate){
  //   res.json({
  //      message: 'start date cen not be before end date',
  //      statuscode: 404
  //   })
  // }

  const spot = await Spot.findByPk(spotId)
  if(!spot){
    res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  // console.log(spotId, req.params.spotId)
  const bookingCheck = await Booking.findAll({
    where:{
      spotId
      // startDate,
      // endDate
    }
  })

  for(let booking of bookingCheck){
    booking = JSON.parse(JSON.stringify(booking))
    // console.log(booking)
    if(startDate > booking.startDate && startDate < booking.endDate){
      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "statusCode": 403,
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      })
    }
    if(endDate > booking.startDate && endDate < booking.endDate){
      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "statusCode": 403,
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      })
    }
    if(startDate == booking.startDate || endDate == booking.endDate){

      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "statusCode": 403,
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      })
    }

  }

  // console.log(bookingCheck)

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate
  });
  // console.log(newBooking)
  res.json(newBooking)
})



router.get('/:spotId/bookings', requireAuth, async(req, res)=> {
  const spotId = req.params.spotId;
  const spotIdBookings = await Booking.findAll({
    where: {
      spotId
    },
    include: {
        model: User
      }
  })

  if(!spotIdBookings.length){
    const err = new Error("Spot couldn't be found")
    err.status = 404
    throw err
  }

  const bookingArr = []
  spotIdBookings.forEach(booking=> {
    bookingArr.push(booking.toJSON())
  })

  bookingArr.forEach(booking=> {
    delete booking.User.username

  })




  const obj = {}
  obj.Bookings = bookingArr
  res.json(obj)

})

router.delete('/:spotId', requireAuth, async(req, res)=> {
  const spotId = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  if(spot.ownerId !== req.user.id){
    const err = new Error('You are not the owner of this spot')
    err.status = 403
    throw err
  }

  if(!spot){
    const err = new Error("Review Image couldn't be found")
    err.status = 404
    throw err
  }

    await spot.destroy()
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
})


module.exports = router;
