let message = document.getElementById("error_placeholder");

document.getElementById('add_body_data_button').onclick = () => {
    fetch('http://localhost:3000/body_data_add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parameter_id: 8, // ХАРДКОД исправить
            new_body_data: document.getElementById("body_data_input").value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.name == 'error') {
                message.style.color = 'red';
                message.textContent = data.detail;
            } else {
                location.reload();
                message.style.color = 'green';
                message.textContent = data.message;
            }
        })
        .catch(error => {
            console.log('err: ', error);
        })
}