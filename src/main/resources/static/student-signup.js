const signupForm = document.getElementById("signupForm");

// Prevent the submit listener from being attached more than once
if (signupForm && signupForm.dataset.listenerAttached !== "true") {

    signupForm.dataset.listenerAttached = "true";

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const branch =
            document.getElementById("branch").value;

        const message =
            document.getElementById("message");

        const submitButton =
            signupForm.querySelector("button[type='submit']");


        // ================= VALIDATION =================

        if (
            name === "" ||
            email === "" ||
            username === "" ||
            password === "" ||
            branch === ""
        ) {

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


        // ================= REGISTRATION DATA =================

        const studentData = {

            name: name,
            email: email,
            username: username,
            password: password,
            branch: branch

        };


        // ================= PREVENT DOUBLE SUBMISSION =================

        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Registering...";

        }

        message.textContent =
            "Creating your account...";

        message.style.color = "";


        // ================= SEND TO BACKEND =================

        fetch("/auth/student/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)

        })

            .then(async response => {

                const text = await response.text();

                console.log("Server response:", response.status, text);

                if (!response.ok) {

                    throw new Error(text);

                }

                return text;

            })

            .then(data => {

                // ================= SUCCESS =================

                console.log(
                    "Registration successful:",
                    data
                );

                message.textContent =
                    "Registration successful! Please check your email and verify your account before login.";

                message.style.color = "green";

                signupForm.reset();

                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.textContent = "Register";

                }

            })

            .catch(error => {

                console.error(
                    "Registration Error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Registration failed. Please try again.";

                message.style.color = "red";


                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.textContent = "Register";

                }

            });

    });
}