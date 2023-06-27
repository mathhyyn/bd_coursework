// import Chart from '../node_modules/chart.js';
// import 'chartjs-adapter-date-fns';

let message = document.getElementById("error_placeholder");

document.getElementById('add_body_data_button').onclick = () => {
    fetch('http://localhost:3000/body_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            new_body_data: document.getElementById("body_data_input").value
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

let canvas = document.getElementById('chart');

document.getElementById('show_chart').onclick = () => {
    let data = [];
    fetch('http://localhost:3000/body_data_cashe').then(response => response.json()).then(res => {
        // console.log(data);
        canvas.style.display = 'block';
        for (let d of res.data_list.reverse()) {
            data.push({ x: d.created_at1, y: d.value1 });
        }
        let chart = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: [{
                    label: res.parameter_name,
                    data: data,
                    fill: 'start',
                    borderColor: 'rgb(145, 161, 140)',
                    borderWidth: 2,
                    radius: 5,
                    hoverRadius: 7,
                    hoverBorderWidth: 2
                }],
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'week'
                        },
                        offset: true
                    },
                    y: {
                        min: 0,
                        offset: true
                    }
                }
            }
        });
    }).catch(error => {
        console.log('err: ', error);
    });
}