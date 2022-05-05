const form = document.getElementById('signup-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById("username").value;
        let firstName = document.getElementById("firstname").value;
        let lastName = document.getElementById("lastname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let phone = document.getElementById("phone").value;

        fetch('http://127.0.0.1:5000/user', {
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
            .then(data => {
                if (data.code) {
                    throw new Error(data.description);
                }
                localStorage.setItem("user", JSON.stringify(data));
                console.log(data);
                window.open("login.html", "_self");
                //     console.log(data.description)
                //     // alert("Uncorrect")   
            }
            )
            .catch((error) => {
                alert(error.description);
                console.error(error);
            });
    })
} 


// eslint-disable-next-line no-unused-vars
function signup() {
    location.href = "signup.html";
}

// eslint-disable-next-line no-unused-vars
function login() {
    location.href = "login.html";
}