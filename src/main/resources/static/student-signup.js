document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");
    const message = document.getElementById("message");

    if (!signupForm) {
        console.error("signupForm not found");
        return;
    }

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const branch = document.getElementById("branch").value.trim();

        if (!name || !email || !username || !password || !branch) {
            message.textContent = "Please fill all the fields.";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }

        const studentData = {
            name: name,
            email: email,
            username: username,
            password: password,
            branch: branch
        };

        const submitButton =
            signupForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Registering...";

        message.textContent = "Creating your account...";
        message.style.color = "black";

        try {

            const response = await fetch(
                "/auth/student/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                }
            );

            const responseText = await response.text();

            console.log(
                "Registration response:",
                response.status,
                responseText
            );

            if (!response.ok) {
                throw new Error(responseText);
            }

            message.textContent = responseText;
            message.style.color = "green";

            signupForm.reset();

        } catch (error) {

            console.error("Registration error:", error);

            message.textContent =
                error.message ||
                "Registration failed. Please try again.";

            message.style.color = "red";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Student Sign Up";
        }

    });

});