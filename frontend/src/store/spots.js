import { csrfFetch } from "./csrf";


//ACTION TYPES
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SPOT_INFO = 'spots/GET_SPOT_INFO';
const GET_ALL_USER_SPOTS = 'spots/GET_USER_SPOTS'



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

export const actionGetAllUserSpots = (spots) => {
  return{
      type: GET_ALL_USER_SPOTS,
      spots
  };
}

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
      dispatch(actionGetAllUserSpots(normalizedSpots));
      return normalizedSpots;
    };
};

export const thunkGetCurrentUserSpots = () => async (dispatch) => {

  const res = await csrfFetch('/api/spots/current');

  const spots = await res.json()

  if(spots === "You currently do not own any spots"){
    dispatch(actionGetAllUserSpots(spots))
  }else{
    const normalizedSpots = funcNormalizeSpots(spots.Spots);
    dispatch(actionGetAllUserSpots(normalizedSpots));
    // console.log("GJHGJHGKJHGKJHGJHG", normalizedSpots)
    return normalizedSpots;

  }

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

export const thunkCreateSpot = (spot, imgArray) => async (dispatch) => {
    const res = await csrfFetch('/api/spots',
      {
        method: 'POST',
        body: JSON.stringify(spot)
      });

    if (res.ok) {
      const spot = await res.json();
      for (const img of imgArray) {
        if (img.url) {
          await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            body: JSON.stringify(img)
          });
        };
      };
      return spot;
    };
};

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
        case GET_ALL_USER_SPOTS: {
            const newState = { ...state };
            newState.allSpots = action.spots;
            return newState;
        }
        default: return state
    }
};

export default spotsReducer;
