function loadCompanyDetails() {

    const params = new URLSearchParams(
        window.location.search
    );

    const companyId = params.get("id");

    if (!companyId) {

        document.getElementById("companyDetails").innerHTML =
            "<p>Company ID is missing.</p>";

        return;
    }


    fetch("/student/company/" + companyId)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load company details"
                );
            }

            return response.json();
        })
        .then(company => {

            const companyDetails =
                document.getElementById("companyDetails");

            companyDetails.innerHTML = `
                <div class="company-card">

                    <h3>${company.name}</h3>

                    <p>
                        <b>Location:</b>
                        ${company.location}
                    </p>

                    <p>
                        <b>Role:</b>
                        ${company.role}
                    </p>

                </div>
            `;
        })
        .catch(error => {

            console.error(
                "Company Details Error:",
                error
            );

            document.getElementById("companyDetails").innerHTML =
                "<p>Error loading company details.</p>";
        });
}


// ================= BACK TO JOBS =================

function goBack() {

    window.location.href =
        "/student-jobs.html";
}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCompanyDetails();

    }
);