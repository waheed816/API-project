import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetCurrentUserSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import ConfirmDeleteSpotModal from "../ConfirmDeleteSpotModal";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalMenuItem from '../OpenModalButton';
import '../AllSpots/AllSpots.css';
import './ManageSpots.css'


const generatePreviewImage = (previewImage) => {
    if(previewImage === "There are no preview images for this spot"){
        previewImage= "https://st2.depositphotos.com/1000507/50672/v/600/depositphotos_506729114-stock-illustration-photo-allowed-restaurant-protect-privacy.jpg";
        return previewImage;
    }else
        return previewImage;
}

function ManageSpots() {

    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots.allSpots));

    useEffect(() => {
        dispatch(thunkGetCurrentUserSpots());
    }, [dispatch])

//USE THIS OR CODE BREAKS!!!
if(!Object.keys(spots).length){
    return(
        <i className="fa-solid fa-truck-ramp-box spot-info-loading">LOADING...</i>
    )
}

  return (
    <div>
        {spots.join('') === "You currently do not own any spots" ?
            <div className='manage-create-spot-container'>
                <div className="no-spots-heading">
                    <h2 className="manage-spots-text">Manage Spots</h2>
                </div>
                <div>
                    <NavLink to='/spot/createSpotForm' className='manage-create-spot'>Create a New Spot</NavLink>
                </div>
            </div>
            :
            <div>
                <div className="manage-spots-heading">
                    <h2 className="manage-spots-text">Manage Spots</h2>
                </div>
                        <div className="all-spots-container manage-spots">
                            {spots.map(spot =>
                                <div>
                                    <NavLink to={`/spots/${spot.id}`} key={spot.id} className="spot-container">
                                        <div title={spot.name} className="spot-info-container">
                                            <div className='spot-image-container'>
                                                <img
                                                    className="all-spots-image"
                                                    src={generatePreviewImage(spot.previewImage)}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://st3.depositphotos.com/26272052/33085/v/600/depositphotos_330852614-stock-illustration-color-delete-folder-icon-isolated.jpg"
                                                    }}
                                                    alt={`${spot.name}'s photo unavailable`}>
                                                </img>
                                            </div>
                                            <div className="city-state-star-container">
                                                <p className="spot-info">
                                                    {spot.city}, {spot.state}
                                                </p>
                                                <p className="spot-info">
                                                    <i className="fa-solid fa-star fa-xl"></i>
                                                    {spot.avgRating === "There are no current ratings for this spot" ? <strong className="all-spots-price">New</strong> :
                                                    <strong className="all-spots-rating">
                                                    {`${Number(spot.avgRating).toFixed(1)}`}
                                                    </strong>
                                                    }
                                                </p>
                                            </div>
                                            <p className="spot-info">
                                                <strong className="all-spots-price">${Number(spot.price).toFixed(2)}</strong>/night
                                            </p>
                                        </div>
                                    </NavLink>
                                        <div className="update-delete-spot">
                                            <NavLink to={`/spot/${spot.id}/updateSpotForm`} style={{textDecoration: 'none'}}>
                                                    <div className='update-spot-button'>Update</div>
                                            </NavLink>
                                            <div>
                                                <OpenModalMenuItem
                                                    itemText="Delete"
                                                    modalComponent={<ConfirmDeleteSpotModal spotId={spot.id}/>}
                                                />
                                            </div>
                                        </div>
                                </div>

                            )}
                    </div>
                </div>
        }
    </div>
  );
};


export default ManageSpots;
