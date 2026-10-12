
document.getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message");

        if (!email) {
            message.textContent = "Please enter your email.";
            message.style.color = "red";
            return;
        }

        message.textContent = "Sending reset email...";
        message.style.color = "blue";

        try {
            const response = await fetch("/forgot-password/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to process request.");
            }

            if (!data.name || !data.email || !data.resetLink) {
                throw new Error("Reset-link response is incomplete.");
            }

            await emailjs.send(
                "service_kucfxyi",
                "template_3nhw0uj",
                {
                    email_heading: "Password Reset",
                    name: data.name,
                    email: data.email,
                    message: "We received a request to reset your password.",
                    details: "This link expires in 15 minutes.",
                    action_link: data.resetLink,
                    action_text: "Reset Your Password"
                }
            );

            message.textContent =
                "Reset email sent. Please check your inbox and spam folder.";
            message.style.color = "green";

        } catch (error) {
            console.error("Forgot Password Error:", error);
            message.textContent =
                error.message || "Failed to send reset email.";
            message.style.color = "red";
        }
    });
