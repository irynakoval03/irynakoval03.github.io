import React from 'react';
import '../../css/login-signup.css';
const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        fetch(`http://127.0.0.1:5000/user/${username}`, {
            method: "GET",
            headers: { 'Authorization': 'Basic ' + window.btoa(username + ":" + password) }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.code) {
                    throw new Error(
                        `${response.code} - ${response.description}`
                    );
                }
                return response;
            })
            .then((data) => {
                localStorage.setItem("password", JSON.stringify(password));
                localStorage.setItem("user", JSON.stringify(data));
                console.log(data);
                if (data.username === 'moderator') { window.open("/mod_page", "_self"); }
                else { window.open("/my_page", "_self"); }
            }
            )
            .catch((error) => {
                alert(error.description)
                console.error(error);
            });

    }
    return (
        <div className="background">
            <header>
            <img className="icon logo" src="/images/logo_hour.svg" alt="Logo"/>
            <h1 className="heading" >BookASpace</h1>
            <div className="but-group">
                    <button  id="click" href='/login' onClick={() => { window.location.href = '/login' }}>Login</button>
                    <button id="click" href='/signup' onClick={() => { window.location.href = '/signup' }}>Signup</button>
            </div>
            </header>

    <main >
        <div className="form">
        <form id="login-form" onSubmit={handleSubmit}>
                <h3 className="heading" >
                    Enter into an account
                </h3>
                <div className="data">
                <div className="field">
                <label htmlFor="username"> Username </label>
                <input type="text" id="username" required placeholder="JaneDoe"/>
                </div>
                <div className="field">
                <label htmlFor="password"> Password </label>
                <input type="password" id="password" required placeholder="1111"/>
                </div>
                </div>
                <button id="click" type="submit">Log in</button>
                <div className="note">
                    Don&#39;t you have an account? <a href="signup.html">Sign up</a>
                </div>
            </form>
            </div>
    </main>
    <footer>
        <p className="note">
            ©2022 BookASpace. All rights reserved
        </p>
        <img alt="Line" src="/images/line.svg"/>
        <div className="social-media">
            <img className="icon" alt="twitter" src="/images/twitter.svg"/>
            <img className="icon" alt="facebook" src="/images/facebook.svg"/>
            <img className="icon" alt="instagram" src="/images/instagram.svg"/>
            <img className="icon" alt="linkedIn" src="/images/linkedin.svg"/>
            <img className="icon" alt="youtube" src="/images/youtube.svg"/>
        </div>
    </footer>
    </div>
    )
}

export default Login