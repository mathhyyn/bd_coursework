//import * as client from "../client.js";

//console.log(client.getID());

let message = document.getElementById("error_placeholder");

function redirect(str) {
    fetch('http://localhost:3000/redirect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page: str })
    })
        .then((res) => { });
}

document.getElementById('signin_button').onclick = () => {
    fetch('http://localhost:3000/user_sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_login: document.getElementById("login_input").value,
            user_email: document.getElementById("email_input").value,
            user_password: document.getElementById("password_input").value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.name == 'error') {
                message.style.color = 'red';
                message.textContent = data.detail;
            } else {
                // client.updateID(5);
                sessionStorage.setItem('user_id', data.login);
                message.style.color = 'green';
                message.textContent = data.message;
                window.location.href = '/profile';
                //redirect('profile');
                //window.location.href = '../profile/profile.html';
            }
        })
        .catch(error => {
            console.log('err: ', error);
        })

}