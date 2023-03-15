import { csrfFetch } from "./csrf";


//ACTION TYPES
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';


//ACTIONS
export const actionGetAllSpots = (spots) => {
    return{
        type: GET_ALL_SPOTS,
        spots
    };
}


//NORMALIZATION FUNCTIONS
const normalizeSpots = (spots) => {
    let normalizedSpots = {};
    spots.forEach(spot => {
      normalizedSpots[spot.id] = spot;
    })
    return normalizedSpots;
};


//THUNKS
export const thunkGetAllSpots = () => async (dispatch) => {

    const res = await csrfFetch('/api/spots');

    if (res.ok) {
      const spots = await res.json();
      const normalizedSpots = normalizeSpots(spots.Spots);
      dispatch(actionGetAllSpots(normalizedSpots));
      return normalizedSpots;
    };
};


//STATE SHAPE FOR SPOTS RELATED OBJECTS
const initialState = {
    allSpots: {}
};


const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            const newState = { ...state }
            newState.allSpots = action.spots
            return newState;
        default: return state
    }
};

export default spotsReducer;
