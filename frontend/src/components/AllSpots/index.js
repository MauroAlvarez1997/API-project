import React, { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import{NavLink} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './AllSpots.css';

const AllSpots = () => {
  const dispatch = useDispatch();

  const allSpots = useSelector(state => state.spots);

  const spotsArr = Object.values(allSpots);

  useEffect(()=> {
    dispatch(getAllSpots());
  }, [dispatch]);

  return(
    <div className="all-spots-container">
      {spotsArr.map(spot => (
        <ul className="spot-square" key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <img className="spot-img" src={spot.previewImage} alt={`image of spot with id of ${spot.id}`}/>
            <div className="spot-info">
              <h3 className="spot-location">{spot.city}, {spot.state}</h3>
              <h3 className="spot-rating">{spot.avgRating}</h3>
            </div>
            <h3 className="spot-price">${spot.price} night</h3>
          </NavLink>
        </ul>
      ))}
    </div>
  )
};

export default AllSpots;
