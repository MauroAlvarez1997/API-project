import React, { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import{NavLink} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './AllSpots.css';

const AllSpots = () => {
  const dispatch = useDispatch();

  const allSpots = useSelector(state => state.spots.allSpots);

  const spotsArr = Object.values(allSpots);

  useEffect(()=> {
    dispatch(getAllSpots());
  }, [dispatch]);

  return(
    <div className="pageContainer">
    <div className="all-spots-container">
      {spotsArr.map(spot => (
        <div className="spot-square" key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <img className="spot-img" src={spot.previewImage} alt={`spot with id of ${spot.id}`}/>
            <div className="spot-info">
              <div className="spot-location">{spot.city}, {spot.state}</div>
              <div className="spot-rating"><i className="fa-solid fa-star fa-xs"></i>{spot.avgRating}</div>
            </div>
            <div className="spot-price-container">
              <div className="spot-price">${spot.price} </div>
              <div className="night-text">night</div>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
    </div>
  )
};

export default AllSpots;
