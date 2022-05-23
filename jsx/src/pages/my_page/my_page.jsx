import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../../css/page.css';
const MyPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const password = JSON.parse(localStorage.getItem('password'));

    if (user === null) {
        alert('User is logged out');
        return <Navigate replace to='/login' />;
    }
    else if (user.username === 'moderator') {
        alert('You are the moderator');
        return <Navigate replace to='/mod_page' />;
    }

    const getCards = () => {
        fetch(`http://127.0.0.1:5000/reserve/${user.userId}`, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + window.btoa(user.username + ":" + password),
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
            .then(desk => {
                setCards(desk);
            }
            )
            .catch((error) => {
                console.error(error);
            });
    }

    const getAuds = () => {
        fetch(`http://127.0.0.1:5000/auditorium/all`, {
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
            .then(auds => {
                setAuds(auds);
            }
            )
            .catch((error) => {     
                console.error(error);
            });
    }

    const deleteCard = (reservation_id, index) => {
        if (reservation_id) {
            fetch(`http://127.0.0.1:5000/reserve/${reservation_id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Basic ' + window.btoa(user.username + ":" + password),
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
                .then((reservation) => {
                    cards.splice(index, 1);
                    setCards(cards);
                    window.location.reload();
                    console.log(`Reservation wirh id ${reservation_id} is deleted!`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };
    

    const LinkToEdit = (aud_id, aud_name, from, to, rsrv_id) => {
        var rsrv_data = {
            aud_id: aud_id,
            aud_name: aud_name ,
            from: from ,
            to: to,
            rsrv_id: rsrv_id,
        }
        localStorage.removeItem("aud");
        localStorage.setItem("aud", JSON.stringify(rsrv_data));
        window.open("/edit_rsrv", "_self")
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getCards();
        getAuds();
        deleteCard();
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cards, setCards] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [auds, setAuds] = useState([]);

    function logout() {
        localStorage.removeItem("password");
        localStorage.removeItem("user");
        window.open("/login", "_self");

    }

    return (
        <div className="background">
            <header>
                <img className="icon logo" src="/images/logo_hour.svg" alt="Logo" />
                <h2 className="heading">BookASpace</h2>
                <button className=" head-but" onClick={() => { window.open("/main", "_self") }}><img alt="booking" className="func" src="/images/book.svg" /></button>
                <button className=" head-but" onClick={() => { window.open("/my_page", "_self") }}><img alt="user" className="func" src="/images/user.svg" /></button>
                <div className="but">
                    <button id='click' onClick={() => { logout() }}>Logout</button>
                </div>
            </header>

            <main>
                <div className="presentation">
                    <h2 id="username" className="heading">
                        {user.username}
                    </h2>
                    <ul>
                        <li>Full name: <span id="full-name">{user.firstName} {user.lastName}</span></li>
                        <li>Email: <span id="email">{user.email}</span></li>
                        <li>Tel: <span id="phone">{user.phone}</span></li>
                    </ul>
                    <div id="but-group">
                        <button id="click" className=" on-page" onClick={() => { window.open("/main", "_self") }}>Reserve auditorium</button>
                        <button id="click" className=" on-page" onClick={() => { window.open("/edit_page", "_self") }}>Edit profile</button>
                        </div>
                </div>
                <div className="desk">
                    <h2 className="heading">
                        My reservations
                    </h2>
                    <div className="container">
                        {cards ? (<>
                            {cards.slice(0, cards.length)
                                .map((reservation, index) => {
                                    return(                              
                                        <div className = "card" key = { index } >
                                            <div className="top">
                                                <div className="circle"></div>
                                                <button className="action" onClick={() => { deleteCard(reservation.reserveId, index)}}><img alt="delete" src="/images/delete-but.svg" /></button>
                                            </div>
                                            {auds.slice(0, auds.length).map((aud, index2) =>
                                            {
                                                if (aud.audienceId === reservation.audienceId) {
                                                    return (
                                                        < div key={index2}>
                                                            <h3> Aud: {aud.name}</h3>
                                                            <h4> from: {reservation.begin}</h4>
                                                            <h4>to: {reservation.end}</h4>
                                                            <button key={index2} className=" action" onClick={() => { LinkToEdit(aud.audienceId, aud.name, reservation.begin, reservation.end, reservation.reserveId)}}>
                                                                <img alt="edit" src="/images/edit-but.svg" />
                                                            </button>
                                                        </div>)
                                                }
                                            })}
                                        </div>
                                    )})}</>) : (<></>)}
                    </div>
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

        </div >
    )
}

export default MyPage