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
const CREATE_REVIEW = 'reviews/CREATEREVIEW';
const DELETE_REVIEW = 'reviews/DELETEREVIEW'

const actionGetUserReviews = (reviews) => ({
  type: GET_USER_REVIEWS,
  reviews
});

const actionGetSpotReviews = (reviews) => ({
  type: GET_SPOT_REVIEWS,
  reviews
});

const actionCreateReview = (review) => ({
  type: CREATE_REVIEW,
  review
});

const actionDeleteReview = (review) => ({
  type: DELETE_REVIEW,
  review
});

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    const deletedtReview = await response.json();
    dispatch(actionDeleteReview(deletedtReview));
  }
};

export const createReview = (content, spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  });
  if(response.ok){
    const jsonResponse = await response.json();
    dispatch(actionCreateReview(jsonResponse));
    return jsonResponse
  }
}

export const getSpotReviews = (spotId) => async dispatch => {

  const response = await csrfFetch(`/api/spots/${spotId}/reviews`).catch(err => err);
  console.log('LOOK HERE!!!', response)
  if(response.ok){
    const jsonResponse = await response.json();
    console.log('LOOK HERE!!! jsonResponse', jsonResponse)
    dispatch(actionGetSpotReviews(jsonResponse));
  } else{
    const jsonResponse = await response.json();
    console.log('LOOK HERE!!! jsonResponse', jsonResponse)
    return dispatch(actionGetSpotReviews(jsonResponse))
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
      if(action.reviews.Reviews){
      action.reviews.Reviews.forEach(review => {
        newState.spot[review.id] = review
      });
      }
      return newState
    }
    case CREATE_REVIEW: {
      const newState = {...state};
      const spotCopy = {...state.spot};
      spotCopy[action.review.id] = action.review
      newState.spot = spotCopy
      return newState
    }
    case DELETE_REVIEW: {
      const newState = {...state};
      const spotCopy = {...state.spot};
      delete spotCopy[action.review.id]
      newState.spot = spotCopy
      return newState
    }
    default:
      return state
  }
}

export default reviewReducer;
