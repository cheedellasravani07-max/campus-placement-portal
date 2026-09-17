let allApplications = [];


// ================= LOAD APPLICATIONS =================

function loadApplications() {

    fetch("/applications")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load applications");
            }

            return response.json();
        })
        .then(applications => {

            allApplications = applications;

            displayApplications(applications);
        })
        .catch(error => {

            console.error(
                "Applications Error:",
                error
            );

            document.getElementById("applicationList").innerHTML =
                "<p>Error loading applications.</p>";
        });
}


// ================= DISPLAY APPLICATIONS =================

function displayApplications(applications) {

    const applicationList =
        document.getElementById("applicationList");

    applicationList.innerHTML = "";


    if (applications.length === 0) {

        applicationList.innerHTML =
            "<p>No applications found.</p>";

        return;
    }


    applications.forEach(application => {

        const student = application.student;
        const job = application.job;

        const company =
            job && job.company
                ? job.company
                : null;


        const studentName =
            student
                ? student.name
                : "Unknown";

        const studentEmail =
            student
                ? student.email
                : "Unknown";

        const jobTitle =
            job
                ? job.title
                : "Job unavailable";

        const companyName =
            company
                ? company.name
                : "Company not assigned";

        const location =
            job
                ? job.location
                : "Unknown";


        applicationList.innerHTML += `

            <div class="application-card">

                <h3>
                    ${jobTitle}
                </h3>

                <p>
                    <b>Student:</b>
                    ${studentName}
                </p>

                <p>
                    <b>Email:</b>
                    ${studentEmail}
                </p>

                <p>
                    <b>Company:</b>
                    ${companyName}
                </p>

                <p>
                    <b>Location:</b>
                    ${location}
                </p>

                <p>
                    <b>Current Status:</b>
                    ${application.status}
                </p>


                <label>
                    <b>Change Status:</b>
                </label>

                <br>


                <select id="status-${application.id}">

                    <option value="APPLIED"
                        ${application.status === "APPLIED"
            ? "selected"
            : ""}>
                        APPLIED
                    </option>


                    <option value="SHORTLISTED"
                        ${application.status === "SHORTLISTED"
            ? "selected"
            : ""}>
                        SHORTLISTED
                    </option>


                    <option value="INTERVIEW"
                        ${application.status === "INTERVIEW"
            ? "selected"
            : ""}>
                        INTERVIEW
                    </option>


                    <option value="ACCEPTED"
                        ${application.status === "ACCEPTED"
            ? "selected"
            : ""}>
                        ACCEPTED
                    </option>


                    <option value="REJECTED"
                        ${application.status === "REJECTED"
            ? "selected"
            : ""}>
                        REJECTED
                    </option>

                </select>

                <br>


                <button
                    type="button"
                    onclick="updateApplicationStatus(${application.id})">
                    Update Status
                </button>


                <button
                    type="button"
                    onclick="scheduleInterview(${application.id})">
                    Schedule Interview
                </button>

            </div>
        `;
    });
}


// ================= FILTER APPLICATIONS =================

function filterApplications() {

    const searchText =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const selectedStatus =
        document.getElementById("statusFilter")
            .value;


    const filteredApplications =
        allApplications.filter(application => {

            const student =
                application.student;

            const job =
                application.job;

            const company =
                job && job.company
                    ? job.company
                    : null;


            const studentName =
                student && student.name
                    ? student.name.toLowerCase()
                    : "";

            const studentEmail =
                student && student.email
                    ? student.email.toLowerCase()
                    : "";

            const jobTitle =
                job && job.title
                    ? job.title.toLowerCase()
                    : "";

            const companyName =
                company && company.name
                    ? company.name.toLowerCase()
                    : "";


            const matchesSearch =
                studentName.includes(searchText) ||
                studentEmail.includes(searchText) ||
                jobTitle.includes(searchText) ||
                companyName.includes(searchText);


            const matchesStatus =
                selectedStatus === "" ||
                application.status === selectedStatus;


            return matchesSearch && matchesStatus;
        });


    displayApplications(filteredApplications);
}


// ================= CLEAR FILTERS =================

function clearFilters() {

    document.getElementById("searchInput").value = "";

    document.getElementById("statusFilter").value = "";

    displayApplications(allApplications);
}


// ================= UPDATE STATUS =================

function updateApplicationStatus(applicationId) {

    const selectedStatus =
        document.getElementById(
            "status-" + applicationId
        ).value;


    fetch(
        "/applications/" +
        applicationId +
        "/status?status=" +
        selectedStatus,
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to update application status"
                        );
                    });
            }

            return response.json();
        })

        .then(updatedApplication => {

            alert(
                "Application status updated successfully!"
            );

            loadApplications();
        })

        .catch(error => {

            console.error(
                "Status Update Error:",
                error
            );

            alert(
                "Error updating status: " +
                error.message
            );
        });
}


// ================= BACK TO DASHBOARD =================

function goBack() {

    window.location.href =
        "/admin-dashboard.html";
}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadApplications();

    }
);


// ================= SCHEDULE INTERVIEW =================

function scheduleInterview(applicationId) {

    window.location.href =
        "/schedule-interview.html?applicationId=" +
        applicationId;
}