import React, { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { deleteSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import { getSpotReviews, deleteReview } from '../../store/reviews';
import './SpotDetails.css'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const specificSpot = useSelector(state => state.spots.singleSpot);
  const currentStete = useSelector(state => state)

  let currnetUserId;
  if(currentStete.session.user){
    currnetUserId = currentStete.session.user.id;
  }
  console.log('currentState',currentStete)

  let thisSpotsReviews;
  if(currentStete.reviews){
    thisSpotsReviews = currentStete.reviews.spot;
  }

  const reviewsArr = Object.values(thisSpotsReviews)
  console.log('reviewsArr',reviewsArr)

  // const [errors, setErrors] = useState([]);
  const history = useHistory()

  const spotArr = Object.entries(specificSpot)

  const validArr = []
  spotArr.forEach(pair => {
    if(typeof pair[1] !== "object"){
      validArr.push(pair)
    }
  })

  useEffect(()=> {
    dispatch(getSpotById(spotId));
  }, [spotId]);

  useEffect(()=> {
    dispatch(getSpotReviews(spotId))
  }, [spotId])

  if(!specificSpot.SpotImages){
    return null;
  }

  const deleteSpotFunc = async (e) => {
    e.preventDefault()
    // setErrors([]);
    // if(specificSpot.ownerId !== currnetUserId){
    //   throw new Error('This user is not authorized to delete')
    //   .catch(async (res) => {
    //     const data = await res.json();
    //
    //     if(data && data.errors) setErrors(data.errors);
    //     if(data && data.message) setErrors([data.message]);
    //   })
    // }
    await dispatch(deleteSpot(spotId));
    history.push('/')
  }

  // const deleteReviewFunc = async (e) => {
  //   e.preventDefault()

  //   await dispatch(deleteReview(spotId));
  // }


  return(
    <div className='spot-detail-body'>
      <div className='top-information-container'>
        <div className='upper-information'>
          <h1 className='location-name-title'>
            {specificSpot.name.toUpperCase()}
          </h1>
        </div>
        <div className='lower-information'>
          <div className='left-information-container'>
            <div className='title-star-review'>
              <i className="fa-solid fa-star fa-xs"></i>{specificSpot.avgStarRating} ·
            </div>
            <div className='title-num-reviews'>
               {specificSpot.numReviews} reviews
            </div>
            <div>
            ·
            </div>
            <div className='title-location'>
              {specificSpot.city}, {specificSpot.state}, {specificSpot.country}
            </div>
          </div>
          {/* <div className='right-information-container'>
            <div className='title-share'>
              <i className="fa-solid fa-arrow-up-from-bracket"></i> Share
            </div>
            <div className='title-save'>
              <i className="fa-regular fa-heart"></i> Save
            </div>
          </div> */}

        </div>
      </div>
      <div className='image-container'>
        {specificSpot.SpotImages.map((image) => (
          <img className="specific-spot-img" key={image.id} src={image.url} alt={`spot with id of ${image.id}`}/>
        ))}
      </div>
      <div className='spot-information-container'>
        <div className='spot-information-left'>
          <div className='title-information'>
            <div className='title-information-left'>
              <h2 className='spot-name-and-host'>
                {specificSpot.name} hosted by {specificSpot.Owner.firstName}
              </h2>
              <div className='under-spot-name-and-host'>
                8 · guests3 · bedrooms4 · beds3 · baths
              </div>
            </div>
            <div className='title-information-right'>
              <i className="fa-regular fa-circle-user fa-2xl"></i>
            </div>
          </div>
          <hr></hr>
          <div className='spot-description'>
            <div className='info-block-1'>
              <div className='info-block-1-icon'>
                <div className='door-icon-div'>
                  <i class="fa-solid fa-door-open fa-xl"></i>
                </div>
              </div>
              <div className='info-block-1-info'>
                <h4 className='spot-information-text-title'>
                Self check-in
                </h4>
                <div className='info-block-1-info-gray'>
                  Check yourself in with the lockbox.
                </div>
              </div>
            </div>

            <div className='info-block-1'>
              <div className='info-block-1-icon'>
                <div className='door-icon-div'>
                  <i class="fa-solid fa-medal fa-xl"></i>
                </div>
              </div>
              <div className='info-block-1-info'>
                <h4 className='spot-information-text-title'>
                  {specificSpot.Owner.firstName} is a Superhost
                </h4>
                <div className='info-block-1-info-gray'>
                  Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                </div>
              </div>
            </div>

            <div className='info-block-1'>
              <div className='info-block-1-icon'>
                <div className='door-icon-div'>
                <i class="fa-solid fa-location-dot fa-xl"></i>
                </div>
              </div>
              <div className='info-block-1-info'>
                <h4 className='spot-information-text-title'>
                  Great location
                </h4>
                <div className='info-block-1-info-gray'>
                  95% of recent guests gave the location a 5-star rating.
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className='info-block-2-container'>
            <div className='image-aircover-conatiner'>
              <img className='aircover-image' src='https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg' alt='aircover'/>
            </div>
            <div className='content-aircover-conatiner'>
              <div>Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.</div>
            </div>
          </div>
          <hr></hr>
          <div className='info-block-2-container'>
            <div className='container-information-under-air'>
              <div className='pargraph-information-block-3'>
                Located right next to the highway allows you to easily travel anywhere in the Houston area: The Woodlands, Katy, Sugarland, Baytown, Conroe, Galveston, etc. So whether you’re relocating and need a temporary home or coming to play and need a place to stay Heart of Houston, this home is geared up to make your Houston visit easy, comfortable, and enjoyable. Come stay with us.
              </div>
              <div className='pargraph-information-block-3'>
                Plenty of FREE street parking is available. We live in same complex and will help you with your needs, and any tips you might need for a great time in Houston.
              </div>
              <div className='pargraph-information-block-3'>
                We have one camera on our front porch. It is there simply to protect package deliveries, and prevent any bad activity. There are no cameras located within the unit.
              </div>
              <div className='pargraph-information-block-3'>
               With a WalkScore of 88, this Montrose/Neartown home has quick access to the best of restaurants, shops, museums, and bars that Houston has to offer.
              </div>
              <div className='pargraph-information-block-3'>
                We do charge $18 per day for every extra guest over 2, which includes infants. If your total is over 2 individuals and an infant is included, you will be billed for the infant after your stay by AirBnB. Our efforts have included but are not limited to a working smoke and CO detector.
              </div>
            </div>
          </div>

          <hr></hr>
          <div className='info-block-2-container'>
            <div className='anemetiesTitle'>
              <h3>
                What this place offers
              </h3>
            </div>

            <div className='anemeties-info-container'>
              <div className='anemity-cobtainer'>
                <div className='anemity'>
                  <i class="fa-solid fa-kitchen-set fa-xl anemity-icon"></i> <div className='anemity-title'>Kitchen</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-wifi fa-xl anemity-icon"></i> <div className='anemity-title'>Wifi</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-car-rear fa-xl anemity-icon"></i> <div className='anemity-title'>Free parking</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-person-swimming fa-xl anemity-icon"></i> <div className='anemity-title'>Shared outdoor pool - available all year, open specific hours</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-paw fa-xl anemity-icon"></i> <div className='anemity-title'>Pets allowed</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-tv fa-xl anemity-icon"></i> <div className='anemity-title'>65" HDTV with Disney+, Hulu, Netflix, Roku</div>
                </div>
                <div className='anemity'>
                  <i class="fa-regular fa-snowflake fa-xl anemity-icon"></i> <div className='anemity-title'>Central air conditioning</div>
                </div>
                <div className='anemity'>
                  <i class="fa-solid fa-shield-halved fa-xl anemity-icon"></i> <div className='anemity-title'>Security system on property</div>
                </div>
              </div>
            </div>

          </div>



        </div>


        <div className='spot-information-right'>
          <div className='sticky-layer-1'>
            <div className='sticky-layer-2'>
              <div className='sticky-card-layer-1'>
                <div className='sticky-card-layer-2'>
                  <div className='sticky-card-layer-3'>
                    <div className='card-container'>
                      <div className='reservation-box'>
                        <div className='price-review-bar'>
                          <div className='price-box'>
                            <div className='card-price-bold card-top-bar-content'>
                              ${specificSpot.price}
                            </div>
                            <div className='card-top-bar-content'>
                               night
                            </div>
                          </div>
                          <div className='review-box'>
                            <div className='star-avg-rating card-top-bar-content'>
                              <i className="fa-solid fa-star fa-xs"></i>{specificSpot.avgStarRating}
                            </div>
                            <div className='dot-numReviews card-top-bar-content'>
                              {specificSpot.numReviews} reviews
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                      </ul> */}
                      {(specificSpot.ownerId === currnetUserId) &&
                      <div>
                        <div className='clickables-in-sticky'>
                          <NavLink to={`/spots/${specificSpot.id}/update`}>Update Spot</NavLink>
                        </div>
                        <div >
                          <button className='delete-button' onClick={deleteSpotFunc}>
                            Delete Spot
                          </button>
                        </div>
                      </div>
                      }
                      {((specificSpot.ownerId !== currnetUserId)&& currnetUserId) &&
                      <div>
                        <div className='clickables-in-sticky'>
                          <NavLink to={`/reviews/${specificSpot.id}/create`}>Create Review</NavLink>
                        </div>
                      </div>
                      }
                      {/* <div className='cost-box'>
                        <div className='checkin-and-out-container'>
                          <div className='chekin-box'>
                            <input className='check-in' value='CHECK-IN' type="text"></input>
                          </div>
                          <div className='checkout-box'>
                            <input className='check-out' value='CHECK-OUT' type="text"></input>
                          </div>
                        </div>
                        <div className='guest-container'>
                          <div className='guest-box'>
                            <input className='guest-input' value='Number of Guest' type="text"></input>
                          </div>
                        </div>
                      </div>
                      <div className='reserve-button-container'>
                        <input className='reserve-button' type="button" value="Reserve"/>
                      </div> */}
                      <p className='wont-be-charged'> You won't be charged yet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <div className='Bottom-Information-Container'>
      <div className='userReviewPageContainer'>
        <div className='userReviewsTopTitleBar'>
          <div className='titleForUserReviews'>
            <h2>
              <i className="fa-solid fa-star fa-xs">
              </i>{specificSpot.avgStarRating} · {specificSpot.numReviews} reviews
            </h2>
         </div>
        </div>
        <div className='AllReviewsBody'>
          {!reviewsArr.length &&
          <div>
            There are currently no reviews to display for this spot
          </div>
          }
          {(thisSpotsReviews && reviewsArr[0]) && reviewsArr.map(reviewObj => (
            <div className='reviewbox' key={reviewObj.id}>
              {console.log(currentStete.session.user)}
              <div className='topBarOfReviewBar'>
                <div className='leftSideOftopBarOfReviewBar'>
                  <div className='review-prerson-icon'>
                    <i className="fa-regular fa-circle-user fa-2xl"></i>
                  </div>
                  <div className='name-and-date-for-review'>
                    <div className='reviewer-name'>
                      User: #{reviewObj.id}
                    </div>
                    <div className='review-date-made'>
                      {new Date(reviewObj.createdAt).toDateString()}

                    </div>
                  </div>
                </div>
                <div className='rightSideOftopBarOfReviewBar'>

                  <div className='updatedAtContentBox'>
                    {(currnetUserId === reviewObj.userId) &&
                    <button onClick={async (e) => {
                      e.preventDefault()

                      await dispatch(deleteReview(reviewObj.id));
                      history.push(`/`)
                    }}>
                      Delete Review
                    </button>
                    }
                  </div>
                </div>
              </div>
              <div className='bottomBarOfReviewBar'>
                <div className='reviewContentBox'>
                  <div className='reviewContentTitle'>
                    Review:
                  </div>
                  <div className='reviewContent'>
                    {reviewObj.review}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
      </div>
    </div>
  );
}
export default SpotDetails;
