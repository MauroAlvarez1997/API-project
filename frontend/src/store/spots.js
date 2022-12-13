const ALL_SPOTS = 'spots/GETALLSPOTS';

const actionAllSpots = (spots) => ({
  type: ALL_SPOTS,
  spots
});

export const getAllSpots = () => async dispatch => {
  const response = await fetch('/api/spots');
  console.log("HERE!!!!", response)
  if(response.ok){
    const jsonResponse = await response.json();
    // console.log("HERE!!!!", jsonResponse)
    dispatch(actionAllSpots(jsonResponse));
    // return jsonResponse
  }
}


const spotReducer = (state = {}, action) => {
  switch(action.type){
    case ALL_SPOTS:
      const spotObj = {};
      action.spots.Spots.forEach(spot => {
        spotObj[spot.id] = spot
      });
      return spotObj
    default:
      return state
  }
}

export default spotReducer;
