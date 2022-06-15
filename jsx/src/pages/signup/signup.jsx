import React from 'react';
import '../../css/login-signup.css';
const Signup = () => { 
    const handleSubmit = (e) => { 
         e.preventDefault();
        let username = document.getElementById("username").value;
        let firstName = document.getElementById("firstname").value;
        let lastName = document.getElementById("lastname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let phone = document.getElementById("phone").value;

        fetch(`http://127.0.0.1:5000/user`, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phone: phone,
            }),
            headers: {
                "Content-Type": "application/json",
            },
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
                localStorage.setItem("user", JSON.stringify(data));
                console.log(data);
                window.open("/login", "_self");  
            }
            )
            .catch((error) => {
                alert(error.description);
                console.error(error);
            });

    }
    return (
        <div className="mbackground">
            <header>
                <img className="icon logo" src='/images/logo_hour.svg' alt="Logo"/>
                <h1 className="heading">BookASpace</h1>
                <div className="but-group">
                    <button  id='click' href='/login' onClick={() => { window.location.href = '/login' }}>Login</button>
                    <button  id='click' href='/signup' onClick={() => { window.location.href = '/signup' }}>Signup</button>
                </div>
            </header>
        
            <main>
                <div className="form">
                    <form id="signup-form" onSubmit={handleSubmit}>
                        <h3 className='heading'>
                            Create an account
                        </h3>
                        <div className="data">
                            <div className="field">
                                <label htmlFor="username"> Username </label>
                                <input type="text" id="username" required placeholder="JaneDoe"/>
                            </div>
                            <div className="field">
                                <label htmlFor="firstname"> First Name </label>
                                <input type="text" id="firstname" required placeholder="Jane"/>
                            </div>
                            <div className="field">
                                <label htmlFor="lastname"> Last Name </label>
                                <input type="text" id="lastname" required placeholder="Doe"/>
                            </div>
                            <div className="field">
                                <label htmlFor="email"> Email </label>
                                <input type="email" id="email" required placeholder="jane.doe@gmail.com"/>
                            </div>
                            <div className="field">
                                <label htmlFor="phone"> Phone number</label>
                                <input type="tel" id="phone" required placeholder="+1 8674895445"/>
                            </div>
                            <div className="field">
                                <label htmlFor="password"> Password </label>
                                <input type="password" id="password" required placeholder="1111"/>
                            </div>
                        </div>
                        <button type="submit">Sign up</button>
                        <div className="note">
                            Do you have already an account? <a href="/login">Log in</a>
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

export default Signup;