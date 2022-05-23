/* eslint-disable prettier/prettier */
const user = JSON.parse(localStorage.getItem('user'));
const username = user.username;
const password = JSON.parse(localStorage.getItem('password'));
// eslint-disable-next-line no-unused-vars
function logout() {
    localStorage.removeItem('user', 'password');
    location.href = 'login.html';
}

function add_card(aud) {
    let cards = document.getElementById('cards');
    let card = document.createElement('div');
    var edit = '<img alt="edit" src="../images/edit-but.svg" />';
    var del = document.createElement('button');
    var down = document.createElement('button');
    down.setAttribute('class', 'action');
    down.setAttribute('id', 'edit-btn');
    var top = document.createElement('div');
    top.className = 'top';
    var circle = '<div class="circle"></div>';
    top.innerHTML = circle;

    down.innerHTML = edit;

    del.setAttribute(`class`, `action`);
    del.setAttribute('id', 'delete-btn');
    del.innerHTML = '<img alt="delete" src="../images/delete-but.svg" />';
    top.appendChild(del);

    card.className = 'card';
    card.setAttribute('id', aud.audienceId);
    var content = document.createElement('h3');
    content.appendChild(top);
    content.appendChild(document.createTextNode(`Aud: ${aud.name}`));
    content.appendChild(down);
    card.appendChild(content);
    cards.appendChild(card);
    if_delete_card(card, del);
    return card, del, edit;
}

function if_delete_card(card, del) {
    if (del) {
        del.addEventListener('click', (e) => {
            e.preventDefault();
            let url = 'http://127.0.0.1:5000/auditorium/' + card.id;
            fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Basic ' + window.btoa(username + ':' + password),
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((aud) => {
                    if (aud.code) {
                        throw new Error(aud.description);
                    }
                    card.remove();
                    // window.location.reload();
                    console.log(`Aud: ${aud.name} is deleted!`);
                })
                .catch((error) => {
                    console.error(error);
                // eslint-disable-next-line prettier/prettier
                });
        });
    }
}

function if_add_new_card() {
    const application = document.getElementById('add-btn');
    if (application) {
        application.addEventListener('click', (e) => {
            e.preventDefault();
            var audName = document.getElementById('audName').value;
            fetch('http://127.0.0.1:5000/auditorium', {
                method: 'POST',
                body: JSON.stringify({
                    name: audName,
                }),
                headers: {
                    Authorization: 'Basic ' + window.btoa(username + ':' + password),
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((aud) => {
                    console.log(aud);
                    if (aud.code) {
                        throw new Error(aud.description);
                    }
                    // eslint-disable-next-line no-unused-vars
                    // var card,
                    //     del,
                    //     edit = add_card(aud);
                    window.location.reload();
                    console.log(`Aud: ${aud.name} is created!`);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }
}

function card_to_post_new_aud() {
    var last = document.createElement('div');
    last.className = 'card';
    last.id = 'new';
    last.innerHTML =
		'<div class="top"><div class="circle"></div><button id="add-btn" type="submit" class="action"><img alt="add" src="../images/add-but.svg"/></button></div><div class="field"><input type="text" id="audName" required placeholder="AR-432"></div>';
    document.getElementById('cards').appendChild(last);
    if_add_new_card();
}

function create_cards(data) {
    data.forEach((aud) => {
        add_card(aud);
    });
    card_to_post_new_aud();
}

if (username == 'moderator') {
    document.getElementById('username').innerHTML = user.username;
    document.getElementById('full-name').innerHTML =
		user.firstName + ' ' + user.lastName;
    document.getElementById('phone').innerHTML = user.phone;
    document.getElementById('email').innerHTML = user.email;

    fetch('http://127.0.0.1:5000/auditorium/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.code) {
                throw new Error(data.description);
            }
            create_cards(data);
        })
        .catch((error) => {
            alert(error.description);
            console.error(error);
        });
} else {
    alert('User is not moderator');
    location.href = 'my_page.html';
}

// if (edit) {
//     edit.addEventListener("click", (e) => {
//         e.preventDefault();
//         let url = "http://127.0.0.1:5000/auditorium/" + card.id;
//         fetch(url, {
//             method: "PUT",
//             headers: { 'Authorization': 'Basic ' + window.btoa(username + ":" + password) },
//         })
//             .then((response) => response.json())
//             .then(data => {
//                 if (data.code) {
//                     throw new Error(data.description);
//                 }
//                 console.log("Aud: " + data.name + " was changed!");
//                 console.log("New Aud: " + data.name + " is!");

//             });
//         // location.href = "signup.html";
//     })
// }

// // eslint-disable-next-line no-unused-vars
// function edit_aud(id) {
//     localStorage.removeItem("user", "password");
//     location.href = "login.html";
// }

// document.getElementById("edit-btn").addEventListener("click", (e) => {
//     e.preventDefault();
//     location.href = "login.html";
// });
// eslint-disable-next-line no-inner-declarations
// eslint-disable-next-line no-unused-vars
