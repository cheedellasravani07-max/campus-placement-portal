// ================= LOAD DASHBOARD STATISTICS =================

function loadDashboardStatistics() {

    fetch("/admin/dashboard/stats", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load dashboard statistics"
                );
            }

            return response.json();
        })

        .then(stats => {

            // ================= BASIC STATISTICS =================

            document.getElementById("totalStudents").textContent =
                stats.students || 0;

            document.getElementById("totalCompanies").textContent =
                stats.companies || 0;

            document.getElementById("totalJobs").textContent =
                stats.jobs || 0;

            document.getElementById("totalApplications").textContent =
                stats.applications || 0;


            // ================= APPLICATION STATISTICS =================

            document.getElementById("appliedCount").textContent =
                stats.applied || 0;

            document.getElementById("shortlistedCount").textContent =
                stats.shortlisted || 0;

            document.getElementById("interviewCount").textContent =
                stats.interviews || 0;

            document.getElementById("acceptedCount").textContent =
                stats.accepted || 0;

            document.getElementById("rejectedCount").textContent =
                stats.rejected || 0;

        })

        .catch(error => {

            console.error(
                "Dashboard Statistics Error:",
                error
            );

        });
}


// ================= MANAGE PORTAL =================

function openPortal() {

    window.location.href =
        "/admin-portal.html";
}


// ================= MANAGE APPLICATIONS =================

function manageApplications() {

    window.location.href =
        "/admin-applications.html";
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

        loadDashboardStatistics();

    }
);


// ================= MANAGE PORTAL =================

function openPortal() {

    window.location.href =
        "/admin-portal.html";
}


// ================= MANAGE APPLICATIONS =================

function manageApplications() {

    window.location.href =
        "/admin-applications.html";
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

        loadDashboardStatistics();

    }
);