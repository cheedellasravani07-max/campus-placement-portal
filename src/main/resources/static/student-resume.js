// ======================================================
// STUDENT - MY RESUME
// ======================================================


// ================= LOAD CURRENT RESUME =================

function loadResume() {

    const currentResume =
        document.getElementById("currentResume");

    currentResume.innerHTML =
        "<h3>Current Resume</h3><p>Checking resume...</p>";


    fetch("/student/resume", {
        method: "GET",
        cache: "no-store"
    })

        .then(response => {

            if (response.status === 404) {

                currentResume.innerHTML = `
                    <h3>Current Resume</h3>

                    <p>
                        No resume uploaded yet.
                    </p>
                `;

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


            currentResume.innerHTML = `

                <h3>
                    Current Resume
                </h3>

                <p>
                    <b>File Name:</b>
                    ${resume.fileName}
                </p>

                <p>
                    <b>File Type:</b>
                    ${resume.fileType || "Unknown"}
                </p>


                <button
                    type="button"
                    onclick="downloadResume()">

                    Download Resume

                </button>


                <button
                    type="button"
                    onclick="deleteResume()">

                    Delete Resume

                </button>

            `;
        })

        .catch(error => {

            console.error(
                "Resume loading error:",
                error
            );

            currentResume.innerHTML = `

                <h3>
                    Current Resume
                </h3>

                <p>
                    Error loading resume.
                </p>

            `;
        });
}



// ================= UPLOAD RESUME =================

function uploadResume() {

    const fileInput =
        document.getElementById("resumeFile");

    const file =
        fileInput.files[0];


    if (!file) {

        alert(
            "Please select a resume file."
        );

        return;
    }


    const fileName =
        file.name.toLowerCase();


    // ================= FILE TYPE CHECK =================

    if (
        !fileName.endsWith(".pdf") &&
        !fileName.endsWith(".doc") &&
        !fileName.endsWith(".docx")
    ) {

        alert(
            "Only PDF, DOC and DOCX files are allowed."
        );

        return;
    }


    // ================= FILE SIZE CHECK =================

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Resume file must be smaller than 5 MB."
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    fetch("/student/resume", {

        method: "POST",

        body: formData

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        console.error(
                            "Server response:",
                            text
                        );

                        throw new Error(
                            "HTTP " + response.status +
                            " : " +
                            (text || "Failed to upload resume")
                        );
                    });
            }

            return response.json();
        })

        .then(resume => {

            alert(
                "Resume uploaded successfully!"
            );


            fileInput.value = "";


            loadResume();
        })

        .catch(error => {

            console.error(
                "Resume upload error:",
                error
            );

            alert(
                "Error uploading resume: " +
                error.message
            );
        });
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


    fetch("/student/resume", {

        method: "DELETE"

    })

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

            alert(
                "Resume deleted successfully!"
            );


            loadResume();
        })

        .catch(error => {

            console.error(
                "Resume delete error:",
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

        loadResume();

    }
);