// ======================================================
// CAMPUS PLACEMENT PORTAL - ADMIN MANAGEMENT
// ======================================================


// ======================================================
// SHOW / HIDE SECTIONS
// ======================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll("main section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.style.display = "block";
    }
}


// ======================================================
// OPEN STUDENTS
// ======================================================

function openStudents() {

    showSection("students");

    loadStudents();
}


// ======================================================
// OPEN COMPANIES
// ======================================================

function openCompanies() {

    showSection("companies");

    loadCompanies();
}


// ======================================================
// OPEN JOBS
// ======================================================

function openJobs() {

    showSection("jobs");

    // Load companies for company dropdown
    loadJobCompanies();

    // Load existing jobs
    loadJobs();
}


// ======================================================
// OPEN INTERVIEWS
// ======================================================

function openInterviews() {

    window.location.href =
        "/admin-interviews.html";
}


// ======================================================
// OPEN APPLICATIONS
// ======================================================

function openApplications() {

    showSection("applications");

    loadApplicationStudents();

    loadApplicationJobs();

    loadApplications();
}


// ======================================================
// STUDENTS
// ======================================================

function loadStudents() {

    const studentList =
        document.getElementById("studentList");

    studentList.innerHTML =
        "<p>Loading students...</p>";

    fetch("/students")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(students => {

            if (!students ||
                students.length === 0) {

                studentList.innerHTML =
                    "<p>No students found.</p>";

                return;
            }

            studentList.innerHTML = "";

            students.forEach(student => {

                studentList.innerHTML += `

                    <div class="management-card">

                        <p>
                            <b>ID:</b>
                            ${student.id}
                        </p>

                        <p>
                            <b>Name:</b>
                            ${student.name}
                        </p>

                        <p>
                            <b>Email:</b>
                            ${student.email}
                        </p>

                        <p>
                            <b>Branch:</b>
                            ${student.branch}
                        </p>

                    </div>

                    <hr>
                `;
            });
        })

        .catch(error => {

            console.error(
                "Student loading error:",
                error
            );

            studentList.innerHTML = `

                <p>

                    <b>
                        Error loading students.
                    </b>

                    <br>

                    ${error.message}

                </p>
            `;
        });
}


// ======================================================
// ADD STUDENT
// ======================================================

function addStudent(event) {

    event.preventDefault();

    const name =
        document.getElementById("studentName")
            .value
            .trim();

    const email =
        document.getElementById("studentEmail")
            .value
            .trim();

    const branch =
        document.getElementById("studentBranch")
            .value
            .trim();

    const student = {

        name: name,

        email: email,

        branch: branch
    };


    fetch("/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to add student"
                        );
                    });
            }

            return response.json();
        })

        .then(data => {

            alert(
                "Student added successfully!"
            );

            document
                .getElementById("studentForm")
                .reset();

            loadStudents();
        })

        .catch(error => {

            console.error(
                "Student Error:",
                error
            );

            alert(
                "Error adding student: " +
                error.message
            );
        });
}


// ======================================================
// COMPANIES
// ======================================================

function loadCompanies() {

    const companyList =
        document.getElementById("companyList");

    companyList.innerHTML =
        "<p>Loading companies...</p>";


    fetch("/companies")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(companies => {

            if (!companies ||
                companies.length === 0) {

                companyList.innerHTML =
                    "<p>No companies found.</p>";

                return;
            }

            companyList.innerHTML = "";


            companies.forEach(company => {

                companyList.innerHTML += `

                    <div class="management-card">

                        <p>
                            <b>ID:</b>
                            ${company.id}
                        </p>

                        <p>
                            <b>Name:</b>
                            ${company.name}
                        </p>

                        <p>
                            <b>Location:</b>
                            ${company.location}
                        </p>

                        <p>
                            <b>Role:</b>
                            ${company.role}
                        </p>

                    </div>

                    <hr>
                `;
            });
        })

        .catch(error => {

            console.error(
                "Company loading error:",
                error
            );

            companyList.innerHTML = `

                <p>

                    <b>
                        Error loading companies.
                    </b>

                    <br>

                    ${error.message}

                </p>

            `;
        });
}


// ======================================================
// ADD COMPANY
// ======================================================

function addCompany(event) {

    event.preventDefault();


    const name =
        document.getElementById("companyName")
            .value
            .trim();


    const location =
        document.getElementById("companyLocation")
            .value
            .trim();


    const role =
        document.getElementById("companyRole")
            .value
            .trim();


    const company = {

        name: name,

        location: location,

        role: role
    };


    fetch("/companies", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(company)

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to add company"
                        );
                    });
            }

            return response.json();
        })

        .then(data => {

            alert(
                "Company added successfully!"
            );

            document
                .getElementById("companyForm")
                .reset();

            loadCompanies();

            // Refresh company dropdown
            loadJobCompanies();
        })

        .catch(error => {

            console.error(
                "Company Error:",
                error
            );

            alert(
                "Error adding company: " +
                error.message
            );
        });
}


// ======================================================
// LOAD COMPANIES FOR JOB DROPDOWN
// ======================================================

function loadJobCompanies() {

    const select =
        document.getElementById("jobCompanyId");


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Loading companies...</option>';


    fetch("/companies", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(companies => {

            select.innerHTML =
                '<option value="">Select Company</option>';


            if (!companies ||
                companies.length === 0) {

                select.innerHTML =
                    '<option value="">No companies available</option>';

                return;
            }


            companies.forEach(company => {

                select.innerHTML += `

                    <option value="${company.id}">

                        ${company.name}

                    </option>

                `;
            });
        })

        .catch(error => {

            console.error(
                "Job company loading error:",
                error
            );

            select.innerHTML =
                '<option value="">Error loading companies</option>';
        });
}


// ======================================================
// JOBS - LOAD ALL JOBS
// ======================================================

function loadJobs() {

    const jobList =
        document.getElementById("jobList");

    jobList.innerHTML =
        "<p>Loading jobs...</p>";


    fetch("/jobs", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(jobs => {

            if (!jobs ||
                jobs.length === 0) {

                jobList.innerHTML =
                    "<p>No jobs found.</p>";

                return;
            }

            jobList.innerHTML = "";


            jobs.forEach(job => {

                const companyName =
                    job.company
                        ? job.company.name
                        : "Not assigned";


                const minimumCgpa =
                    job.minimumCgpa !== null &&
                    job.minimumCgpa !== undefined
                        ? job.minimumCgpa
                        : "Not specified";


                const packageAmount =
                    job.packageAmount !== null &&
                    job.packageAmount !== undefined
                        ? job.packageAmount + " LPA"
                        : "Not specified";


                const requiredSkills =
                    job.requiredSkills
                        ? job.requiredSkills
                        : "Not specified";


                const applicationDeadline =
                    job.applicationDeadline
                        ? job.applicationDeadline
                        : "Not specified";


                jobList.innerHTML += `

                    <div class="management-card">

                        <p>
                            <b>ID:</b>
                            ${job.id}
                        </p>

                        <p>
                            <b>Title:</b>
                            ${job.title}
                        </p>

                        <p>
                            <b>Description:</b>
                            ${job.description}
                        </p>

                        <p>
                            <b>Location:</b>
                            ${job.location}
                        </p>

                        <p>
                            <b>Eligible Branch:</b>
                            ${job.eligibleBranch}
                        </p>

                        <p>
                            <b>Company:</b>
                            ${companyName}
                        </p>

                        <p>
                            <b>Minimum CGPA:</b>
                            ${minimumCgpa}
                        </p>

                        <p>
                            <b>Package:</b>
                            ${packageAmount}
                        </p>

                        <p>
                            <b>Required Skills:</b>
                            ${requiredSkills}
                        </p>

                        <p>
                            <b>Application Deadline:</b>
                            ${applicationDeadline}
                        </p>

                    </div>

                    <hr>
                `;
            });
        })

        .catch(error => {

            console.error(
                "Job loading error:",
                error
            );

            jobList.innerHTML = `

                <p>

                    <b>
                        Error loading jobs.
                    </b>

                    <br>

                    ${error.message}

                </p>

            `;
        });
}


// ======================================================
// ADD JOB
// ======================================================

function addJob(event) {

    event.preventDefault();


    // ================= GET VALUES =================

    const title =
        document
            .getElementById("jobTitle")
            .value
            .trim();


    const description =
        document
            .getElementById("jobDescription")
            .value
            .trim();


    const location =
        document
            .getElementById("jobLocation")
            .value
            .trim();


    const eligibleBranch =
        document
            .getElementById("jobEligibleBranch")
            .value;


    const companyId =
        document
            .getElementById("jobCompanyId")
            .value;


    const minimumCgpaValue =
        document
            .getElementById("jobMinimumCgpa")
            .value
            .trim();


    const packageAmountValue =
        document
            .getElementById("jobPackageAmount")
            .value
            .trim();


    const requiredSkills =
        document
            .getElementById("jobRequiredSkills")
            .value
            .trim();


    const applicationDeadline =
        document
            .getElementById("jobApplicationDeadline")
            .value;


    // ================= VALIDATION =================

    if (title === "") {

        alert(
            "Please enter job title."
        );

        return;
    }


    if (description === "") {

        alert(
            "Please enter job description."
        );

        return;
    }


    if (location === "") {

        alert(
            "Please enter job location."
        );

        return;
    }


    if (eligibleBranch === "") {

        alert(
            "Please select eligible branch."
        );

        return;
    }


    if (companyId === "") {

        alert(
            "Please select a company."
        );

        return;
    }


    // ================= CGPA VALIDATION =================

    let minimumCgpa = null;


    if (minimumCgpaValue !== "") {

        minimumCgpa =
            Number(minimumCgpaValue);


        if (
            Number.isNaN(minimumCgpa) ||
            minimumCgpa < 0 ||
            minimumCgpa > 10
        ) {

            alert(
                "Minimum CGPA must be between 0 and 10."
            );

            return;
        }
    }


    // ================= PACKAGE VALIDATION =================

    let packageAmount = null;


    if (packageAmountValue !== "") {

        packageAmount =
            Number(packageAmountValue);


        if (
            Number.isNaN(packageAmount) ||
            packageAmount < 0
        ) {

            alert(
                "Package must be a valid positive number."
            );

            return;
        }
    }


    // ================= JOB DATA =================

    const job = {

        title: title,

        description: description,

        location: location,

        eligibleBranch: eligibleBranch,

        company: {
            id: Number(companyId)
        },

        minimumCgpa: minimumCgpa,

        applicationDeadline:
            applicationDeadline === ""
                ? null
                : applicationDeadline,

        packageAmount: packageAmount,

        requiredSkills:
            requiredSkills === ""
                ? null
                : requiredSkills
    };


    console.log(
        "Job being sent:",
        job
    );


    // ================= SAVE JOB =================

    fetch("/jobs", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(job)

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to add job"
                        );
                    });
            }

            return response.json();
        })

        .then(data => {

            alert(
                "Job added successfully!"
            );


            document
                .getElementById("jobForm")
                .reset();


            loadJobs();

            loadJobCompanies();
        })

        .catch(error => {

            console.error(
                "Add Job Error:",
                error
            );

            alert(
                "Error adding job: " +
                error.message
            );
        });
}


// ======================================================
// APPLICATIONS
// ======================================================

function loadApplications() {

    const applicationList =
        document.getElementById(
            "applicationList"
        );

    applicationList.innerHTML =
        "<p>Loading applications...</p>";


    fetch("/applications")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(applications => {

            if (!applications ||
                applications.length === 0) {

                applicationList.innerHTML =
                    "<p>No applications found.</p>";

                return;
            }

            applicationList.innerHTML = "";


            applications.forEach(application => {

                const studentName =
                    application.student
                        ? application.student.name
                        : "Not assigned";


                const jobTitle =
                    application.job
                        ? application.job.title
                        : "Not assigned";


                const studentId =
                    application.student
                        ? application.student.id
                        : "";


                const jobId =
                    application.job
                        ? application.job.id
                        : "";


                applicationList.innerHTML += `

                    <div class="management-card">

                        <p>
                            <b>ID:</b>
                            ${application.id}
                        </p>

                        <p>
                            <b>Status:</b>
                            ${application.status}
                        </p>

                        <p>
                            <b>Student:</b>
                            ${studentName}
                        </p>

                        <p>
                            <b>Job:</b>
                            ${jobTitle}
                        </p>


                        <button
                            type="button"
                            onclick="editApplication(
                                ${application.id},
                                '${application.status}',
                                '${studentId}',
                                '${jobId}'
                            )">

                            Edit

                        </button>


                        <button
                            type="button"
                            onclick="deleteApplication(
                                ${application.id}
                            )">

                            Delete

                        </button>

                    </div>

                    <hr>
                `;
            });
        })

        .catch(error => {

            console.error(
                "Application loading error:",
                error
            );

            applicationList.innerHTML = `

                <p>

                    <b>
                        Error loading applications.
                    </b>

                    <br>

                    ${error.message}

                </p>

            `;
        });
}


// ======================================================
// ADD APPLICATION
// ======================================================

function addApplication() {

    const status =
        document
            .getElementById(
                "applicationStatus"
            )
            .value
            .trim();


    const studentId =
        document
            .getElementById(
                "applicationStudentId"
            )
            .value
            .trim();


    const jobId =
        document
            .getElementById(
                "applicationJobId"
            )
            .value
            .trim();


    if (
        status === "" ||
        studentId === "" ||
        jobId === ""
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }


    const application = {

        status: status,

        studentId:
            Number(studentId),

        jobId:
            Number(jobId)
    };


    fetch("/applications", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(application)

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to add application"
                        );
                    });
            }

            return response.json();
        })

        .then(data => {

            alert(
                "Application added successfully!"
            );


            document
                .getElementById(
                    "applicationStatus"
                )
                .value = "";


            document
                .getElementById(
                    "applicationStudentId"
                )
                .value = "";


            document
                .getElementById(
                    "applicationJobId"
                )
                .value = "";


            loadApplications();
        })

        .catch(error => {

            console.error(
                "Application Error:",
                error
            );

            alert(
                "Error adding application: " +
                error.message
            );
        });
}


// ======================================================
// DELETE APPLICATION
// ======================================================

function deleteApplication(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmed) {
        return;
    }


    fetch(
        "/applications/" + id,
        {
            method: "DELETE"
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to delete application"
                        );
                    });
            }

            return response.text();
        })

        .then(message => {

            alert(
                "Application deleted successfully!"
            );

            loadApplications();
        })

        .catch(error => {

            console.error(
                "Delete Error:",
                error
            );

            alert(
                "Error deleting application: " +
                error.message
            );
        });
}


// ======================================================
// EDIT APPLICATION
// ======================================================

function editApplication(
    id,
    currentStatus,
    currentStudentId,
    currentJobId
) {

    const status =
        prompt(
            "Enter new status:\nAPPLIED / INTERVIEW / ACCEPTED / REJECTED",
            currentStatus
        );


    if (
        status === null ||
        status.trim() === ""
    ) {

        return;
    }


    const studentId =
        prompt(
            "Enter Student ID:",
            currentStudentId
        );


    if (
        studentId === null ||
        studentId.trim() === ""
    ) {

        alert(
            "Student ID is required"
        );

        return;
    }


    const jobId =
        prompt(
            "Enter Job ID:",
            currentJobId
        );


    if (
        jobId === null ||
        jobId.trim() === ""
    ) {

        alert(
            "Job ID is required"
        );

        return;
    }


    const updatedApplication = {

        status:
            status.trim(),

        studentId:
            Number(studentId),

        jobId:
            Number(jobId)
    };


    fetch(
        "/applications/" + id,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(
                    updatedApplication
                )
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to update application"
                        );
                    });
            }

            return response.json();
        })

        .then(data => {

            alert(
                "Application updated successfully!"
            );

            loadApplications();
        })

        .catch(error => {

            console.error(
                "Update Error:",
                error
            );

            alert(
                "Error updating application: " +
                error.message
            );
        });
}


// ======================================================
// APPLICATION STUDENT DROPDOWN
// ======================================================

function loadApplicationStudents() {

    const select =
        document.getElementById(
            "applicationStudentId"
        );


    select.innerHTML =
        '<option value="">Loading students...</option>';


    fetch("/students")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(students => {

            select.innerHTML =
                '<option value="">Select Student</option>';


            students.forEach(student => {

                select.innerHTML += `

                    <option value="${student.id}">

                        ${student.name}

                    </option>

                `;
            });
        })

        .catch(error => {

            console.error(
                "Application student error:",
                error
            );

            select.innerHTML =
                '<option value="">Error loading students</option>';
        });
}


// ======================================================
// APPLICATION JOB DROPDOWN
// ======================================================

function loadApplicationJobs() {

    const select =
        document.getElementById(
            "applicationJobId"
        );


    select.innerHTML =
        '<option value="">Loading jobs...</option>';


    fetch("/jobs")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(jobs => {

            select.innerHTML =
                '<option value="">Select Job</option>';


            jobs.forEach(job => {

                select.innerHTML += `

                    <option value="${job.id}">

                        ${job.title}

                    </option>

                `;
            });
        })

        .catch(error => {

            console.error(
                "Application job error:",
                error
            );

            select.innerHTML =
                '<option value="">Error loading jobs</option>';
        });
}


// ======================================================
// BACK TO ADMIN DASHBOARD
// ======================================================

function goBack() {

    window.location.href =
        "admin-dashboard.html";
}