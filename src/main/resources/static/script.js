function showSection(sectionId) {
    const sections = document.querySelectorAll("main section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.style.display = "block";
    }
}


// ================= STUDENTS =================

function loadStudents() {

    fetch("/students")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load students");
            }

            return response.json();
        })
        .then(students => {

            const studentList =
                document.getElementById("studentList");

            studentList.innerHTML = "";

            if (students.length === 0) {

                studentList.innerHTML =
                    "<p>No students found.</p>";

                return;
            }

            students.forEach(student => {

                studentList.innerHTML += `
                    <div>
                        <p>
                            <b>ID:</b> ${student.id}<br>
                            <b>Name:</b> ${student.name}<br>
                            <b>Email:</b> ${student.email}<br>
                            <b>Branch:</b> ${student.branch}
                        </p>

                        <button type="button"
                                onclick="editStudent(
                                    ${student.id},
                                    '${student.name}',
                                    '${student.email}',
                                    '${student.branch}'
                                )">
                            Edit
                        </button>

                        <button type="button"
                                onclick="deleteStudent(${student.id})">
                            Delete
                        </button>

                        <hr>
                    </div>
                `;
            });
        })
        .catch(error => {

            console.error("Student Error:", error);

            alert("Error loading students");
        });
}


function editStudent(id, currentName, currentEmail, currentBranch) {

    const name = prompt(
        "Enter student name:",
        currentName
    );

    if (name === null || name.trim() === "") {
        return;
    }

    const email = prompt(
        "Enter student email:",
        currentEmail
    );

    if (email === null || email.trim() === "") {
        return;
    }

    const branch = prompt(
        "Enter student branch:",
        currentBranch
    );

    if (branch === null || branch.trim() === "") {
        return;
    }

    const updatedStudent = {
        name: name.trim(),
        email: email.trim(),
        branch: branch.trim()
    };

    fetch("/students/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedStudent)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            return response.json();
        })
        .then(data => {

            alert("Student updated successfully!");

            loadStudents();
        })
        .catch(error => {

            console.error("Update Student Error:", error);

            alert(
                "Error updating student: " +
                error.message
            );
        });
}


function deleteStudent(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    fetch("/students/" + id, {

        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to delete student"
                );
            }

            return response.text();
        })
        .then(message => {

            alert("Student deleted successfully!");

            loadStudents();
        })
        .catch(error => {

            console.error("Delete Student Error:", error);

            alert(
                "Error deleting student: " +
                error.message
            );
        });
}


function addStudent(event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("studentName").value,
        email: document.getElementById("studentEmail").value,
        branch: document.getElementById("studentBranch").value
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
                throw new Error("Failed to add student");
            }

            return response.json();
        })
        .then(data => {

            alert("Student added successfully!");

            document.getElementById("studentForm").reset();

            loadStudents();
        })
        .catch(error => {

            console.error(error);

            alert("Error adding student");
        });
}


// ================= COMPANIES =================

function loadCompanies() {

    fetch("/companies")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load companies");
            }

            return response.json();
        })
        .then(companies => {

            const companyList =
                document.getElementById("companyList");

            companyList.innerHTML = "";

            if (companies.length === 0) {

                companyList.innerHTML =
                    "<p>No companies found.</p>";

                return;
            }

            companies.forEach(company => {

                companyList.innerHTML += `
                    <div>
                        <p>
                            <b>ID:</b> ${company.id}<br>
                            <b>Name:</b> ${company.name}<br>
                            <b>Location:</b> ${company.location}<br>
                            <b>Role:</b> ${company.role}
                        </p>

                        <button type="button"
                            onclick="editCompany(
                                ${company.id},
                                '${company.name}',
                                '${company.location}',
                                '${company.role}'
                            )">
                            Edit
                        </button>

                        <button type="button"
                            onclick="deleteCompany(${company.id})">
                            Delete
                        </button>

                        <hr>
                    </div>
                `;
            });
        })
        .catch(error => {

            console.error("Company Error:", error);

            alert("Error loading companies");
        });
}


function editCompany(id, currentName, currentLocation, currentRole) {

    const name = prompt(
        "Enter company name:",
        currentName
    );

    if (name === null || name.trim() === "") {
        return;
    }

    const location = prompt(
        "Enter company location:",
        currentLocation
    );

    if (location === null || location.trim() === "") {
        return;
    }

    const role = prompt(
        "Enter company role:",
        currentRole
    );

    if (role === null || role.trim() === "") {
        return;
    }

    const updatedCompany = {
        name: name.trim(),
        location: location.trim(),
        role: role.trim()
    };

    fetch("/companies/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedCompany)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            return response.json();
        })
        .then(() => {

            alert("Company updated successfully!");

            loadCompanies();
        })
        .catch(error => {

            console.error("Update Company Error:", error);

            alert(
                "Error updating company: " +
                error.message
            );
        });
}


function deleteCompany(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this company?"
    );

    if (!confirmed) {
        return;
    }

    fetch("/companies/" + id, {

        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to delete company");
            }

            return response.text();
        })
        .then(() => {

            alert("Company deleted successfully!");

            loadCompanies();
        })
        .catch(error => {

            console.error("Delete Company Error:", error);

            alert(
                "Error deleting company: " +
                error.message
            );
        });
}


function addCompany(event) {

    event.preventDefault();

    const company = {
        name: document.getElementById("companyName").value.trim(),
        location: document.getElementById("companyLocation").value.trim(),
        role: document.getElementById("companyRole").value.trim()
    };

    fetch("/companies", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(company)
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to add company");
            }

            return response.json();
        })
        .then(data => {

            alert("Company added successfully!");

            document.getElementById("companyForm").reset();

            loadCompanies();
        })
        .catch(error => {

            console.error(error);

            alert("Error adding company");
        });
}


// ================= JOBS =================

function loadJobs() {

    fetch("/jobs")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();
        })
        .then(jobs => {

            const jobList =
                document.getElementById("jobList");

            jobList.innerHTML = "";

            if (jobs.length === 0) {

                jobList.innerHTML =
                    "<p>No jobs found.</p>";

                return;
            }

            jobs.forEach(job => {

                jobList.innerHTML += `
                    <div>
                        <p>
                            <b>ID:</b> ${job.id}<br>
                            <b>Title:</b> ${job.title}<br>
                            <b>Description:</b> ${job.description}<br>
                            <b>Location:</b> ${job.location}<br>
                            <b>Company:</b>
                            ${job.company ? job.company.name : "Not assigned"}
                        </p>

                        <button type="button"
                            onclick="editJob(
                                ${job.id},
                                '${job.title}',
                                '${job.description}',
                                '${job.location}'
                            )">
                            Edit
                        </button>

                        <button type="button"
                            onclick="deleteJob(${job.id})">
                            Delete
                        </button>

                        <hr>
                    </div>
                `;
            });
        })
        .catch(error => {

            console.error("Job Error:", error);

            alert("Error loading jobs");
        });
}


function editJob(
    id,
    currentTitle,
    currentDescription,
    currentLocation
) {

    const title = prompt(
        "Enter job title:",
        currentTitle
    );

    if (title === null || title.trim() === "") {
        return;
    }

    const description = prompt(
        "Enter job description:",
        currentDescription
    );

    if (description === null || description.trim() === "") {
        return;
    }

    const location = prompt(
        "Enter job location:",
        currentLocation
    );

    if (location === null || location.trim() === "") {
        return;
    }

    const updatedJob = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim()
    };

    fetch("/jobs/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedJob)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            return response.json();
        })
        .then(() => {

            alert("Job updated successfully!");

            loadJobs();
        })
        .catch(error => {

            console.error("Update Job Error:", error);

            alert(
                "Error updating job: " +
                error.message
            );
        });
}


function deleteJob(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
        return;
    }

    fetch("/jobs/" + id, {

        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to delete job"
                );
            }

            return response.text();
        })
        .then(message => {

            alert("Job deleted successfully!");

            loadJobs();
        })
        .catch(error => {

            console.error("Delete Job Error:", error);

            alert(
                "Error deleting job: " +
                error.message
            );
        });
}


// ================= ADD JOB =================

function addJob(event) {

    event.preventDefault();

    const job = {

        title:
            document.getElementById("jobTitle").value.trim(),

        description:
            document.getElementById("jobDescription").value.trim(),

        location:
            document.getElementById("jobLocation").value.trim()
    };

    fetch("/jobs", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(job)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            return response.json();
        })
        .then(data => {

            alert("Job added successfully!");

            document.getElementById("jobForm").reset();

            loadJobs();
        })
        .catch(error => {

            console.error("Add Job Error:", error);

            alert(
                "Error adding job: " +
                error.message
            );
        });
}


// ================= APPLICATIONS =================

function loadApplications() {

    fetch("/applications")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load applications");
            }

            return response.json();
        })
        .then(applications => {

            console.log(
                "Applications received:",
                applications
            );

            const applicationList =
                document.getElementById("applicationList");

            if (!applicationList) {
                throw new Error(
                    "applicationList element not found"
                );
            }

            applicationList.innerHTML = "";

            if (applications.length === 0) {

                applicationList.innerHTML =
                    "<p>No applications found.</p>";

                return;
            }

            applications.forEach(application => {

                const studentName =
                    application.student
                        ? application.student.name
                        : "Not assigned";

                const studentId =
                    application.student
                        ? application.student.id
                        : "";

                const jobTitle =
                    application.job
                        ? application.job.title
                        : "Not assigned";

                const jobId =
                    application.job
                        ? application.job.id
                        : "";

                applicationList.innerHTML += `
                    <div>
                        <p>
                            <b>ID:</b> ${application.id}<br>

                            <b>Status:</b>
                            ${application.status}<br>

                            <b>Student:</b>
                            ${studentName}<br>

                            <b>Job:</b>
                            ${jobTitle}<br><br>

                            <button type="button"
                                onclick="editApplication(
                                    ${application.id},
                                    '${application.status}',
                                    ${studentId || "null"},
                                    ${jobId || "null"}
                                )">
                                Edit
                            </button>

                            <button type="button"
                                onclick="deleteApplication(${application.id})">
                                Delete
                            </button>
                        </p>

                        <hr>
                    </div>
                `;
            });
        })
        .catch(error => {

            console.error(
                "Load Applications Error:",
                error
            );

            alert(
                "Error loading applications: " +
                error.message
            );
        });
}


function addApplication() {

    const status =
        document
            .getElementById("applicationStatus")
            .value
            .trim();

    const studentId =
        document
            .getElementById("applicationStudentId")
            .value
            .trim();

    const jobId =
        document
            .getElementById("applicationJobId")
            .value
            .trim();

    if (
        status === "" ||
        studentId === "" ||
        jobId === ""
    ) {

        alert("Please fill all fields");

        return;
    }

    const application = {

        status:
            status.toUpperCase(),

        studentId:
            Number(studentId),

        jobId:
            Number(jobId)
    };

    fetch("/applications", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(application)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            return response.json();
        })
        .then(data => {

            alert(
                "Application added successfully!"
            );

            document
                .getElementById("applicationStatus")
                .value = "";

            document
                .getElementById("applicationStudentId")
                .value = "";

            document
                .getElementById("applicationJobId")
                .value = "";

            loadApplications();
        })
        .catch(error => {

            console.error(
                "Application Error:",
                error
            );

            alert(
                "Error: " +
                error.message
            );
        });
}


// ================= DELETE APPLICATION =================

function deleteApplication(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
        return;
    }

    fetch("/applications/" + id, {

        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to delete application"
                );
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

            console.error(error);

            alert(
                "Error deleting application"
            );
        });
}


// ================= EDIT APPLICATION =================

function editApplication(
    id,
    currentStatus,
    currentStudentId,
    currentJobId
) {

    const status = prompt(
        "Enter new status:\nAPPLIED / INTERVIEW / ACCEPTED / REJECTED",
        currentStatus
    );

    if (
        status === null ||
        status.trim() === ""
    ) {
        return;
    }

    const updatedApplication = {

        status:
            status.trim().toUpperCase(),

        studentId:
        currentStudentId,

        jobId:
        currentJobId
    };

    fetch("/applications/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedApplication)
    })
        .then(response => {

            if (!response.ok) {

                return response.text().then(text => {
                    throw new Error(text);
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


// ================= APPLICATION DROPDOWNS =================

function openApplications() {

    showSection("applications");

    loadApplicationStudents();

    loadApplicationJobs();
}


function loadApplicationStudents() {

    fetch("/students")
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load students"
                );
            }

            return response.json();
        })
        .then(students => {

            const select =
                document.getElementById(
                    "applicationStudentId"
                );

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

            console.error(error);

            alert(
                "Error loading students"
            );
        });
}


function loadApplicationJobs() {

    fetch("/jobs")
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load jobs"
                );
            }

            return response.json();
        })
        .then(jobs => {

            const select =
                document.getElementById(
                    "applicationJobId"
                );

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

            console.error(error);

            alert(
                "Error loading jobs"
            );
        });
}


// ================= DASHBOARD =================

function loadDashboard() {

    fetch("/students")
        .then(response => response.json())
        .then(students => {

            document
                .getElementById("totalStudents")
                .textContent =
                students.length;
        });

    fetch("/companies")
        .then(response => response.json())
        .then(companies => {

            document
                .getElementById("totalCompanies")
                .textContent =
                companies.length;
        });

    fetch("/jobs")
        .then(response => response.json())
        .then(jobs => {

            document
                .getElementById("totalJobs")
                .textContent =
                jobs.length;
        });

    fetch("/applications")
        .then(response => response.json())
        .then(applications => {

            document
                .getElementById("totalApplications")
                .textContent =
                applications.length;
        });
}


// ================= SEARCH STUDENTS =================

function searchStudents() {

    const searchText =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase();

    fetch("/students")
        .then(response => response.json())
        .then(students => {

            const studentList =
                document.getElementById(
                    "studentList"
                );

            studentList.innerHTML = "";

            students
                .filter(student =>
                    student.name
                        .toLowerCase()
                        .includes(searchText)
                )
                .forEach(student => {

                    studentList.innerHTML += `
                        <p>
                            <b>ID:</b> ${student.id}<br>
                            <b>Name:</b> ${student.name}<br>
                            <b>Email:</b> ${student.email}<br>
                            <b>Branch:</b> ${student.branch}
                        </p>

                        <hr>
                    `;
                });
        })
        .catch(error => {

            console.error(error);

            alert(
                "Error searching students"
            );
        });
}


// ================= SEARCH COMPANIES =================

function searchCompanies() {

    const searchText =
        document
            .getElementById("companySearch")
            .value
            .toLowerCase();

    fetch("/companies")
        .then(response => response.json())
        .then(companies => {

            const companyList =
                document.getElementById(
                    "companyList"
                );

            companyList.innerHTML = "";

            companies
                .filter(company =>
                    company.name
                        .toLowerCase()
                        .includes(searchText)
                )
                .forEach(company => {

                    companyList.innerHTML += `
                        <p>
                            <b>ID:</b> ${company.id}<br>
                            <b>Name:</b> ${company.name}<br>
                            <b>Location:</b> ${company.location}<br>
                            <b>Role:</b> ${company.role}
                        </p>

                        <hr>
                    `;
                });
        })
        .catch(error => {

            console.error(error);

            alert(
                "Error searching companies"
            );
        });
}


// ================= SEARCH JOBS =================

function searchJobs() {

    const searchText =
        document
            .getElementById("jobSearch")
            .value
            .toLowerCase();

    fetch("/jobs")
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to search jobs"
                );
            }

            return response.json();
        })
        .then(jobs => {

            const jobList =
                document.getElementById(
                    "jobList"
                );

            jobList.innerHTML = "";

            const filteredJobs =
                jobs.filter(job =>
                    job.title
                        .toLowerCase()
                        .includes(searchText)
                );

            if (filteredJobs.length === 0) {

                jobList.innerHTML =
                    "<p>No jobs found.</p>";

                return;
            }

            filteredJobs.forEach(job => {

                jobList.innerHTML += `
                    <div>
                        <p>
                            <b>ID:</b> ${job.id}<br>
                            <b>Title:</b> ${job.title}<br>
                            <b>Description:</b> ${job.description}<br>
                            <b>Location:</b> ${job.location}<br>
                            <b>Company:</b>
                            ${job.company
                    ? job.company.name
                    : "Not assigned"}
                        </p>

                        <hr>
                    </div>
                `;
            });
        })
        .catch(error => {

            console.error(
                "Job Search Error:",
                error
            );

            alert(
                "Error searching jobs"
            );
        });
}


// ================= FILTER APPLICATIONS =================

function filterApplications() {

    const selectedStatus =
        document
            .getElementById("applicationFilter")
            .value;

    fetch("/applications")
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load applications"
                );
            }

            return response.json();
        })
        .then(applications => {

            const applicationList =
                document.getElementById(
                    "applicationList"
                );

            applicationList.innerHTML = "";

            const filteredApplications =
                selectedStatus === "ALL"
                    ? applications
                    : applications.filter(
                        application =>
                            application.status ===
                            selectedStatus
                    );

            if (
                filteredApplications.length === 0
            ) {

                applicationList.innerHTML =
                    "<p>No applications found.</p>";

                return;
            }

            filteredApplications.forEach(
                application => {

                    applicationList.innerHTML += `
                        <p>
                            <b>ID:</b>
                            ${application.id}<br>

                            <b>Status:</b>
                            ${application.status}<br>

                            <b>Student:</b>
                            ${application.student
                        ? application.student.name
                        : "Not assigned"}<br>

                            <b>Job:</b>
                            ${application.job
                        ? application.job.title
                        : "Not assigned"}
                        </p>

                        <hr>
                    `;
                }
            );
        })
        .catch(error => {

            console.error(
                "Application Filter Error:",
                error
            );

            alert(
                "Error filtering applications"
            );
        });
}