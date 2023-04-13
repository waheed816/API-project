import { useDispatch } from "react-redux";
import { thunkDeleteUserReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";

import '../ConfirmDeleteSpotModal/ConfirmDeleteSpotModal.css'

function ConfirmDeleteReviewModal({reviewId, spotId}) {

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteReview = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteUserReview(reviewId, spotId));
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
                Are you sure you want to delete this review?
            </div>
            <div className="confirm-delete-spot-buttons-container">
                <div className="confirm-delete-spot-buttons-inner-container">
                    <button className='confirm-delete-spot-button' onClick={deleteReview}>Yes (Delete Review)</button>
                </div>
                <div className="confirm-delete-spot-buttons-inner-container">
                    <button className='keep-spot-button' onClick={closeModal}>No (Keep Review)</button>
                </div>
            </div>

        </div>
    )
}

export default ConfirmDeleteReviewModal;
