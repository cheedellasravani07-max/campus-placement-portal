document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message");
    const button = this.querySelector('button[type="submit"]');

    if (!email) {
        message.textContent = "Please enter your email.";
        message.style.color = "red";
        return;
    }

    button.disabled = true;
    button.textContent = "Please wait...";
    message.textContent = "Checking your registered email...";
    message.style.color = "#536273";

    try {
        // Generate and save a reset token in the backend
        const response = await fetch("/forgot-password/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "Unable to process your request.");
        }

        const resetLink = data.resetLink;

        if (!resetLink) {
            throw new Error("The server did not return a reset link.");
        }

        // Send only the password-reset email
        await emailjs.send(
            "service_kucfxyi",
            "template_3nhw0uj",
            {
                email_heading: "Reset Your Password",
                name: data.name,
                email: data.email || email,
                message: "We received a request to reset your Campus Placement Portal password. Click the link below to choose a new password.",
                details: "This password-reset link expires in 15 minutes. If you did not request this, you can ignore this email.",
                action_link: resetLink,
                action_text: "Reset Your Password"
            }
        );

        message.textContent = "Password-reset email sent successfully. Please check your inbox and spam folder.";
        message.style.color = "green";

    } catch (error) {
        console.error("Forgot Password Error:", error);
        message.textContent = error.message || "Unable to send the password-reset email.";
        message.style.color = "red";

    } finally {
        button.disabled = false;
        button.textContent = "Verify Email";
    }
});