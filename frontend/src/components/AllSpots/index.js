import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './AllSpots.css';


const generatePreviewImage = (previewImage) => {
    if(previewImage === "There are no preview images for this spot"){
        previewImage= "https://www.guesty.com/wp-content/uploads/2019/09/seo-house-2.svg";
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

  return (
    <div className="all-spots-container">
      {spots.map(spot =>
        <NavLink to={`/spots/${spot.id}`} key={spot.id} className="spot-container">
            <div className="spot-info-container">
                <p className='spot-image-container'>
                    <img src={generatePreviewImage(spot.previewImage)} alt={spot.name}/>
                </p>
                <p className="spot-info">
                    <strong>{spot.name}</strong>
                </p>
                <p className="spot-info">
                    {spot.city}, {spot.state}
                </p>
                <p className="spot-info">
                    {spot.avgRating === "There are no current ratings for this spot" ? 'New' :
                    <>
                        <i className="fa-solid fa-star"></i>{spot.avgRating}
                    </>
                    }
                </p>
                <p className="spot-info">
                    <strong>${spot.price}</strong> per day
                </p>
            </div>
        </NavLink>)}
    </div>
  );
};

export default AllSpots;
