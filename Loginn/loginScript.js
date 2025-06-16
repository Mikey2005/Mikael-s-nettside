async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            window.location.href = '/profil/profilside.html';
        } else {
            const data = await res.json();
            document.getElementById('output').innerText = data.error || 'Login failed';
        }
    } catch (err) {
        document.getElementById('output').innerText = 'Network error';
    }
}
