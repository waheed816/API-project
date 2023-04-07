// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [emptyField, setEmptyField] = useState('true');

  const { closeModal } = useModal();

  useEffect(() => {

    if(password.length < 6 || credential.length < 4){

      setEmptyField(true);

    }else setEmptyField(false);

  }, [credential, password])


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const demoUserLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
  }

  return (
      <div className="login-form-container">
        <i className="login-logo-left fa-solid fa-brands fa-airbnb"></i>
        <i className="fa-solid login-logo-text"><h2>LOGIN</h2></i>
        <i className="login-logo-right fa-solid fa-brands fa-airbnb"></i>
        {/* <h1 className="login-title">Log In</h1> */}
        <form onSubmit={handleSubmit}>
          <div className={errors.loginError ? "login-error-message" : "no-class-name"}>
            {errors.loginError}
          </div>
          <div className="login-input">
            <label>
              Username or Email
             </label>
             <div>
              <input
                className="input-box"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
              <div className="login-errors">{errors.username}</div>
             </div>
          </div>
          <div className="login-input">
            <label>
              Password
            </label>
            <div>
              <input
                className="input-box"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="login-errors">{errors.password}</div>
            </div>
          </div>
          <div className="login-button-container">
            <button
              type="submit"
              className={emptyField ? "login-disabled" : "login-submit-button"}
              disabled={Boolean(emptyField)}
            >
              LOGIN
            </button>
          <div className="demo-button-container">
            <Link to='/' onClick={demoUserLogin} className='demo-user-login'>DEMO USER LOGIN</Link>
          </div>
          </div>
        </form>
      </div>

  );
}

export default LoginFormModal;
