// ================= LOAD DASHBOARD =================

function loadStudentDashboard() {

    // -------- AVAILABLE JOBS --------

    fetch("/jobs")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();
        })
        .then(jobs => {

            document.getElementById("totalJobs").textContent =
                jobs.length;

        })
        .catch(error => {

            console.error(
                "Jobs error:",
                error
            );

        });


    // -------- MY APPLICATIONS --------

    fetch("/applications")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load applications");
            }

            return response.json();
        })
        .then(applications => {

            document.getElementById("totalApplications").textContent =
                applications.length;

        })
        .catch(error => {

            console.error(
                "Applications error:",
                error
            );

        });


    // -------- NOTIFICATIONS --------

    loadNotifications();
}


// ================= LOAD NOTIFICATIONS =================

function loadNotifications() {

    fetch("/student/notifications")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load notifications"
                );
            }

            return response.json();
        })
        .then(notifications => {

            const notificationList =
                document.getElementById("notificationList");

            notificationList.innerHTML = "";


            if (notifications.length === 0) {

                notificationList.innerHTML =
                    "<p>No notifications at the moment.</p>";

                return;
            }


            notifications.forEach(notification => {

                notificationList.innerHTML += `
                    <div class="notification-card">

                        <h3>
                            ${notification.status}
                        </h3>

                        <p>
                            ${notification.message}
                        </p>

                    </div>
                `;
            });

        })
        .catch(error => {

            console.error(
                "Notifications error:",
                error
            );

            document.getElementById(
                "notificationList"
            ).innerHTML =
                "<p>Unable to load notifications.</p>";
        });
}


// ================= VIEW JOBS =================

function viewJobs() {

    window.location.href =
        "/student-jobs.html";
}


// ================= VIEW APPLICATIONS =================

function viewApplications() {

    window.location.href =
        "/student-applications.html";
}


// ================= VIEW INTERVIEWS =================

function viewInterviews() {

    window.location.href =
        "/student-interview.html";
}


// ================= VIEW PROFILE =================

function viewProfile() {

    window.location.href =
        "/student-profile.html";
}


// ================= OPEN RESUME =================

function openResume() {

    window.location.href =
        "/student-resume.html";
}


// ================= CHANGE PASSWORD =================

function changePasswordPage() {

    window.location.href =
        "/change-password.html";
}


// ================= LOGOUT =================

function logout() {

    window.location.href =
        "/logout";
}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudentDashboard();

    }
);