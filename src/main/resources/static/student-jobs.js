let allJobs = [];

let studentBranch = "";


// ================= LOAD STUDENT JOBS =================

function loadStudentJobs() {

    fetch("/student/profile", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load student profile"
                );
            }

            return response.json();
        })

        .then(student => {

            studentBranch =
                student.branch
                    ? student.branch.trim().toUpperCase()
                    : "";

            return fetch("/student/jobs", {
                method: "GET",
                cache: "no-store"
            });
        })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load jobs"
                );
            }

            return response.json();
        })

        .then(jobs => {

            allJobs = jobs;

            populateLocationFilter(jobs);

            displayJobs(
                jobs,
                studentBranch
            );
        })

        .catch(error => {

            console.error(
                "Student Jobs Error:",
                error
            );

            document.getElementById("jobList").innerHTML =
                "<p>Error loading jobs.</p>";
        });
}


// ================= DISPLAY JOBS =================

function displayJobs(
    jobs,
    currentStudentBranch = ""
) {

    const jobList =
        document.getElementById("jobList");

    jobList.innerHTML = "";


    if (jobs.length === 0) {

        jobList.innerHTML =
            "<p>No jobs found.</p>";

        return;
    }


    jobs.forEach(job => {

        const companyName =
            job.company
                ? job.company.name
                : "Company not assigned";


        // ================= ELIGIBILITY =================

        const eligibleBranch =
            job.eligibleBranch
                ? job.eligibleBranch
                    .trim()
                    .toUpperCase()
                : "";


        const isEligible =
            currentStudentBranch !== "" &&
            eligibleBranch !== "" &&
            currentStudentBranch === eligibleBranch;


        const eligibilityMessage =
            isEligible
                ? `
                    <p class="eligible">
                        ✅ You are eligible for this job
                    </p>
                  `
                : `
                    <p class="not-eligible">
                        ❌ You are not eligible for this job
                    </p>
                  `;


        // ================= DEADLINE =================

        let deadlineMessage = "";
        let deadlinePassed = false;

        if (job.applicationDeadline) {

            const today =
                new Date();

            today.setHours(
                0, 0, 0, 0
            );


            const deadline =
                new Date(
                    job.applicationDeadline
                );

            deadline.setHours(
                0, 0, 0, 0
            );


            deadlinePassed =
                deadline < today;


            deadlineMessage =
                deadlinePassed
                    ? `
                        <p class="deadline-closed">
                            🔴 Application Deadline Passed:
                            ${job.applicationDeadline}
                        </p>
                      `
                    : `
                        <p class="deadline-open">
                            🟢 Application Deadline:
                            ${job.applicationDeadline}
                        </p>
                      `;

        } else {

            deadlineMessage =
                `
                <p>
                    <b>Application Deadline:</b>
                    Not specified
                </p>
                `;
        }


        // ================= COMPANY BUTTON =================

        const companyButton =
            job.company
                ? `
                    <button
                        type="button"
                        onclick="viewCompany(${job.company.id})">

                        Company Details

                    </button>
                  `
                : "";


        // ================= APPLY BUTTON =================

        let applyButton;


        if (!isEligible) {

            applyButton =
                `
                <button
                    type="button"
                    disabled>

                    Not Eligible

                </button>
                `;

        } else if (deadlinePassed) {

            applyButton =
                `
                <button
                    type="button"
                    disabled>

                    Deadline Passed

                </button>
                `;

        } else {

            applyButton =
                `
                <button
                    type="button"
                    onclick="applyForJob(${job.id})">

                    Apply

                </button>
                `;
        }


        // ================= JOB CARD =================

        jobList.innerHTML += `

            <div class="job-card">

                <h3>
                    ${job.title}
                </h3>


                <p>
                    <b>Description:</b>
                    ${job.description}
                </p>


                <p>
                    <b>Location:</b>
                    ${job.location}
                </p>


                <p>
                    <b>Company:</b>
                    ${companyName}
                </p>


                <p>
                    <b>Eligible Branch:</b>
                    ${job.eligibleBranch || "Not specified"}
                </p>


                ${eligibilityMessage}


                ${deadlineMessage}


                ${applyButton}


                ${companyButton}

            </div>

        `;
    });
}


// ================= LOCATION FILTER =================

function populateLocationFilter(jobs) {

    const locationFilter =
        document.getElementById("locationFilter");


    locationFilter.innerHTML =
        '<option value="">All Locations</option>';


    const locations = [];


    jobs.forEach(job => {

        if (
            job.location &&
            !locations.includes(job.location)
        ) {

            locations.push(job.location);
        }
    });


    locations.sort();


    locations.forEach(location => {

        const option =
            document.createElement("option");


        option.value = location;

        option.textContent = location;


        locationFilter.appendChild(option);
    });
}


// ================= SEARCH AND FILTER =================

function filterJobs() {

    const searchText =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const selectedLocation =
        document.getElementById("locationFilter")
            .value;


    const filteredJobs =
        allJobs.filter(job => {

            const title =
                job.title
                    ? job.title.toLowerCase()
                    : "";


            const company =
                job.company &&
                job.company.name
                    ? job.company.name.toLowerCase()
                    : "";


            const location =
                job.location
                    ? job.location
                    : "";


            const matchesSearch =
                title.includes(searchText) ||
                company.includes(searchText);


            const matchesLocation =
                selectedLocation === "" ||
                location === selectedLocation;


            return (
                matchesSearch &&
                matchesLocation
            );
        });


    displayJobs(
        filteredJobs,
        studentBranch
    );
}


// ================= CLEAR FILTERS =================

function clearFilters() {

    document.getElementById(
        "searchInput"
    ).value = "";


    document.getElementById(
        "locationFilter"
    ).value = "";


    displayJobs(
        allJobs,
        studentBranch
    );
}


// ================= APPLY FOR JOB =================

function applyForJob(jobId) {

    fetch(
        "/applications/student/apply/" + jobId,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            }

        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to apply for job"
                        );

                    });
            }


            return response.json();

        })

        .then(data => {

            alert(
                "Job application submitted successfully!"
            );

            // Reload jobs after successful application
            loadStudentJobs();

        })

        .catch(error => {

            console.error(
                "Application Error:",
                error
            );


            alert(
                "Error applying for job: " +
                error.message
            );

        });
}


// ================= VIEW COMPANY =================

function viewCompany(companyId) {

    window.location.href =
        "/company-details.html?id=" +
        companyId;
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

        loadStudentJobs();

    }
);