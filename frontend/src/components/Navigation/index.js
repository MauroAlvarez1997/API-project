
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='constant-top-bar-container'>
    <div className='constant-top-bar'>
      <div className='constant-top-bar-left'>
        <h1>
          <NavLink className="home-link" exact to="/">Maubnb</NavLink>
        </h1>
      </div>
      <div className='constant-top-bar-right'>
        <ul className='top-bar-right-list'>
          {/* <li>
            {sessionUser &&
              <NavLink className="create-spot-link" exact to="/reviews/my-reviews">My Reviews</NavLink>
            }
          </li> */}
          <li>
            {sessionUser &&
              <NavLink className="create-spot-link" exact to="/spots/new">Maubnb your home</NavLink>
            }
          </li>
          {isLoaded && (
            <li>
              <ProfileButton className="profile-button" user={sessionUser} />
            </li>
          )}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default Navigation;
