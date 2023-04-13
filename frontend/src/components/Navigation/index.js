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
            <i className="fa-solid logo-text"><h1>VACAN-C?C</h1></i>
            <i className="logo-right fa-solid fa-brands fa-airbnb"></i>
          </NavLink>
        </div>
        <div className='nav-bar-right'>
          {sessionUser ? <NavLink to='/spot/createSpotForm' className='create-new-spot'>Create a New Spot</NavLink> : null}
          {isLoaded && (
            <div className='profile-button'>
              <ProfileButton user={sessionUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default Navigation;
