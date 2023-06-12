let message = document.getElementById("error_placeholder");

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
                message.style.color = 'green';
                message.textContent = data.message;
            }
        })
        .catch(error => {
            console.log('err: ', error);
        })

}