import React from 'react';
import { useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import '../../css/edit-user.css';
const EditReservation = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const password = JSON.parse(localStorage.getItem('password'));
    const aud = JSON.parse(localStorage.getItem('aud'));

    if (user === null) {
        alert('User is logged out');
        return <Navigate replace to='/login' />;
    }
    else if (user.username === 'moderator') {
        alert('You are the moderator');
        return <Navigate replace to='/mod_page' />;
    }


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [aud_name, setAudName] = useState(aud.aud_name);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [from, setFromDate] = useState(aud.from);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [to, setToDate] = useState(aud.to);

    const onChangeAudName = (e) => {
        const aud_name = e.target.value;
        setAudName(aud_name);
    };

    const onChangeFromDate = (e) => {
        const from = e.target.value;
        setFromDate(from);
    };

    const onChangeToDate = (e) => {
        const to = e.target.value;
        setToDate(to);
    };

    const getAudId = () => {
        fetch(`http://127.0.0.1:5000/auditorium/findByName/${aud_name}`, {
            method: "GET",
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
            .then(aud => {
                setAudId(aud.audienceId);
            }
            )
            .catch((error) => {     
                console.error(error);
            });
    }
        // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getAudId();
    }, []);
        // eslint-disable-next-line react-hooks/rules-of-hooks
    const [aud_id, setAudId] = useState(aud.aud_id);

    const editReservation = (e) => {
        e.preventDefault();
        getAudId();
        if (aud_id) {
            fetch(`http://127.0.0.1:5000/reserve/${aud.rsrv_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    begin: from,
                    end: to,
                    userId: user.userId,
                    audienceId: aud_id
                }),
                headers: {
                    'Authorization': 'Basic ' + window.btoa(user.username + ":" + password),
                    "Content-Type": "application/json"
                },

            }).then((response) => response.json())
                .then((response) => {
                    if (response.code) {
                        // alert('Username or email is already exists');
                        throw new Error(
                            `${response.code} - ${response.description}`
                        )
                    }
                    return response;
                })
                .then((data) => {
                    localStorage.removeItem("aud");
                    window.open("/my_page", "_self");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
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
                    <form onSubmit={editReservation}>
                        <h3 className="heading">
                            Book an auditorium
                        </h3>
                        <div className="data">
                            <div className="field">
                                <label htmlFor="audname"> Aud name </label>
                                <input type="text" id="aud_name" value={aud_name} onChange={onChangeAudName} required placeholder="RI-364"/>
                            </div>
                            <div className="field">
                                <label htmlFor="from"> From </label>
                                <input type="datetime-local" id="from" value={from} onChange={onChangeFromDate} required/>
                            </div>
                            <div className="field">
                                <label htmlFor="to"> To </label>
                                <input type="datetime-local" id="to" value={to} onChange={onChangeToDate} required/>
                            </div>
                        </div>
                        <div id="but-group">
                            <button id='click' className=" on-page" type="submit"> Submit </button>
                        </div>
                    </form>
                </div>
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
        </div>
    )
}

export default EditReservation