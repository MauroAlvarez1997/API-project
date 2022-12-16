import { csrfFetch } from "./csrf";

// const CREATE_REVIEW = 'reviews/CREATEREVIEW'

// const actionCreateReview = (review) => ({
//   type: CREATE_REVIEW,
//   review
// });

// export const createReview = (content) => async dispatch => {

// }

const GET_USER_REVIEWS = 'reviews/GETUSERREVIEWS';
const GET_SPOT_REVIEWS = 'reviews/GETSPOTREVIEWS';

const actionGetUserReviews = (reviews) => ({
  type: GET_USER_REVIEWS,
  reviews
});

const actionGetSpotReviews = (reviews) => ({
  type: GET_SPOT_REVIEWS,
  reviews
});

export const getSpotReviews = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if(response.ok){
    const jsonResponse = await response.json();
    dispatch(actionGetSpotReviews(jsonResponse));
    return jsonResponse
  }
}

export const getUserReviews = () => async dispatch => {
  const response = await csrfFetch(`/api/reviews/current`);
  if(response.ok){
    const jsonResponse = await response.json();
    dispatch(actionGetUserReviews(jsonResponse));
    return jsonResponse
  }
}

const initialState = { spot: {}, user: {} }

const reviewReducer = (state = initialState, action) => {
  switch(action.type){
    case GET_USER_REVIEWS: {
      const newState = { spot: {}, user: {} };
      action.reviews.Reviews.forEach(review => {
        newState.user[review.id] = review
      });
      return newState
    }
    case GET_SPOT_REVIEWS: {
      const newState = {spot: {}, user: {}}
      action.reviews.Reviews.forEach(review => {
        newState.spot[review.id] = review
      });
      return newState
    }
    default:
      return state
  }
}

export default reviewReducer;
