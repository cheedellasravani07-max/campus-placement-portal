document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const message =
            document.getElementById("message");


        if (email === "") {

            message.textContent =
                "Please enter your email.";

            return;
        }


        fetch("/forgot-password/check", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email
            })

        })

            .then(response => {

                return response.text()
                    .then(text => {

                        if (!response.ok) {
                            throw new Error(text);
                        }

                        return text;
                    });
            })

            .then(text => {

                message.textContent = text;

                message.style.color = "green";

            })

            .catch(error => {

                console.error(
                    "Forgot Password Error:",
                    error
                );

                message.textContent =
                    error.message;

                message.style.color = "red";
            });

    });