function resetPassword() {

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");


    if (!newPassword || !confirmPassword) {

        message.textContent =
            "Please enter both passwords.";

        return;
    }


    if (newPassword !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    const params =
        new URLSearchParams(window.location.search);

    const token =
        params.get("token");


    if (!token) {

        message.textContent =
            "Invalid or missing reset token.";

        return;
    }


    fetch("/forgot-password/reset", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            token: token,

            newPassword: newPassword

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

        .then(result => {

            message.textContent = result;

            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        })

        .catch(error => {

            console.error(error);

            message.textContent =
                error.message;
        });
}