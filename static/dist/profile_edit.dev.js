"use strict";

var message = document.getElementById("error_placeholder");

document.getElementById('save_profile_button').onclick = function () {
  var password = document.getElementById("password_input").value;

  if (document.getElementById("repeat_password").value != password) {
    message.style.color = 'red';
    message.textContent = "Passwords don't match";
  } else {
    fetch('http://localhost:3000/uprofile', {
      method: 'PUT',
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
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.name == 'error') {
        message.style.color = 'red';
        message.textContent = data.detail;
      } else {
        message.style.color = 'green';
        message.textContent = data.message;
        window.location.href = 'uprofile';
      }
    })["catch"](function (error) {
      console.log('err: ', error);
    });
  }
};