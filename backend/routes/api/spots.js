const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//Get all Spots
router.get('/', async(req, res) => {
  const spots = await Spot.findAll({
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
router.get('/:spotId', requireAuth, async(req, res) => {
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
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
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
      res.json({
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
    res.json(
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
  console.log(paramsArr)
  paramsArr.forEach(param => {
    if(!param){
      res.json({
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
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  spot.set({address, city, state, country, lat, lng, name, description, price})
  spot.save();
  res.json(spot)
})

module.exports = router;
