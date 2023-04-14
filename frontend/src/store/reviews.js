import { csrfFetch } from "./csrf";
import { thunkGetSpotInfo } from "./spots";

//ACTION TYPES
const GET_ALL_SPOT_REVIEWS = 'spots/spotdId/GET_ALL_SPOT_REVIEWS'
const DELETE_REVIEW = 'spots/spotId/DELETE_USER_REVIEW'

//ACTIONS
export const actionGetAllSpotReviews = (reviews) => {
    return{
        type: GET_ALL_SPOT_REVIEWS,
        reviews
    };
};

export const actionDeleteReview = (reviewId) => {
    return{
        type: DELETE_REVIEW,
        reviewId
    }
}


//NORMALIZATION FUNCTION
const funcNormalizeSpotReviews = (reviews) => {
    let normalizedSpotReviews = {};
    if (reviews){
        reviews.forEach(review => normalizedSpotReviews[review.id] = review);
    }
    return normalizedSpotReviews;
};

//THUNKS
export const thunkGetAllSpotReviews = (spotId) => async (dispatch) => {

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if(res.ok) {
        const allSpotReviews = await res.json();
        const normalizedReviews = funcNormalizeSpotReviews(allSpotReviews.Reviews);
        dispatch(actionGetAllSpotReviews(normalizedReviews));
        return normalizedReviews;
    };
};

export const thunkDeleteUserReview = (reviewId, spotId) => async dispatch => {

    const res = await csrfFetch(`/api/reviews/${reviewId}`,
      { method: 'DELETE' })

    if (res.ok) {
      dispatch(actionDeleteReview(reviewId));
      dispatch(thunkGetSpotInfo(spotId));
      return;
    }
};

export const thunkCreateSpotReview = (newReview, spotId) => async dispatch => {

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });

    if (res.ok) {
      await dispatch(thunkGetAllSpotReviews(spotId));
      await dispatch(thunkGetSpotInfo(spotId));
      return;
    };
};

//STATE SHAPE FOR REVIEWSS RELATED OBJECTS
const initialState = {
    spot : {},
    user: {}
}

//REVIEWS REDUCER
const reviewsReducer = (state = initialState, action) => {
    switch(action.type){

        case GET_ALL_SPOT_REVIEWS: {
            const newState = { ...state };
            newState.spot = action.reviews;
            return newState
        }

        case DELETE_REVIEW: {
            const newState = { ...state, spot: { ...state.spot, ...state.user }};
            delete newState.spot[action.reviewId]
            delete newState.user[action.reviewId]
            return newState;
        }

        default: return { ...state };
    }
};

export default reviewsReducer;
