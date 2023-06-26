let message = document.getElementById("error_placeholder");

document.getElementById('save_button').onclick = () => {
    let d = document.getElementById("date_input").value;
    console.log(new Date(d), d, new Date(d).toLocaleDateString());

    fetch('http://localhost:3000/body_data', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: document.getElementById("body_data_input").value,
            date: new Date(document.getElementById("date_input").value)
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