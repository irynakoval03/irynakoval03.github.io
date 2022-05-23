import React from 'react';
import { useState} from 'react';
import { Navigate } from 'react-router-dom';
import '../../css/edit-user.css';
const EditPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const password = JSON.parse(localStorage.getItem('password'));

    // state = {}

    if (user === null) {
        alert('User is logged out');
        return <Navigate replace to='/login' />;
    }
    else if (user.username === 'moderator') {
        alert('You are the moderator');
        return <Navigate replace to='/mod_page' />;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [username, setUsername] = useState(user.username);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [firstName, setFirstName] = useState(user.firstName);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [lastName, setLastName] = useState(user.lastName);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [email, setEmail] = useState(user.email);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [phone, setPhone] = useState(user.phone);

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeFirstName = (e) => {
        const firstName = e.target.value;
        setFirstName(firstName);
    };

    const onChangeLastName = (e) => {
        const lastName = e.target.value;
        setLastName(lastName);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePhone = (e) => {
        const phone = e.target.value;
        setPhone(phone);
    };
    const editPage = (e) => {
        e.preventDefault();
        fetch(`http://127.0.0.1:5000/user/${user.username}`, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phone: phone
            }),
            headers: {
                'Authorization': 'Basic ' + window.btoa(user.username + ":" + password),
                "Content-Type": "application/json"
            },

        }).then((response) => response.json())
            .then((response) => {
                if (response.code) {
                    alert('Username or email is already exists');
                    throw new Error(
                        `${response.code} - ${response.description}`
                    )
                }
                return response;
                })
            .then((data) => {
                localStorage.setItem("user", JSON.stringify(data));
                window.open("/my_page", "_self");
            })
            .catch((error) => {
                console.error(error);
            });
    }
    function logout() {
        localStorage.removeItem("password");
        localStorage.removeItem("user");
        window.open("/login", "_self");

    }
    return (
        <div className="background">
            <header>
                <img className="icon logo" src="/images/logo_hour.svg" alt="Logo"/>
                <h2 className="heading">BookASpace</h2>
                <button className=" head-but" onClick={() => { window.open("/main", "_self")}}><img alt="booking" className="func" src="/images/book.svg"/></button>
                <button className=" head-but" onClick={() => {  window.open("/my_page", "_self")}}><img alt="user" className="func" src="/images/user.svg"/></button>
                <div className="but">
                    <button id='click' onClick={() => { logout() }}>Logout</button>
                </div>
            </header>

            <main>
                <div className="form">
                    <form onSubmit={editPage}>
                        <h3 className="heading">
                            Change account data
                        </h3>
                        <div className="data">
                            <div className="field">
                                <label htmlFor="username"> Username </label>
                                <input type="text" id="username" value={username} onChange={onChangeUsername} placeholder="JaneDoe"/>
                            </div>
                            <div className="field">
                                <label htmlFor="firstName"> First Name </label>
                                <input type="text" id="firstName" value={firstName} onChange={onChangeFirstName} placeholder="Jane"/>
                            </div>
                            <div className="field">
                                <label htmlFor="lastName"> Last Name </label>
                                <input type="text" id="lastName" value={lastName} onChange={onChangeLastName} placeholder="Doe"/>
                            </div>
                            <div className="field">
                                <label htmlFor="email"> Email </label>
                                <input type="email" id="email" value={email} onChange={onChangeEmail} placeholder="jane.doe@gmail.com"/>
                            </div>
                            <div className="field">
                                <label htmlFor="phone"> Phone number</label>
                                <input type="tel" id="phone" value={phone} onChange={onChangePhone} placeholder="+1 8674895445"/>
                            </div>
                        </div>
                        <div id="but-group">
                            <button id='click' className=" on-page" type="submit"> Submit </button>
                        </div>
                    </form></div>
            </main>
        <footer>
            <p className="note">
                ©2022 BookASpace. All rights reserved
            </p>
            <img alt="Line" src="/images/line.svg" />
            <div className="social-media">
                <img className="icon" alt="twitter" src="/images/twitter.svg" />
                <img className="icon" alt="facebook" src="/images/facebook.svg" />
                <img className="icon" alt="instagram" src="/images/instagram.svg" />
                <img className="icon" alt="linkedIn" src="/images/linkedin.svg" />
                <img className="icon" alt="youtube" src="/images/youtube.svg" />
            </div>
        </footer>
    </div>)
}

export default EditPage