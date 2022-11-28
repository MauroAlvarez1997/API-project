const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// router.get('/', async(req, res) => {
//   const bookings = await Booking.findAll();

//   res.json(bookings)
// });
//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res)=> {
  const userId = req.user.id
  const currentUsersBookings = await Booking.findAll({
    where: {
      userId
    },
    include: {
      model: Spot,
      include: {
        model: SpotImage
      }
    }
  })

  const bookingsArr = []
  currentUsersBookings.forEach(booking => {
    bookingsArr.push(booking.toJSON())
  });

  bookingsArr.forEach(booking=> {
    delete booking.Spot.description
    delete booking.Spot.createdAt
    delete booking.Spot.updatedAt
    if(booking.Spot.SpotImages.preview){
      booking.Spot.previewImage = booking.Spot.SpotImages.url
    }else{
      booking.Spot.previewImage = 'there is no prevewImage available at this time'
    }
    delete booking.Spot.SpotImages
  });

  const obj = {}
  obj.Bookings = bookingsArr
  res.json(obj)
});

router.put('/:bookingId', requireAuth, async(req, res)=> {
  const bookingId = req.params.bookingId;
  const {startDate, endDate} = req.body;

  const bookingCheck = await Booking.findByPk(bookingId)

  if(!bookingCheck){
    res.status(404).json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  }

  bookingCheck.set({
    startDate,
    endDate
  })
  bookingCheck.save()
  res.json(bookingCheck)
})



//delete booking
router.delete('/:bookingId', requireAuth, async(req, res)=> {
  const bookingId = req.params.bookingId;

  const booking = await Booking.findOne({
    where: {
      id: bookingId
    }
  })

  if(!booking){
    return res.status(404).json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }

  if(booking.userId !== req.use.id){
    const err = new Error('You are not the owner of this spot')
    err.status = 403
    throw err
  }

    await booking.destroy()
    return res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })


})



module.exports = router;
