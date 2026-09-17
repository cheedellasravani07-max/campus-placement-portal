// ================= GET APPLICATION ID =================

function getApplicationId() {

    const params =
        new URLSearchParams(window.location.search);

    return params.get("applicationId");
}


// ================= SCHEDULE INTERVIEW =================

function scheduleInterview() {

    const applicationId =
        getApplicationId();


    if (!applicationId) {

        alert("Application ID is missing.");
        return;
    }


    const interviewDate =
        document.getElementById("interviewDate").value;

    const interviewTime =
        document.getElementById("interviewTime").value;

    const mode =
        document.getElementById("mode").value;

    const location =
        document.getElementById("location").value.trim();

    const meetingLink =
        document.getElementById("meetingLink").value.trim();


    // ================= VALIDATION =================

    if (interviewDate === "") {

        alert("Please select an interview date.");
        return;
    }


    if (interviewTime === "") {

        alert("Please select an interview time.");
        return;
    }


    if (mode === "") {

        alert("Please select an interview mode.");
        return;
    }


    if (mode === "OFFLINE" &&
        location === "") {

        alert("Please enter the interview location.");
        return;
    }


    if (mode === "ONLINE" &&
        meetingLink === "") {

        alert("Please enter the meeting link.");
        return;
    }


    // ================= CREATE REQUEST =================

    const interview = {

        interviewDate: interviewDate,

        interviewTime: interviewTime,

        mode: mode,

        location: location,

        meetingLink: meetingLink
    };


    // ================= SEND TO BACKEND =================

    fetch(
        "/interviews/application/" +
        applicationId,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(interview)
        }
    )
        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(text => {

                        throw new Error(text);

                    });
            }

            return response.json();
        })
        .then(data => {

            alert(
                "Interview scheduled successfully!"
            );

            window.location.href =
                "/admin-applications.html";
        })
        .catch(error => {

            console.error(
                "Interview Scheduling Error:",
                error
            );

            alert(
                "Error scheduling interview: " +
                error.message
            );
        });
}


// ================= BACK =================

function goBack() {

    window.location.href =
        "/admin-applications.html";
}