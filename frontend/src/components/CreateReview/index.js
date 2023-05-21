import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './CreateReview.css'

const CreateReview = () => {
const {spotId} = useParams()
const dispatch = useDispatch()
const history = useHistory()
const state = useSelector(state => state);

let userId;
if(state.session.user){
  userId = state.session.user.id
}

const [errors, setErrors] = useState([]);
const [stars, setStars] = useState('');
const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      userId,
      spotId,
      stars,
      review,
    };

    setErrors([]);
    const dispatchReview = await dispatch(createReview(newReview, spotId))
    .catch(async (res) => {
      const data = await res.json();
      console.log(data)
      if(data && data.errors) setErrors(data.errors);
      if(data && data.message) setErrors([data.message]);
    });

    if(dispatchReview){
      history.push(`/spots/${spotId}`)
    }
  };


  return(
    <div className='createReviewPage'>
      <div className='createReviewContainer'>
      <h1>Create Review form</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className='createReviewInputContainer'>
        <label>
          Star Rating:
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        <label>
          Review
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        </div>
        <div className='createReviewButtonContainer'>
        <button className='createReviewButton' type="submit">Create Review</button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default CreateReview;
