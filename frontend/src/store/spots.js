import { csrfFetch } from "./csrf";


//ACTION TYPES
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SPOT_INFO = 'spots/GET_SPOT_INFO';

//TODO: type for create



//ACTIONS
export const actionGetAllSpots = (spots) => {
    return{
        type: GET_ALL_SPOTS,
        spots
    };
}

export const actionGetSpotInfo = (spotInfo) => {
    return{
        type: GET_SPOT_INFO,
        spotInfo
    }
}

//TODO: action for create

//NORMALIZATION FUNCTIONS
const funcNormalizeSpots = (spots) => {
    let normalizedSpots = {};
    spots.forEach(spot => {
      normalizedSpots[spot.id] = spot;
    })
    return normalizedSpots;
};

const funcNormalizeSpotInfo = (spotInfo) => {
    let normalizedSpotInfo = {...spotInfo};
    normalizedSpotInfo.Owner = {...spotInfo.Owner};
    normalizedSpotInfo.SpotImages = [...spotInfo.SpotImages];
    return normalizedSpotInfo;
}

//THUNKS
export const thunkGetAllSpots = () => async (dispatch) => {

    const res = await csrfFetch('/api/spots');

    if(res.ok) {
      const spots = await res.json();
      const normalizedSpots = funcNormalizeSpots(spots.Spots);
      dispatch(actionGetAllSpots(normalizedSpots));
      return normalizedSpots;
    };
};

export const thunkGetSpotInfo = (spotId) => async (dispatch) => {

    const res = await csrfFetch(`/api/spots/${spotId}`)

    if(res.ok) {
        const spotInfo = await res.json();
        const normalizedSpotInfo = funcNormalizeSpotInfo(spotInfo);
        dispatch (actionGetSpotInfo(normalizedSpotInfo));
        return normalizedSpotInfo;
    }

}

//TODO: thunk for create


//STATE SHAPE FOR SPOTS RELATED OBJECTS
const initialState = {
    allSpots: {},
    singleSpot: {}
};


const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = { ...state };
            newState.allSpots = action.spots;
            return newState;
        }
        case GET_SPOT_INFO: {
            const newState = { ...state }
            newState.singleSpot = { ...action.spotInfo };
            newState.singleSpot.Owner = { ...action.spotInfo.Owner };
            newState.singleSpot.SpotImages = [ ...action.spotInfo.SpotImages ]
            return newState;
        }
        //TODO: case for create
        default: return state
    }
};

export default spotsReducer;