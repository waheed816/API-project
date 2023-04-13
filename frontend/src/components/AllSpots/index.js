import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './AllSpots.css';


const generatePreviewImage = (previewImage) => {
    if(previewImage === "There are no preview images for this spot"){
        previewImage= "https://st2.depositphotos.com/1000507/50672/v/600/depositphotos_506729114-stock-illustration-photo-allowed-restaurant-protect-privacy.jpg";
        return previewImage;
    }else
        return previewImage;
}

function AllSpots() {

    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots.allSpots));

    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])

    //USE THIS OR CODE BREAKS!!!
    if(!Object.keys(spots).length){
        return(
            <i className="fa-solid fa-truck-ramp-box spot-info-loading">LOADING...</i>
        )
    }

  return (
    <div className="all-spots-container">
      {spots.map(spot =>
        <NavLink to={`/spots/${spot.id}`} key={spot.id} className="spot-container">
            <div className="spot-info-container">
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
                {/* <p className="spot-info">
                    <strong>{spot.name}</strong>
                </p> */}
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
        </NavLink>)}
    </div>
  );
};

export default AllSpots;
