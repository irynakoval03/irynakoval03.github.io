const form = document.getElementById('login-form');
if (form) {
	form.addEventListener('submit', (e) => {
        e.preventDefault();
		let username = document.getElementById('username').value;
		let password = document.getElementById('password').value;
		// eslint-disable-next-line no-undef
		let url = 'http://127.0.0.1:5000/user/' + username;
		fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + window.btoa(username + ':' + password),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.code) {
					throw new Error(data.description);
				}
				localStorage.setItem('password', JSON.stringify(password));
				localStorage.setItem('user', JSON.stringify(data));
				console.log(data);
				if (data.username === 'moderator') {
					window.open('moderator_page.html', '_self');
				} else {
					window.open('my_page.html', '_self');
				}
			})
			.catch((error) => {
				alert(error.description);
				console.error(error);
			});
	});
}

// eslint-disable-next-line no-unused-vars
function signup() {
	location.href = 'signup.html';
}

// eslint-disable-next-line no-unused-vars
function login() {
	location.href = 'login.html';
}
