import { csrfFetch } from "./csrf";

const ALL_SPOTS = 'spots/GETALLSPOTS';
const ONE_SPOT = 'spots/GETSPOTBYID';
const CREATE_SPOT = 'spots/CREATESPOT';


const actionAllSpots = (spots) => ({
  type: ALL_SPOTS,
  spots
});

const actionSpotById = (spot) => ({
  type: ONE_SPOT,
  spot
});

const actionCreateSpot = (spot) => ({
  type: CREATE_SPOT,
  spot
});

export const createSpot = (newSpot) => async dispatch => {
  console.log("new spot",newSpot)
  const response = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot)
  });
  console.log(response)
  if(response.ok){
    const newSpotJson = await response.json();
    console.log("look here!", newSpot)
    const response2 = await csrfFetch(`/api/spots/${newSpotJson.id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: newSpot.imageUrl,
        preview: true
      })
    })
    if(response2.ok){
      dispatch(actionCreateSpot(newSpotJson));
      return newSpotJson
    }
  }
}

export const getSpotById = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if(response.ok){
    const jsonResponse = await response.json();
    dispatch(actionSpotById(jsonResponse))
  }
}

export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  if(response.ok){
    const jsonResponse = await response.json();
    dispatch(actionAllSpots(jsonResponse));
  }
}

const initialState = { allSpots: {}, singleSpot: {}};

const spotReducer = (state = initialState, action) => {
  switch(action.type){
    case ALL_SPOTS: {
      const newState = { allSpots: {}, singleSpot: {} };
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      });
      return newState;
    }
    case ONE_SPOT: {
      const newState = {...state, singleSpot:{}}
      newState.singleSpot = action.spot
      return newState;
    }
    case CREATE_SPOT: {
      const newState = {...state};
      const allSpotsCopy = {...state.allSpots};
      allSpotsCopy[action.spot.id] = action.spot
      newState.allSpots = allSpotsCopy
      return newState
    }
    default:
      return state
  }
}

export default spotReducer;
