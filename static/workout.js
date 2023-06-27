let message = document.getElementById("error_placeholder");

document.getElementById('add_complex_button').onclick = () => {
        fetch('http://localhost:3000/workout_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById("complex_input").value
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