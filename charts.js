let key = 'aggregated energy';
var i = 0;
let predictions;

async function fetchData() {
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;
    console.log(startDate, endDate)
    const url = `http://127.0.0.1:5000/get_data?start=${startDate}&end=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getPredictions(data) {
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const predictions = await response.json();
        return predictions;
    }
    catch (error) {
        console.log('Error:', error);
    }
}


function handleSelection() {
    const selectedItem = document.getElementById('appliance-select');
    const selectedKey = selectedItem.value;
    console.log('key from id=', selectedKey)
    lineChart(predictions, selectedKey);
}

async function initChart() {
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;
    diff = Math.abs(new Date(endDate) - new Date(startDate)) / 86400000;
    try {
        // Fetch data from the backend
        const data = await fetchData();
        // Assuming data is just an array of numbers
        const actualData = data[1]; // Use the entire data array as actual data
        // Get predictions
        predictions = await getPredictions(data[1]);
        const result = predictions.map(obj => {
            const key = Object.keys(obj)[0]; // Get the key of the object
            const values = obj[key]; // Get the values array
            const sum = values.reduce((acc, value) => acc + value, 0); // Calculate the sum of values
            return { [key]: sum }; // Return a new object with the key and sum
        });

        const keys = result.map(obj => Object.keys(obj)[0]); // Array of keys
        const values = result.map(obj => Object.values(obj)[0]); // Array of sums
        predictions.unshift({ 'timestamp': data[0] });
        predictions.unshift({ 'aggregated energy': data[1] });

        console.log('predictions', predictions)
        lineChart(predictions, key)
        doughnutChart(keys, values);
        barChart(keys, values);
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
    document.getElementById('appliance-select').value = 'aggregated energy';
}

function groupTimestampsByDay(timestamps) {
    const groupedByDay = {};

    timestamps.forEach(timestamp => {
        const date = new Date(timestamp);
        const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // Format: YYYY-MM-DD

        if (!groupedByDay[day]) {
            groupedByDay[day] = [];
        }

        groupedByDay[day].push(timestamp);
    });

    return groupedByDay;
}

function lineChart(predictions, key) {
    console.log('prediction:::::', predictions)
    const time_data = predictions.find(item => item['timestamp']);
    const timestamp = time_data['timestamp'];
    const groupedByDay = groupTimestampsByDay(timestamp);
    const days = Object.keys(groupedByDay);

    // Flatten the grouped timestamps into a single array
    const allTimestamps = Object.values(groupedByDay).flat();

    // Use the flattened array as labels
    const labels = allTimestamps.map(timestamp => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false // Use 24-hour format; set to true for 12-hour format
        }); // Format the date and time as a string without seconds
    });
    console.log('labels:', labels.length)
    //for (let i = 0; i < 1; i++) {
    // Setup Chart.js
    const ctx = document.createElement('canvas').getContext('2d');
    // Set a fixed size for the canvas (optional)
    var width = 800 * diff;
    console.log('width =', width)
    console.log('diff =', diff)
    ctx.canvas.style.width = `${width}px`; // Adjust width as needed
    ctx.canvas.style.height = '500px'; // Adjust height as needed
    var container2 = document.getElementById('container');

    // Calculate the new width dynamically
    var newWidth = 800 * diff + 10; // Adjust calculation as needed

    // Set the style attribute directly
    container2.style.width = `${newWidth}px`;
    // Append the canvas to your desired container

    const data = predictions.find(item => item[key]);
    const values = data[key];
    console.log(`Creating line chart for ${key}:`, data);
    console.log('values:', values)
    const container = document.getElementById('chartContainer');

    container.innerHTML = ''; // Clear the container
    container.appendChild(ctx.canvas);


    const total = values.reduce((acc, val) => acc + val, 0);

    const maxYValue = Math.max(...values);
    const minYValue = Math.min(...values);
    const averageYValue = (total / values.length).toFixed(2);

    // Update HTML elements with the calculated values
    document.getElementById('maxValue').textContent = maxYValue;
    document.getElementById('averageValue').textContent = averageYValue;
    document.getElementById('minValue').textContent = minYValue;
    document.getElementById('title').textContent = key;

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: key,
                    data: values,
                    fill: false,
                    pointRadius: 1,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: false, // Disable responsiveness to use fixed size

            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: labels.length / 60,
                        stepSize: 20, // Adjust this value as needed
                        maxRotation: 30,
                        minRotation: 30
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: maxYValue,
                    title: {
                        display: true,
                        text: 'Power (W)'
                    }
                }
            }
        },
    });


}


function doughnutChart(keys, values) {

    const barColors = [
        "#0b735f",
        "#0A7983",
        "#49C9C5",
        "#65e6e1",
        "#95f8f1",
        "#1e1769"
    ];
    const ctx = document.createElement('canvas').getContext('2d');
    // Set a fixed size for the canvas (optional)
    ctx.canvas.style.width = '400px'; // Adjust width as needed
    ctx.canvas.style.height = '300px'; // Adjust height as needed
    // Append the canvas to your desired container
    const chartDiv = document.getElementById('chartDiv');
    chartDiv.innerHTML = '';
    chartDiv.appendChild(ctx.canvas);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: keys,
            datasets: [{
                backgroundColor: barColors,
                data: values
            }]
        },
        options: {
            responsive: false, // Disable responsiveness to use fixed size
            title: {
                display: true,
                text: "World Wide Wine Production 2018"
            }
        }
    });

}

async function barChart(keys, values) {
    const ctx = document.createElement('canvas').getContext('2d');
    // Set a fixed size for the canvas (optional)
    ctx.canvas.style.width = '400px'; // Adjust width as needed
    ctx.canvas.style.height = '400px'; // Adjust height as needed
    // Append the canvas to your desired container
    document.getElementById('chartDiv').appendChild(ctx.canvas);

    const total = values.reduce((acc, val) => acc + val, 0);

    console.log('total=', total);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: keys,
            datasets: [{
                label: 'energy',
                data: values,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: false,
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => {
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${percentage}%`;
                    },
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });

}

initChart();
document.getElementById('start').valueAsDate = new Date('2014-06-30');
document.getElementById('end').valueAsDate = new Date('2014-07-01');
