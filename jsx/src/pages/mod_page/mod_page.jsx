import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../../css/page.css';
const ModPage = () => { 
    const user = JSON.parse(localStorage.getItem('user'));
    const password = JSON.parse(localStorage.getItem('password'));

    if ((user === null) || (user.username !== 'moderator')) {
        alert('Moderator is logged out');
		return <Navigate replace to='/login' />;
	}
    const getCards = () => {
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
            .then(desk => {
                setCards(desk);
            }
            )
            .catch((error) => {     
                console.error(error);
            });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getCards();
        deleteCard();
    }, []);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cards, setCards] = useState([]);  
    

    const deleteCard = (aud_id, index) => {
        if (aud_id) {
            fetch(`http://127.0.0.1:5000/auditorium/${aud_id}`, {
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
                .then((aud) => {
                    cards.splice(index, 1);
                    setCards(cards);
                    window.location.reload();
                    console.log(`Aud: ${aud.name} is deleted!`);
                })                
                .catch ((error) => {
                    console.error(error);
            });
        }
    }


    const addNewCard = ()=>  {
            let audName = document.getElementById("audName").value;
            fetch("http://127.0.0.1:5000/auditorium", {
                method: "POST",
                body: JSON.stringify({
                    name: audName,
                }),
                headers: {
                    'Authorization': 'Basic ' + window.btoa(user.username + ":" + password),
                    "Content-Type": "application/json",
                }
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
                .then(card => {
                    window.location.reload();
                    console.log(`Aud: ${card.name} is created!`);
                }
                )
                .catch((error) => {
                    console.error(error);
                });
    }
    
    function logout() {
        // window.location.reload();
        localStorage.removeItem("password");
        localStorage.removeItem("user");
        window.open("/login", "_self");

    }

    return (
        <div className="background">
            <header>
                <img className="icon logo" src="/images/logo_hour.svg" alt="Logo"/>
                <h2 className="heading">BookASpace</h2>
                <button className=" head-but" onClick={() => { window.open("/main", "_self") }}><img alt="booking" className="func" src="/images/book.svg" /></button>
                <button className=" head-but" onClick={() => { window.open("/mod_page", "_self") }}><img alt="user" className="func" src="/images/user.svg" /></button>
                <div className="but">
                    <button  id='click' onClick={() => { logout()}}>Logout</button>
                </div>
            </header>

    <main>
        <div className="presentation">
            <h2 id="username" className="heading">
                { user.username} 
            </h2>
            <ul>
                <li>Full name: <span id="full-name">{user.firstName} { user.lastName}</span></li>
                <li>Email: <span id="email">{ user.email}</span></li>
                <li>Tel: <span id="phone">{ user.phone}</span></li>
            </ul>
        </div>
        <div className="desk">
            <h2 className="heading">
                All Auditorium
            </h2>
            <div id="cards" className="container">
                        {cards ? (<>
                                { cards.map((aud, index) => {
                                    return (
                                        <div className="card" key={index}>
                                            <div className="top">
                                                <div className="circle"></div>
                                                <button className="action" onClick={() =>{ deleteCard(aud.audienceId, index) }} ><img alt="delete" src="/images/delete-but.svg" /></button>
                                            </div>
                                            <h3>Aud: {aud.name}</h3>
                                        </div>);
                                })}</>) : (
                            <></>)
                        }
                        <div className="card">
                                <div className="top">
                                    <div className="circle"></div>
                                <button className="action" onClick={() => { addNewCard() }} ><img alt="add" src="/images/add-but.svg"/></button>
                                </div>
                                <div className="new-aud">
                                    <label htmlFor='audName'>
                                        <h3>Aud name</h3>   
                                    </label>
                                    <input type="text" id="audName" required placeholder="AR-432"/>
                                </div>
                        </div>
            </div>
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

export default ModPage