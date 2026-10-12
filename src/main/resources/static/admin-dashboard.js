
async function loadDashboardStatistics() {
    try {
        const response = await fetch("/admin/dashboard/stats", {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Failed to load dashboard statistics: " + response.status);
        }

        const stats = await response.json();

        const updateCount = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = Number(value ?? 0);
            }
        };

        updateCount("totalStudents", stats.students);
        updateCount("totalCompanies", stats.companies);
        updateCount("totalJobs", stats.jobs);
        updateCount("totalApplications", stats.applications);

        updateCount("appliedCount", stats.applied);
        updateCount("shortlistedCount", stats.shortlisted);
        updateCount("interviewCount", stats.interviews);
        updateCount("acceptedCount", stats.accepted);
        updateCount("rejectedCount", stats.rejected);

    } catch (error) {
        console.error("Dashboard Statistics Error:", error);
    }
}

function openPortal() {
    window.location.href = "/admin-portal.html";
}

function manageApplications() {
    window.location.href = "/admin-applications.html";
}

function changePasswordPage() {
    window.location.href = "/change-password.html";
}

function logout() {
    window.location.href = "/logout";
}

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStatistics();

    // Refresh statistics every 10 seconds.
    setInterval(loadDashboardStatistics, 10000);
});
