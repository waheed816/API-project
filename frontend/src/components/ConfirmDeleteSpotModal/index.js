import { useDispatch } from "react-redux";
import { thunkDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";

import './ConfirmDeleteSpotModal.css'

function ConfirmDeleteSpotModal({spotId}) {

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteSpot = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteSpot(spotId));
        closeModal();
    }


    return(
        <div className="confirm-delete-spot-modal-container">

            <div className="delete-spot-modal">
                <div className="confirm-delete-title">
                    Confirm Delete
                </div>
            </div>
            <div>
                Are you sure you want to remove this spot from the listings?
            </div>
            <div className="confirm-delete-spot-buttons-container">
                <div className="confirm-delete-spot-buttons-inner-container">
                    <button className='confirm-delete-spot-button' onClick={deleteSpot}>Yes (Delete Spot)</button>
                </div>
                <div className="confirm-delete-spot-buttons-inner-container">
                    <button className='keep-spot-button' onClick={closeModal}>No (Keep Spot)</button>
                </div>
            </div>

        </div>
    )
}

export default ConfirmDeleteSpotModal
