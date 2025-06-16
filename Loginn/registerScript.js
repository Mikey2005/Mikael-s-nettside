async function handleRegister() {
    const data = {
        username: document.getElementById('reg_username').value,
        password: document.getElementById('reg_password').value,
        first_name: document.getElementById('reg_first_name').value,
        last_name: document.getElementById('reg_last_name').value,
        address: document.getElementById('reg_address').value
    };
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if (res.ok) {
            document.getElementById('register_output').innerText = 'Account created!';
        } else {
            const result = await res.json();
            document.getElementById('register_output').innerText = result.error || 'Error';
        }
    } catch (err) {
        document.getElementById('register_output').innerText = 'Network error';
    }
}
