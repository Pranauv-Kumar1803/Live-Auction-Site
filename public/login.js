/*eslint-disable*/

const signup_form = document.getElementById("signup-form");

signup_form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const name = signup_form.querySelector("#name").value;
	const email = signup_form.querySelector("#email").value;
	const password = signup_form.querySelector("#password").value;
	const confirmpassword = signup_form.querySelector("#confirmpassword").value;

	if (name === "") {
		alert("Name is required");
		return;
	}

	if (!isValidEmail(email)) {
		alert("Invalid email address");
		return;
	}

	if (password.length < 7) {
		alert("Password must be at least 7 characters long.");
		return;
	}

	if (!isValidPassword(password)) {
		alert(
			"password should contain atleast one digit one special character ,one uppercase letter"
		);
		return;
	}

	if(confirmpassword !== password)
	{
		alert('passwords not matching!');
		return;
	}

	obj = { username: name, email: email, password: password };
	const res = await fetch('http://localhost:5500/auth/signup', {
		method: 'post',
		body: JSON.stringify(obj),
		headers: {
			"Content-Type": 'application/json'
		}
	});

	if (!res.ok) {
		alert('invalid input/server error');
		signup_form.reset();
	}
	else {
		alert('Sign up successful');
		window.location.href = '/auth/login'
	}
});

const signin_form = document.getElementById("signin-form");

signin_form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = signin_form.querySelector("#email").value;
	const password = signin_form.querySelector("#password").value;

	if (!isValidEmail(email)) {
		alert("Invalid email address.");
		return;
	}

	if (password === "") {
		alert("Password is required.");
		return;
	}

	obj = { email: email, password: password };
	const res = await fetch('http://localhost:5500/auth/login', {
		method: 'post',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		alert("User Not Found / Server Error");
		signin_form.reset();
	} else {
		alert("login successful");
		window.location.href = "/item";
	}
});

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidPassword(password) {
	const passWordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<,>.?/])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;"'<,>.?/]{7,}$/;
	return passWordRegex.test(password);
}
