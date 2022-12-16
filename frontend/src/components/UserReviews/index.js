import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserReviews } from '../../store/reviews';
import { useHistory } from 'react-router-dom';
import { deleteReview } from '../../store/reviews';
import './UserReviews.css'

const UserReviews = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const thisUsersReviews = useSelector(state => state.reviews.user)
  const currentStete = useSelector(state => state)

  let currnetUserId;
  if(currentStete.session.user){
    currnetUserId = currentStete.session.user.id;
  }

  console.log(thisUsersReviews)
  const reviewsArr = Object.values(thisUsersReviews)

  useEffect(()=> {
    dispatch(getUserReviews())
  }, [dispatch])

  return (
    <div>
      <div className='userReviewPageContainer'>
        <div className='userReviewsTopTitleBar'>
          <div className='titleForUserReviews'>
          All Current Users Reviews:
         </div>
        </div>
        <div className='AllReviewsBody'>
        {!reviewsArr.length &&
          <div>
            You currently have no reviews to display
          </div>
          }
          {reviewsArr.map(reviewObj => (
            <div className='reviewbox' key={reviewObj.id}>
              <div className='topBarOfReviewBar'>
                <div className='leftSideOftopBarOfReviewBar'>
                  <div className='ReviewIdContentBox'>
                    <div className='ReviewIdContentTitle'>
                      Review ID:
                    </div>
                    <div className='ReviewIdContent'>
                      {reviewObj.id}
                    </div>
                  </div>
                  <div className='SpotIdContentBox'>
                    <div className='SpotIdContentTitle'>
                      Spot ID:
                    </div>
                    <div className='SpotIdContent'>
                      {reviewObj.spotId}
                    </div>
                  </div>
                  <div className='starsContentBox'>
                    <div className='starsContentTitle'>
                      Star Rating:
                    </div>
                    <div className='starsContent'>
                      {reviewObj.stars}
                    </div>
                  </div>
                </div>
                <div className='rightSideOftopBarOfReviewBar'>
                  <div className='createdAtContentBox'>
                    <div className='createdAtContentTitle'>
                      Created:
                    </div>
                    <div className='createdAtContent'>
                      {reviewObj.createdAt}
                    </div>
                  </div>
                  <div className='updatedAtContentBox'>
                    <div className='updatedAtContentTitle'>
                      Last Updated:
                    </div>
                    <div className='updatedAtContent'>
                      {reviewObj.updatedAt}
                    </div>
                  </div>
                  <div className='updatedAtContentBox'>
                    {(currnetUserId === reviewObj.userId) &&
                    <button onClick={async (e) => {
                      e.preventDefault()

                      await dispatch(deleteReview(reviewObj.id));
                      history.push(`/`)
                    }}>
                      Delete Review
                    </button>
                    }
                  </div>
                </div>
              </div>
              <div className='bottomBarOfReviewBar'>
                <div className='reviewContentBox'>
                  <div className='reviewContentTitle'>
                    Review:
                  </div>
                  <div className='reviewContent'>
                    {reviewObj.review}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
export default UserReviews;
