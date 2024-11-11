        const CredentialsUsername = ["mikael", "miguel", "miguela"];
        const CredentialsPassword = ["passord1", "passord12", "passord123"];

function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let isValid = false;

    // Check if the username and password match
    CredentialsUsername.forEach((storedUsername, index) => {
        if (storedUsername === username && CredentialsPassword[index] === password) {
            isValid = true;
        }
    });

    // Redirect or show error message
    if (isValid) {
        console.log("Login successful!");
        window.location.href = "/profil/profilside.html";
    } else {
        document.getElementById("output").innerText = "Invalid username or password!";
        console.log("Login failed")
    }
}

console.log("Hello World!");