import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateSpot } from '../../store/spots';
import './CreateSpot.css'

function CreateSpotForm() {

    const dispatch = useDispatch();
    const history = useHistory();

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [img1url, setImg1url] = useState('');
    const [img2url, setImg2url] = useState('');
    const [img3url, setImg3url] = useState('');
    const [img4url, setImg4url] = useState('');
    const [img5url, setImg5url] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async(e) => {

        e.preventDefault();

        const allErrors = {};

        if (!country.length) allErrors.country = "Country is required";
        if (!address.length) allErrors.address = "Address is required";
        if (!city.length) allErrors.city = "City is required";
        if (!state.length) allErrors.state = "State is required";
        if (description.length < 30) allErrors.description = "Description is required and needs to be a minimum of 30 characters";
        if (!name.length) allErrors.name = "Name is required";
        if (!price){
            allErrors.price = "Price is required";
        }else if (!Number(price) && Number(price) !== 0){
            allErrors.price = "Price must be a number"
        }
        else if (price <= 0) allErrors.price = "Price must be greater than 0";




        if(!img1url.length){
            allErrors.img1url = "Preview image is required"
        } else if(!img1url.endsWith('.png') && !img1url.endsWith('.jpg') && !img1url.endsWith('.jpeg')){
            allErrors.img1url = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if(img2url.length > 0 && !img2url.endsWith('.png') && !img2url.endsWith('.jpg') && !img2url.endsWith('.jpeg')){
            allErrors.img2url = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if(img3url.length > 0 && !img3url.endsWith('.png') && !img3url.endsWith('.jpg') && !img3url.endsWith('.jpeg')){
            allErrors.img3url = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if(img4url.length > 0 && !img4url.endsWith('.png') && !img4url.endsWith('.jpg') && !img4url.endsWith('.jpeg')){
            allErrors.img4url = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if(img5url.length > 0 && !img5url.endsWith('.png') && !img5url.endsWith('.jpg') && !img5url.endsWith('.jpeg')){
            allErrors.img5url = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if(Object.keys(allErrors).length) return setErrors(allErrors);

        const newSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price
        };

        const imgArray = [
            { url: img1url, preview: true },
            { url: img2url, preview: false },
            { url: img3url, preview: false },
            { url: img4url, preview: false },
            { url: img5url, preview: false }
        ]

        const spot = await dispatch(thunkCreateSpot(newSpot, imgArray));
        history.push(`/spots/${spot.id}`);
    }


    return (
       <div className='create-spot-form-container'>
            <form onSubmit={handleSubmit}>
                <div className='section-inputs'>
                    <h1>Create a new spot</h1>
                    <strong>Where's your place located?</strong>
                    <p>Guests will only get your exact address once they book a reservation.</p>
                    <div className='input-labels'>
                        <label>Country</label>
                        <p className='create-spot-errors'>
                            {errors.country}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="country required"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div className='input-labels'>
                        <label>Street Address</label>
                        <p className='create-spot-errors'>
                            {errors.address}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className='city-state-container'>
                        <div className='city-info'>
                            <div className='input-labels'>
                                <label>City</label>
                                <p className='create-spot-errors'>
                                    {errors.city}
                                </p>
                            </div>
                            <div className='input-container'>
                                <input
                                    className='input-fields'
                                    type='text'
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                             </div>
                        </div>
                        <div className='state-info'>
                            <div className='input-labels'>
                                <label>State</label>
                                <p className='create-spot-errors'>
                                    {errors.state}
                                </p>
                            </div>
                            <div className='input-container'>
                                <input
                                    className='input-fields'
                                    type='text'
                                    placeholder="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='border-line'>
                    </div>
                </div>
                <div className='section-inputs'>
                    <strong>Describe your place to guests</strong>
                    <p>
                        Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <textarea
                        className='create-spot-text-area'
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className='create-spot-errors'>
                        {errors.description}
                    </p>
                </div>
                <div className='border-line'></div>
                <div className='section-inputs'>
                    <strong>Create a title for your spot</strong>
                    <p>
                        Catch guests' attention with a spot title that highlights what makes your place special.
                    </p>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Name of your spot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.name}
                        </p>
                    </div>
                </div>
                <div className='border-line'></div>
                <div className='section-inputs'>
                    <strong>Set a base price for your spot</strong>
                    <p>
                        Competitive pricing can help your listing stand out and rank higher in search results.
                    </p>
                    <div className='input-container'>
                        <div className='price-input'>
                            <label className='dollar-sign'>$</label>
                            <input
                                className='input-fields'
                                type='text'
                                placeholder="Price per night (USD)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                            <p className='create-spot-errors'>
                                {errors.price}
                            </p>
                    </div>
                </div>
                <div className='border-line'></div>
                <div className='section-inputs'>
                    <strong>Liven up your spot with photos</strong>
                    <p>
                        Submit a link to at least one photo to publish your spot.
                    </p>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Preview Image URL"
                            value={img1url}
                            onChange={(e) => setImg1url(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.img1url}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Image URL"
                            value={img2url}
                            onChange={(e) => setImg2url(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.img2url}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Image URL"
                            value={img3url}
                            onChange={(e) => setImg3url(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.img3url}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Image URL"
                            value={img4url}
                            onChange={(e) => setImg4url(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.img4url}
                        </p>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input-fields'
                            type='text'
                            placeholder="Image URL"
                            value={img5url}
                            onChange={(e) => setImg5url(e.target.value)}
                        />
                        <p className='create-spot-errors'>
                            {errors.img5url}
                        </p>
                    </div>

                </div>
                <div className='border-line'></div>
                <div className='submit-button-container'>
                    <button type="submit" className='create-spot-button'>Create Spot</button>
                </div>
            </form>
       </div>
    );
}

export default CreateSpotForm;
