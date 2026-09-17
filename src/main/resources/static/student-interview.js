// ======================================================
// STUDENT MY INTERVIEWS
// ======================================================


function loadMyInterviews() {

    const interviewList =
        document.getElementById("interviewList");


    interviewList.innerHTML =
        "<p>Loading interviews...</p>";


    fetch("/interviews/student")
        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(
                            text ||
                            "Failed to load interviews"
                        );
                    });
            }

            return response.json();
        })


        .then(interviews => {

            console.log(
                "Student interviews:",
                interviews
            );


            // No interviews

            if (
                !interviews ||
                interviews.length === 0
            ) {

                interviewList.innerHTML =
                    "<p>No interviews scheduled.</p>";

                return;
            }


            // Clear loading message

            interviewList.innerHTML = "";


            // Display every interview

            interviews.forEach(interview => {

                const application =
                    interview.application;


                const job =
                    application &&
                    application.job
                        ? application.job
                        : null;


                const company =
                    job &&
                    job.company
                        ? job.company
                        : null;


                const jobTitle =
                    job
                        ? job.title
                        : "Not available";


                const companyName =
                    company
                        ? company.name
                        : "Not available";


                interviewList.innerHTML += `

                    <div class="interview-card">

                        <h3>
                            Interview Details
                        </h3>


                        <p>
                            <b>Application ID:</b>
                            ${application
                    ? application.id
                    : "N/A"}
                        </p>


                        <p>
                            <b>Job:</b>
                            ${jobTitle}
                        </p>


                        <p>
                            <b>Company:</b>
                            ${companyName}
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
                                    <a
                                        href="${interview.meetingLink}"
                                        target="_blank">
                                        Join Interview
                                    </a>
                                </p>
                              `
                        : `
                                <p>
                                    <b>Location:</b>
                                    ${interview.location}
                                </p>
                              `
                }

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

                    <b>
                        Error loading interviews.
                    </b>

                    <br>

                    ${error.message}

                </p>

            `;
        });
}


// ======================================================
// BACK TO DASHBOARD
// ======================================================

function goBack() {

    window.location.href =
        "/student-dashboard.html";
}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMyInterviews();

    }
);