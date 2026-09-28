document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");
    const message = document.getElementById("message");

    if (!signupForm) {
        console.error("signupForm not found");
        return;
    }

    signupForm.addEventListener("submit", async function (event) {

        // VERY IMPORTANT:
        // Stop normal HTML form submission.
        event.preventDefault();
        event.stopPropagation();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const branch = document.getElementById("branch").value.trim();

        const submitButton =
            signupForm.querySelector("button[type='submit']");


        // ================= VALIDATION =================

        if (!name || !email || !username || !password || !branch) {

            message.textContent =
                "Please fill all the fields.";

            message.style.color = "red";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            message.style.color = "red";

            return;
        }


        // ================= REQUEST DATA =================

        const studentData = {
            name: name,
            email: email,
            username: username,
            password: password,
            branch: branch
        };


        // ================= BUTTON =================

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Registering...";
        }

        message.textContent = "Creating your account...";
        message.style.color = "black";


        // ================= API REQUEST =================

        try {

            const response = await fetch(
                "/auth/student/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain"
                    },

                    body: JSON.stringify(studentData)
                }
            );


            const responseText = await response.text();

            console.log(
                "Registration status:",
                response.status
            );

            console.log(
                "Registration response:",
                responseText
            );


            // ================= ERROR =================

            if (!response.ok) {

                message.textContent =
                    responseText ||
                    "Registration failed.";

                message.style.color = "red";

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Student Sign Up";
                }

                return;
            }


            // ================= SUCCESS =================

            message.textContent = responseText ||
                "Registration successful. Please check your email.";

            message.style.color = "green";

            signupForm.reset();

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Student Sign Up";
            }

        } catch (error) {

            console.error(
                "Registration request failed:",
                error
            );

            message.textContent =
                "Unable to connect to the server. Please try again.";

            message.style.color = "red";

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Student Sign Up";
            }
        }

    });

});