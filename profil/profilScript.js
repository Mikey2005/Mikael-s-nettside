async function loadProfile() {
    try {
        const res = await fetch('/api/profile');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('profileName').innerText = data.first_name + ' ' + data.last_name;
            document.getElementById('job').value = data.job || '';
            document.getElementById('education').value = data.education || '';
            document.getElementById('profileInfo').innerHTML = `
                <p><strong>Address:</strong> ${data.address || ''}</p>
                <p><strong>Job:</strong> ${data.job || ''}</p>
                <p><strong>Education:</strong> ${data.education || ''}</p>
            `;
        } else {
            window.location.href = '/Loginn/loginn-side.html';
        }
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const job = document.getElementById('job').value;
    const education = document.getElementById('education').value;
    await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, education })
    });
    loadProfile();
});

document.addEventListener('DOMContentLoaded', loadProfile);
