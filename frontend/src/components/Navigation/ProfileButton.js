// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'

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
    <div className="profile-button-container">

      <button onClick={openMenu} className="profile-button">
        <i className="fas fa-user-circle" id='profile-button-id'/>
        {showMenu === false && <i className="fa-solid fa-bars"></i>}
      </button>

      <div className={ulClassName} ref={ulRef}>
        {user ? (

          <div className="profile-container">
            <div className="username-container">
              <div>USERNAME:</div>
              <div>{user.username}</div>
            </div>

            <div className="name-container">
              <div>NAME:</div>
              <div>{user.firstName} {user.lastName}</div>
            </div>

            <div className="email-container">
              <div>EMAIL:</div>
              <div>{user.email}</div>
            </div>


            <p>
              <button className="logout-button" onClick={logout}>LOGOUT</button>
            </p>
          </div>

        ) : (
          <>
            <button className="login-button">
              <OpenModalMenuItem
                className="login"
                itemText="LOGIN"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </button>
            <button className="signup-button">
              <OpenModalMenuItem
                itemText="SIGN UP"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}


export default ProfileButton;
