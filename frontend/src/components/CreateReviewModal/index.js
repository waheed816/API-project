import { thunkCreateSpotReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import ReviewStarRating from "./ReviewStarRating";
import { useDispatch } from "react-redux";
import { useState } from "react";
import './CreateReviewModal.css'


function CreateReviewModal({spotId}) {
    // const [error, setError] = useState({});
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(null);
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const onChange = (number) => {
        setRating(parseInt(number));
    };

    const disabled = () => {
        if (review.length < 10) return true;
        if (!rating) return true;
        return false;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReview = {
          review,
          stars: rating
        };

        dispatch(thunkCreateSpotReview(newReview, spotId));
        closeModal();
    };




    return (
        <div className="create-review-modal-container">
            <div>
                <div className="post-review-text"> How was your stay? </div>
            </div>
            <form className="create-review-form" onSubmit={handleSubmit}>
                <textarea
                    className="review-text-area"
                    value={review}
                    placeholder='Leave your review here...'
                    onChange={(e) => setReview(e.target.value)}
                >
                </textarea>
                {/* {review.length < 10 &&
                <div className="review-text-directions">Must be at least 10 characters</div>
                } */}
                <div className="review-star-rating">
                    <ReviewStarRating rating={rating} onChange={onChange}/>
                </div>
                <div>
                    <button
                        className={disabled() ? "review-submit-disabled" : "review-submit-button"}
                        type="submit"
                        disabled={disabled()}
                    >
                        Submit Your Review
                    </button>
                </div>
            </form>

        </div>


    )
}

export default CreateReviewModal;
