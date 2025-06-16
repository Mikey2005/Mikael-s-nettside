const startBtn = document.getElementById('start');
const progressBar = document.getElementById('progress-bar');
const logBox = document.getElementById('log');

startBtn.addEventListener('click', async () => {
    const speed = parseFloat(document.getElementById('speed').value);
    const passengers = parseInt(document.getElementById('passengers').value);
    const distance = parseFloat(document.getElementById('destination').value);

    const response = await fetch('/api/lightspeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed_percent: speed, passengers, distance })
    });
    const data = await response.json();

    logBox.textContent = '';
    data.log.forEach(entry => log(entry));

    const totalTime = data.total_time_seconds * 1000; // ms
    const stepTime = totalTime / 100;
    let progress = 0;
    const slowdownPoint = 80; // start cooling at 80%

    const interval = setInterval(() => {
        progress++;
        progressBar.style.width = progress + '%';
        if (progress === slowdownPoint) {
            log('Raketten kjøler ned raketter, farten halveres.');
        }
        if (progress >= 100) {
            clearInterval(interval);
            log('Destinasjon nådd.');
        }
    }, stepTime);
});

function log(message) {
    logBox.textContent += message + '\n';
    logBox.scrollTop = logBox.scrollHeight;
}
