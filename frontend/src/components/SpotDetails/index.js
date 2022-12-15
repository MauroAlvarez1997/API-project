import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { deleteSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './SpotDetails.css'



const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const specificSpot = useSelector(state => state.spots.singleSpot);
  const currnetUserId = useSelector(state => state.session.user.id)
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
    //     console.log(data)
    //     if(data && data.errors) setErrors(data.errors);
    //     if(data && data.message) setErrors([data.message]);
    //   })
    // }
    await dispatch(deleteSpot(spotId));
    history.push('/')
  }

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
            <h2 className='spot-name-and-host'>
              {specificSpot.name} hosted by {specificSpot.Owner.firstName}
            </h2>
          </div>
          <hr></hr>
          <div className='spot-description'>
            <h3 className='spot-information-text-title'>
              Spot Information:
            </h3>
            <div>
              {validArr.map((pair) => (
                <div key={pair[0]}>
                  <div className='detail-list-container'>
                    <p className='detail-list-key'>{pair[0]}: </p>
                    <p className='detail-list-val'>{pair[1]}</p>

                  </div>
                  <hr></hr>
                </div>
              ))}
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
                        <div>
                          <NavLink to={`/spots/${specificSpot.id}/update`}>Update Spot</NavLink>
                        </div>
                        <div>
                          <button onClick={deleteSpotFunc}>
                            Delete Spot
                          </button>
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
    </div>
  );
}
export default SpotDetails;
