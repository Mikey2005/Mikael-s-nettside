const profilePictrue = document.querySelector(".profile-picture img");
const dropdownMenu = document.getElementById("dropdownmenu");
const viewProfileButton = document.getElementById("view-profile");
const logoutButton = document.getElementById("logout");

profilePictrue.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";

});

document.addEventListener("click", (event) => {
    if (!profilePictrue.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});

viewProfileButton.addEventListener("click", () => {
    window.location.href = "/profil/profilside.html";
});

logoutButton.addEventListener("click", () => {
    window.location.href = "/Loginn/loginn-side.html"
})