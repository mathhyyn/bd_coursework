let message = document.getElementById("error_placeholder");

document.getElementById('add_parameter_button').onclick = () => {
    fetch('http://localhost:3000/parameters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            new_parameter: document.getElementById("parameter_input").value
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
                location.reload();
            }
        })
        .catch(error => {
            console.log('err: ', error);
        })
}

/*function getParameterPage(id) {
    fetch('http://localhost:3000/body_data_get?parameter_id='+id)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.name == 'error') {
                message.style.color = 'red';
                message.textContent = data.detail;
            } else {
                window.location.href = 'body_data';
            }
        })
        .catch(error => {
            console.log('err: ', error);
        })
}*/