import React from 'react';
import { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
import '../../css/main.css';

const URL = 'ws://127.0.0.1:8080';
    
const Main = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const password = JSON.parse(localStorage.getItem('password'));
    const [begin, setBegin] = useState({});
    const [end, setEnd] = useState({});
    const [aud_name, setAudName] = useState('');
    const [auditorium, setAud] = useState({})
    const [auditoriums, setAuds] = useState([]);
    const [aud_id, setAudId] = useState('');
    const[st,setSt] = useState('available')
    const [ws, setWs] = useState(new WebSocket(URL));

    const onChangeAudName = (e) => {
        const name = e.target.value;  
        setAudName(name);
    };
    const onChangeBegin = (e) => {
        const begin = e.target.value;
        setBegin(begin);
    };
    const onChangeEnd = (e) => {
        const end = e.target.value;
        setEnd(end);
    };

    const getAudId = () => {
        if (aud_name!=='') {
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
                .then((aud) => {
                    console.log(`Chosen auditorium name: ${aud_name} - id: ${aud.audienceId}`);
                    setAudId(aud.audienceId)
                    setAud(aud)
                })
                .catch((error) => {
                    console.error(error);
                    // return null;
                });
        }
    }

    const getByStatus = (status) => {
        if (!status) { status = 'available' }
        setSt(status)
        console.log(`const -${st}, var - ${status}`)
        fetch(`http://127.0.0.1:5000/auditorium/findByStatus/${st}`, {
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
                    console.log(`${st} :`, auds);
                }
                )
                .catch((error) => {
                    console.error(error);
                });
    }
    
    useEffect(() => {
            getAudId();
            getByStatus();
    }, []);

    useEffect(() => {
        ws.onopen = () => {
            console.log('WebSocket Connected');
        }

        ws.onmessage = (e) => {
            console.log(`Operate with ${auditorium.name}`);
            getByStatus(st);        
        }

        return () => {
            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setWs(new WebSocket(URL));
            }
        }
    }, [ws.onmessage, ws.onopen, ws.onclose, auditoriums]);
    
    const handleSubmit = (e) => {
        // e.preventDefault();
        getAudId();
        if (aud_id)
        {
            if ((user !== null)&&(user.username!=='moderator')){
                fetch(`http://127.0.0.1:5000/reserve`, {
                    method: "POST",
                    body: JSON.stringify({
                        begin: begin,
                        end: end,
                        userId: user.userId,
                        audienceId: aud_id,
                    }),
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
                    .then((data) => {
                        ws.send(auditorium);
                        getByStatus(st);
                        console.log(`Auditorium ${aud_name}(id : ${data.audienceId}) has just booked!`);
                        alert('Successfully booking!')
                        window.open("/my_page", "_self");
                    }
                    )
                    .catch((error) => {
                        alert(error);
                        console.error(error);
                    })
            }
            else { 
                alert('It is required to be logged in as an user to reserve the auditorium!')
            }
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
                    <img className="icon logo" src="/images/logo_hour.svg" alt="Logo" />
                    <h1 className="heading">BookASpace</h1>
                    { user!==null ?(
                        <><button className="button head-but" onClick={() => { window.open("/main", "_self"); }}><img alt="booking" className="func" src="/images/book.svg" /></button><button className="button head-but" onClick={() => { window.open("/my_page", "_self"); } }><img alt="user" className="func" src="/images/user.svg" /></button><div className="but">
                            <button className="button" id='click' onClick={() => { logout(); } }>Logout</button>
                        </div></>):(<div className="but-group">
                    <button  id="click" href='/login' onClick={() => { window.location.href = '/login' }}>Login</button>
                    <button id="click" href='/signup' onClick={() => { window.location.href = '/signup' }}>Signup</button>
            </div>)}
                </header>

                <main>
                    <div className="main">
                        <h1 className="message">Here you can reserve an auditorium for your audience!</h1>
                        <h4 className="limit">*it is allowed to book for time f<div className="out">rom 1 hour to 5 day</div>s</h4>
                        <div className="line">
                            <div className="form">
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    handleSubmit();
                                    setAud('');
                                }}>
                                    <h3 className="heading">
                                        Book an auditorium
                                    </h3>
                                    <div className="data">
                                        <div className="field">
                                            <label htmlFor="aud_name"> Aud name </label>
                                            <input type="text" id="aud_name" onChange={onChangeAudName} defaultChecked={true} required placeholder="RI-364" />

                                        </div>
                                        <div className="field">
                                            <label htmlFor="begin"> From </label>
                                            <input type="datetime-local" id="begin" onChange={onChangeBegin} defaultChecked={true} required />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="end"> To </label>
                                            <input type="datetime-local" id="end" onChange={onChangeEnd} defaultChecked={true} required />
                                        </div>
                                    </div>
                                    <button id='click' className="button on-page" type="submit"> Book </button>
                                    { (user === null)? (
                                        <div className="note">Aren&#39;t you logged in? <a href="/login">Log in</a></div>):(<></>)
                                    }
                                    </form>
                            </div>
                            <div id='main' className="container">
                                <div className="warpper">
                                    <div className="status">
                                        <h2>
                                            <div className="situation">You can follow current auditoriums status</div>
                                            <div className="tabs">
                                                <div className="tip available" defaultChecked={true} onClick={() => {getByStatus('available')}} >
                                                    <div className="label tab" id="available-tab" htmlFor="one"><h2 className="bookmark"><a>F<span className="hide"><br />r<br />e<br />e</span></a></h2></div>
                                                </div>
                                                <span className="or">or</span>
                                                <div className="tip taken" onClick={() => {getByStatus('taken')}}>
                                                    <div className="label tab" id="taken-tab" htmlFor="two"><h2 className="bookmark"><a>T<span className="hide"><br />a<br />k<br />e<br />n</span></a></h2></div>
                                                </div>
                                            </div>
                                        </h2>
                                    </div>
                                    <div className="panels">
                                        <div className="cards">
                                            { auditoriums ? (
                                                <>
                                                    {auditoriums.map((aud, index) => {
                                                    return (
                                                        <div className="card" key={index}>
                                                            <div className="top">
                                                                <div className="circle"></div>
                                                            </div>
                                                            <h3>Aud: {aud.name}</h3></div>);
                                                })} </>) : (<></>)}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
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
            </div>
        )
    }
    
export default Main
