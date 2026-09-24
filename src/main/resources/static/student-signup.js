document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");

    // Check whether signup form exists
    if (!signupForm) {
        console.error("ERROR: signupForm was not found in the page.");
        return;
    }

    console.log("Student signup form found.");
    console.log("Attaching registration submit listener...");

    // Prevent the submit listener from being attached more than once
    if (signupForm.dataset.listenerAttached === "true") {
        console.log("Signup listener already attached.");
        return;
    }

    signupForm.dataset.listenerAttached = "true";

    signupForm.addEventListener("submit", async function (event) {

        // VERY IMPORTANT:
        // Prevent normal HTML form submission
        event.preventDefault();

        console.log("Student signup form submitted.");

        const nameElement =
            document.getElementById("name");

        const emailElement =
            document.getElementById("email");

        const usernameElement =
            document.getElementById("username");

        const passwordElement =
            document.getElementById("password");

        const branchElement =
            document.getElementById("branch");

        const message =
            document.getElementById("message");

        const submitButton =
            signupForm.querySelector("button[type='submit']");


        // ================= CHECK ELEMENTS =================

        if (
            !nameElement ||
            !emailElement ||
            !usernameElement ||
            !passwordElement ||
            !branchElement ||
            !message
        ) {

            console.error("One or more signup form elements were not found.");

            if (message) {
                message.textContent =
                    "Registration form configuration error.";
                message.style.color = "red";
            }

            return;
        }


        // ================= GET VALUES =================

        const name =
            nameElement.value.trim();

        const email =
            emailElement.value.trim();

        const username =
            usernameElement.value.trim();

        const password =
            passwordElement.value;

        const branch =
            branchElement.value.trim();


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


        console.log(
            "Sending registration request..."
        );

        console.log(
            "Registration data:",
            {
                name: name,
                email: email,
                username: username,
                branch: branch
            }
        );


        // ================= PREVENT DOUBLE SUBMISSION =================

        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Registering...";

        }

        message.textContent =
            "Creating your account...";

        message.style.color = "";


        // ================= SEND TO BACKEND =================

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


            const text =
                await response.text();


            console.log(
                "Registration API status:",
                response.status
            );

            console.log(
                "Registration API response:",
                text
            );


            // ================= SERVER ERROR =================

            if (!response.ok) {

                throw new Error(
                    text || "Registration failed."
                );
            }


            // ================= SUCCESS =================

            message.textContent =
                text ||
                "Registration successful. Please check your email and verify your account.";

            message.style.color = "green";

            signupForm.reset();


            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Register";

            }

        } catch (error) {

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

        }

    });

});