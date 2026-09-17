// ================= LOAD PROFILE =================

function loadProfile() {

    fetch("/student/profile", {
        method: "GET",
        cache: "no-store"
    })

        .then(async response => {

            const text = await response.text();

            console.log("Profile response status:", response.status);
            console.log("Profile response:", text);

            if (!response.ok) {

                throw new Error(
                    text ||
                    "Server returned status " +
                    response.status
                );
            }

            return JSON.parse(text);
        })

        .then(student => {

            console.log("Student profile:", student);

            // -------- EXISTING FIELDS --------

            document.getElementById("name").value =
                student.name || "";

            document.getElementById("email").value =
                student.email || "";

            document.getElementById("branch").value =
                student.branch || "";


            // -------- PROFILE FIELDS --------

            document.getElementById("phone").value =
                student.phone || "";

            document.getElementById("rollNumber").value =
                student.rollNumber || "";

            document.getElementById("cgpa").value =
                student.cgpa ?? "";

            document.getElementById("graduationYear").value =
                student.graduationYear ?? "";

            document.getElementById("skills").value =
                student.skills || "";


            // -------- PROFILE PHOTO --------

            if (student.profilePhoto) {

                const preview =
                    document.getElementById(
                        "profilePhotoPreview"
                    );

                preview.src =
                    "/student/profile/photo/view?" +
                    new Date().getTime();

                preview.style.display = "block";
            }


            // -------- LOAD RESUME --------

            loadResume();

        })

        .catch(error => {

            console.error(
                "Profile loading error:",
                error
            );

            alert(
                "Unable to load profile.\n\n" +
                error.message
            );
        });
}



// ================= UPDATE PROFILE =================

function updateProfile() {

    const name =
        document.getElementById("name")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const branch =
        document.getElementById("branch")
            .value
            .trim();

    const phone =
        document.getElementById("phone")
            .value
            .trim();

    const rollNumber =
        document.getElementById("rollNumber")
            .value
            .trim();

    const cgpaValue =
        document.getElementById("cgpa")
            .value
            .trim();

    const graduationYearValue =
        document.getElementById("graduationYear")
            .value
            .trim();

    const skills =
        document.getElementById("skills")
            .value
            .trim();


    // ================= VALIDATION =================

    if (name === "") {
        alert("Name is required.");
        return;
    }

    if (email === "") {
        alert("Email is required.");
        return;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        return;
    }


    if (branch === "") {
        alert("Branch is required.");
        return;
    }


    if (phone === "") {

        alert(
            "Phone number is required."
        );

        return;
    }


    const phonePattern =
        /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return;
    }


    if (rollNumber === "") {

        alert(
            "Roll number is required."
        );

        return;
    }


    if (cgpaValue !== "") {

        const cgpa =
            Number(cgpaValue);

        if (
            Number.isNaN(cgpa) ||
            cgpa < 0 ||
            cgpa > 10
        ) {

            alert(
                "CGPA must be between 0 and 10."
            );

            return;
        }
    }


    if (graduationYearValue !== "") {

        const graduationYear =
            Number(graduationYearValue);

        if (
            Number.isNaN(graduationYear) ||
            graduationYear < 2000 ||
            graduationYear > 2100
        ) {

            alert(
                "Please enter a valid graduation year."
            );

            return;
        }
    }


    if (skills === "") {

        alert(
            "Skills are required."
        );

        return;
    }


    // ================= UPDATED STUDENT =================

    const updatedStudent = {

        name: name,

        email: email,

        branch: branch,

        phone: phone,

        rollNumber: rollNumber,

        cgpa:
            cgpaValue === ""
                ? null
                : Number(cgpaValue),

        graduationYear:
            graduationYearValue === ""
                ? null
                : Number(graduationYearValue),

        skills: skills
    };


    // ================= SEND TO BACKEND =================

    fetch("/student/profile", {

        method: "PUT",

        headers: {
            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(
                updatedStudent
            )

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to update profile"
                        );
                    });
            }

            return response.json();
        })

        .then(student => {

            document.getElementById("name").value =
                student.name || "";

            document.getElementById("email").value =
                student.email || "";

            document.getElementById("branch").value =
                student.branch || "";

            document.getElementById("phone").value =
                student.phone || "";

            document.getElementById("rollNumber").value =
                student.rollNumber || "";

            document.getElementById("cgpa").value =
                student.cgpa ?? "";

            document.getElementById("graduationYear").value =
                student.graduationYear ?? "";

            document.getElementById("skills").value =
                student.skills || "";


            alert(
                "Profile updated successfully!"
            );
        })

        .catch(error => {

            console.error(
                "Profile update error:",
                error
            );

            alert(
                "Error updating profile: " +
                error.message
            );
        });
}


// ================= UPLOAD PROFILE PHOTO =================

function uploadProfilePhoto() {

    const fileInput =
        document.getElementById(
            "profilePhoto"
        );

    const file =
        fileInput.files[0];


    if (!file) {

        alert(
            "Please select a profile photo."
        );

        return;
    }


    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Only JPG, JPEG and PNG files are allowed."
        );

        return;
    }


    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Profile photo must be less than 5 MB."
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    fetch(
        "/student/profile/photo",
        {
            method: "POST",
            body: formData
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to upload profile photo"
                        );
                    });
            }

            return response.json();
        })

        .then(student => {

            const preview =
                document.getElementById(
                    "profilePhotoPreview"
                );


            preview.src =
                "/student/profile/photo/view?" +
                new Date().getTime();

            preview.style.display =
                "block";


            fileInput.value = "";


            alert(
                "Profile photo uploaded successfully!"
            );
        })

        .catch(error => {

            console.error(
                "Profile Photo Error:",
                error
            );

            alert(
                "Error uploading profile photo: " +
                error.message
            );
        });
}


// ============================================================
// ================= RESUME FUNCTIONS ========================
// ============================================================


// ================= LOAD RESUME =================

function loadResume() {

    fetch("/student/resume", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (response.status === 404) {

                showNoResume();

                return null;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to load resume"
                );
            }


            return response.json();
        })

        .then(resume => {

            if (!resume) {
                return;
            }


            displayResume(resume);
        })

        .catch(error => {

            console.error(
                "Resume loading error:",
                error
            );

            showNoResume();
        });
}


// ================= DISPLAY RESUME =================

function displayResume(resume) {

    const resumeName =
        document.getElementById(
            "resumeName"
        );

    const viewButton =
        document.getElementById(
            "viewResumeButton"
        );

    const downloadButton =
        document.getElementById(
            "downloadResumeButton"
        );

    const deleteButton =
        document.getElementById(
            "deleteResumeButton"
        );


    resumeName.textContent =
        "Current Resume: " +
        (resume.fileName || "Resume uploaded");


    viewButton.style.display =
        "inline-block";

    downloadButton.style.display =
        "inline-block";

    deleteButton.style.display =
        "inline-block";
}


// ================= NO RESUME =================

function showNoResume() {

    const resumeName =
        document.getElementById(
            "resumeName"
        );

    const viewButton =
        document.getElementById(
            "viewResumeButton"
        );

    const downloadButton =
        document.getElementById(
            "downloadResumeButton"
        );

    const deleteButton =
        document.getElementById(
            "deleteResumeButton"
        );


    resumeName.textContent =
        "No resume uploaded yet.";


    viewButton.style.display =
        "none";

    downloadButton.style.display =
        "none";

    deleteButton.style.display =
        "none";
}


// ================= UPLOAD RESUME =================

function uploadResume() {

    const fileInput =
        document.getElementById(
            "resumeFile"
        );

    const file =
        fileInput.files[0];


    if (!file) {

        alert(
            "Please select a resume."
        );

        return;
    }


    // -------- PDF ONLY --------

    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        alert(
            "Only PDF resume files are allowed."
        );

        return;
    }


    // -------- FILE SIZE --------

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Resume must be less than 5 MB."
        );

        return;
    }


    // ================= FORM DATA =================

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    // ================= UPLOAD =================

    fetch(
        "/student/resume",
        {
            method: "POST",
            body: formData
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to upload resume"
                        );
                    });
            }

            return response.json();
        })

        .then(resume => {

            displayResume(resume);

            fileInput.value = "";


            alert(
                "Resume uploaded successfully!"
            );
        })

        .catch(error => {

            console.error(
                "Resume Upload Error:",
                error
            );

            alert(
                "Error uploading resume: " +
                error.message
            );
        });
}


// ================= VIEW RESUME =================

function viewResume() {

    window.open(
        "/student/resume/download",
        "_blank"
    );
}


// ================= DOWNLOAD RESUME =================

function downloadResume() {

    window.location.href =
        "/student/resume/download";
}


// ================= DELETE RESUME =================

function deleteResume() {

    const confirmed =
        confirm(
            "Are you sure you want to delete your resume?"
        );


    if (!confirmed) {
        return;
    }


    fetch(
        "/student/resume",
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
                            "Failed to delete resume"
                        );
                    });
            }


            return response.text();
        })

        .then(message => {

            showNoResume();


            alert(
                message ||
                "Resume deleted successfully!"
            );
        })

        .catch(error => {

            console.error(
                "Resume Delete Error:",
                error
            );

            alert(
                "Error deleting resume: " +
                error.message
            );
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

        loadProfile();

    }
);