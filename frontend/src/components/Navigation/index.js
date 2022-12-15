
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
       <img className='airbnb-logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1280px-Airbnb_Logo_B%C3%A9lo.svg.png' alt='spotify logo' />
      </div>
      <div className='constant-top-bar-right'>
        <ul className='top-bar-right-list'>
          <li>
            {sessionUser &&
              <NavLink className="create-spot-link" exact to="/spots/new">Create Spot</NavLink>
            }
          </li>
          <li>
            <NavLink className="home-link" exact to="/">Home</NavLink>
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
