import { csrfFetch } from "./csrf";
import { thunkGetSpotInfo } from "./spots";

//ACTION TYPES
const GET_ALL_SPOT_REVIEWS = 'spots/spotdId/GET_ALL_SPOT_REVIEWS'

//ACTIONS
export const actionGetAllSpotReviews = (reviews) => {
    return{
        type: GET_ALL_SPOT_REVIEWS,
        reviews
    };
};

//NORMALIZATION FUNCTIONS
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


const initialState = {
    spot : {},
    user: {}
}


const reviewsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_SPOT_REVIEWS: {
            const newState = { ...state };
            newState.spot = action.reviews;
            return newState
        }
    default: return { ...state };
    }
};

export default reviewsReducer;
