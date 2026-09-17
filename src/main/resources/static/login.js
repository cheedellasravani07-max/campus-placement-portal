document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("error")) {
        alert("Invalid username or password.");
    }

    if (urlParams.has("logout")) {
        alert("You have been logged out successfully.");
    }

    if (urlParams.has("signupSuccess")) {
        alert("Student account created successfully. You can now login.");
    }

    if (urlParams.has("signupError")) {

        const error = urlParams.get("signupError");

        if (error === "username") {
            alert("Username already exists.");
        }

        if (error === "email") {
            alert("Email already registered.");
        }
    }

});