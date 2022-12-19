import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="top-profile-button" onClick={openMenu}>
      <i className="fa-solid fa-bars"></i>
      <i className="fa-regular fa-circle-user fa-xl"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="dorp-menue-item-div">
              <li>{user.username}</li>
            </div>
            <div className="dorp-menue-item-div">
              <li>{user.firstName} {user.lastName}</li>
            </div>
            <div className="dorp-menue-item-div">
              <li >{user.email}</li>
            </div>
              <hr></hr>
              <div className="dorp-menue-item-div">
              <li>
              <button onClick={logout}>Log Out</button>
              </li>
              </div>
          </>
        ) : (
          <>
          <div className="dorp-menue-item-div">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
          <div className="dorp-menue-item-div">
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
