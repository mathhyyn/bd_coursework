let message = document.getElementById("error_placeholder");

document.getElementById('sign_button').onclick = () => {
    let password = document.getElementById("password_input").value;
    if (document.getElementById("repeat_password").value != password) {
        message.style.color = 'red';
        message.textContent = "Passwords don't match";
    } else {
        fetch('http://localhost:3000/user_sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_login: document.getElementById("login_input").value,
                user_password: password,
                user_name: document.getElementById("name_input").value,
                user_date: document.getElementById("date_input").value,
                user_email: document.getElementById("email_input").value,
                gender: document.getElementById("gender_input").value == "male" ? false : true
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

}