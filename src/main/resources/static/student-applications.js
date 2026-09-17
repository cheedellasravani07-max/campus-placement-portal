// ================= LOAD MY APPLICATIONS =================

function loadMyApplications() {

    fetch("/applications/my", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text || "Failed to load applications"
                        );

                    });
            }

            return response.json();
        })

        .then(applications => {

            const applicationList =
                document.getElementById("applicationList");

            applicationList.innerHTML = "";


            // ================= NO APPLICATIONS =================

            if (!applications || applications.length === 0) {

                applicationList.innerHTML =
                    "<p>You have not applied for any jobs yet.</p>";

                return;
            }


            // ================= DISPLAY APPLICATIONS =================

            applications.forEach(application => {

                const job =
                    application.job;

                const company =
                    job && job.company
                        ? job.company.name
                        : "Company not assigned";


                const status =
                    application.status
                        ? application.status
                        : "UNKNOWN";


                applicationList.innerHTML += `

                    <div class="application-card">

                        <h3>
                            ${
                    job
                        ? job.title
                        : "Job unavailable"
                }
                        </h3>


                        <p>
                            <b>Company:</b>
                            ${company}
                        </p>


                        <p>
                            <b>Location:</b>
                            ${
                    job
                        ? job.location
                        : "Not available"
                }
                        </p>


                        <p>
                            <b>Eligible Branch:</b>
                            ${
                    job && job.eligibleBranch
                        ? job.eligibleBranch
                        : "Not specified"
                }
                        </p>


                        <p class="status status-${status.toLowerCase()}">

                            <b>Application Status:</b>
                            ${status}

                        </p>

                    </div>

                `;
            });

        })

        .catch(error => {

            console.error(
                "Applications Error:",
                error
            );


            document.getElementById(
                "applicationList"
            ).innerHTML = `

                <p>
                    Error loading applications:
                    ${error.message}
                </p>

            `;

        });
}


// ================= BACK TO DASHBOARD =================

function goBack() {

    window.location.href =
        "/student-dashboard.html";
}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMyApplications();

    }
);