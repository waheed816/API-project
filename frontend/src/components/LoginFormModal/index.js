// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [emptyField, setEmptyField] = useState('true');

  const { closeModal } = useModal();

  useEffect(() => {

    if(password.length === 0 || credential.length === 0){

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

  return (

      <div className="login-form-container">
        <i className="login-logo-left fa-solid fa-brands fa-airbnb"></i>
        <i className="fa-solid login-logo-text"><h2>AIRXYZ</h2></i>
        <i className="login-logo-right fa-solid fa-brands fa-airbnb"></i>
        <h1 className="login-title">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-error">
            {errors.map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
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
          </div>
        </form>
      </div>

  );
}

export default LoginFormModal;
