// ======================================================
// ADMIN - MANAGE INTERVIEWS
// ======================================================


// ================= LOAD INTERVIEWS =================

function loadInterviews() {

    const interviewList =
        document.getElementById("interviewList");

    interviewList.innerHTML =
        "<p>Loading interviews...</p>";


    fetch("/interviews")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })

        .then(interviews => {

            if (!interviews ||
                interviews.length === 0) {

                interviewList.innerHTML =
                    "<p>No interviews scheduled.</p>";

                return;
            }


            interviewList.innerHTML = "";


            interviews.forEach(interview => {

                const application =
                    interview.application;

                const student =
                    application
                        ? application.student
                        : null;

                const job =
                    application
                        ? application.job
                        : null;

                const company =
                    job
                        ? job.company
                        : null;


                interviewList.innerHTML += `

                    <div class="interview-card">

                        <h3>
                            Interview #${interview.id}
                        </h3>

                        <p>
                            <b>Student:</b>
                            ${student
                    ? student.name
                    : "Not available"}
                        </p>

                        <p>
                            <b>Email:</b>
                            ${student
                    ? student.email
                    : "Not available"}
                        </p>

                        <p>
                            <b>Company:</b>
                            ${company
                    ? company.name
                    : "Not available"}
                        </p>

                        <p>
                            <b>Job:</b>
                            ${job
                    ? job.title
                    : "Not available"}
                        </p>

                        <p>
                            <b>Date:</b>
                            ${interview.interviewDate}
                        </p>

                        <p>
                            <b>Time:</b>
                            ${interview.interviewTime}
                        </p>

                        <p>
                            <b>Mode:</b>
                            ${interview.mode}
                        </p>

                        ${
                    interview.mode === "ONLINE"

                        ? `
                                <p>
                                    <b>Meeting Link:</b>
                                    ${interview.meetingLink || "Not provided"}
                                </p>
                              `

                        : `
                                <p>
                                    <b>Location:</b>
                                    ${interview.location || "Not provided"}
                                </p>
                              `
                }


                        <button
                            type="button"
                            onclick='editInterview(${JSON.stringify(interview)})'>

                            Edit

                        </button>


                        <button
                            type="button"
                            onclick="deleteInterview(${interview.id})">

                            Delete

                        </button>

                    </div>

                    <hr>

                `;
            });
        })

        .catch(error => {

            console.error(
                "Interview loading error:",
                error
            );

            interviewList.innerHTML = `

                <p>
                    <b>Error loading interviews.</b>
                    <br>
                    ${error.message}
                </p>

            `;
        });
}



// ======================================================
// EDIT INTERVIEW
// ======================================================

function editInterview(interview) {

    const interviewList =
        document.getElementById("interviewList");


    interviewList.innerHTML = `

        <div class="edit-interview-card">

            <h2>
                Edit Interview #${interview.id}
            </h2>


            <p>
                <b>Student:</b>
                ${
        interview.application &&
        interview.application.student
            ? interview.application.student.name
            : "Not available"
    }
            </p>


            <p>
                <b>Company:</b>
                ${
        interview.application &&
        interview.application.job &&
        interview.application.job.company
            ? interview.application.job.company.name
            : "Not available"
    }
            </p>


            <p>
                <b>Job:</b>
                ${
        interview.application &&
        interview.application.job
            ? interview.application.job.title
            : "Not available"
    }
            </p>


            <label for="editDate">
                Interview Date
            </label>

            <input
                type="date"
                id="editDate"
                value="${interview.interviewDate || ""}"
            >


            <label for="editTime">
                Interview Time
            </label>

            <input
                type="time"
                id="editTime"
                value="${
        interview.interviewTime
            ? interview.interviewTime.substring(0, 5)
            : ""
    }"
            >


            <label for="editMode">
                Interview Mode
            </label>

            <select id="editMode">

                <option
                    value="ONLINE"
                    ${
        interview.mode === "ONLINE"
            ? "selected"
            : ""
    }>

                    ONLINE

                </option>


                <option
                    value="OFFLINE"
                    ${
        interview.mode === "OFFLINE"
            ? "selected"
            : ""
    }>

                    OFFLINE

                </option>

            </select>


            <label for="editLocation">
                Location
            </label>

            <input
                type="text"
                id="editLocation"
                value="${interview.location || ""}"
                placeholder="Enter location"
            >


            <label for="editMeetingLink">
                Meeting Link
            </label>

            <input
                type="text"
                id="editMeetingLink"
                value="${interview.meetingLink || ""}"
                placeholder="Enter meeting link"
            >


            <br><br>


            <button
                type="button"
                onclick="saveEditedInterview(${interview.id})">

                Update Interview

            </button>


            <button
                type="button"
                onclick="cancelEdit()">

                Cancel

            </button>

        </div>

    `;
}



// ======================================================
// SAVE EDITED INTERVIEW
// ======================================================

function saveEditedInterview(id) {

    const date =
        document.getElementById("editDate").value;

    const time =
        document.getElementById("editTime").value;

    const mode =
        document.getElementById("editMode").value;

    const location =
        document.getElementById("editLocation").value.trim();

    const meetingLink =
        document.getElementById("editMeetingLink").value.trim();


    // ================= VALIDATION =================

    if (date === "") {

        alert(
            "Please select an interview date."
        );

        return;
    }


    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {

        alert(
            "Invalid date format.\nUse YYYY-MM-DD."
        );

        return;
    }


    if (time === "") {

        alert(
            "Please select an interview time."
        );

        return;
    }


    if (!time.match(/^\d{2}:\d{2}$/)) {

        alert(
            "Invalid time format.\nUse HH:MM."
        );

        return;
    }


    const selectedMode =
        mode.trim().toUpperCase();


    if (
        selectedMode !== "ONLINE" &&
        selectedMode !== "OFFLINE"
    ) {

        alert(
            "Mode must be ONLINE or OFFLINE."
        );

        return;
    }


    if (
        selectedMode === "OFFLINE" &&
        location === ""
    ) {

        alert(
            "Please enter the interview location."
        );

        return;
    }


    if (
        selectedMode === "ONLINE" &&
        meetingLink === ""
    ) {

        alert(
            "Please enter the meeting link."
        );

        return;
    }


    // ================= UPDATED DATA =================

    const updatedInterview = {

        interviewDate: date,

        interviewTime: time + ":00",

        mode: selectedMode,

        location: location,

        meetingLink: meetingLink
    };


    // ================= CONFIRM =================

    const confirmUpdate =
        confirm(
            "Do you want to update this interview?"
        );


    if (!confirmUpdate) {

        return;
    }


    // ================= SEND UPDATE =================

    fetch(
        "/interviews/" + id,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(updatedInterview)
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to update interview"
                        );
                    });
            }

            return response.json();
        })

        .then(updatedInterview => {

            alert(
                "Interview updated successfully!"
            );

            loadInterviews();
        })

        .catch(error => {

            console.error(
                "Interview update error:",
                error
            );

            alert(
                "Error updating interview:\n" +
                error.message
            );
        });
}



// ======================================================
// CANCEL EDIT
// ======================================================

function cancelEdit() {

    loadInterviews();
}



// ======================================================
// DELETE INTERVIEW
// ======================================================

function deleteInterview(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this interview?"
        );


    if (!confirmed) {

        return;
    }


    fetch(
        "/interviews/" + id,
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
                            "Failed to delete interview"
                        );
                    });
            }

            return response.text();
        })

        .then(message => {

            alert(
                "Interview deleted successfully!"
            );

            loadInterviews();
        })

        .catch(error => {

            console.error(
                "Interview delete error:",
                error
            );

            alert(
                "Error deleting interview: " +
                error.message
            );
        });
}



// ======================================================
// BACK TO ADMIN DASHBOARD
// ======================================================

function goBack() {

    window.location.href =
        "/admin-dashboard.html";
}



// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadInterviews();

    }
);