function changePassword() {

    const currentPassword =
        document.getElementById("currentPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();


    // ================= VALIDATION =================

    if (currentPassword === "") {

        alert("Please enter your current password.");
        return;
    }

    if (newPassword === "") {

        alert("Please enter a new password.");
        return;
    }

    if (confirmPassword === "") {

        alert("Please confirm your new password.");
        return;
    }

    if (newPassword !== confirmPassword) {

        alert("New passwords do not match.");
        return;
    }


    // ================= SEND REQUEST =================

    const request = {

        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };


    fetch("/account/change-password", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(request)

    })
        .then(response => {

            return response.text().then(message => {

                if (!response.ok) {

                    throw new Error(message);
                }

                return message;
            });
        })
        .then(message => {

            alert(message);

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

        })
        .catch(error => {

            console.error(
                "Password Change Error:",
                error
            );

            alert(
                "Error: " +
                error.message
            );
        });
}


// ================= BACK TO DASHBOARD =================

function goBack() {

    // Check which dashboard should be opened
    // based on the current logged-in user's page.

    window.history.back();
}