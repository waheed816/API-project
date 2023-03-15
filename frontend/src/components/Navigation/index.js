// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);


  return (
    <div className='nav-bar'>
      <div className='nav-bar-contents'>
        <div className='nav-bar-left'>
          <NavLink exact to="/">
            <i className="logo-left fa-solid fa-brands fa-airbnb"></i>
            <i className="fa-solid logo-text"><h2>CLONE-CNC</h2></i>
            <i className="logo-right fa-solid fa-brands fa-airbnb"></i>
          </NavLink>
        </div>
        {isLoaded && (
          <div className='profile-button'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  );
}


export default Navigation;
