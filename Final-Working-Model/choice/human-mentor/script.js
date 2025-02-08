// Get references to the elements
const roleDropdown = document.getElementById("role");
const requestButton = document.getElementById("requestBtn");

// Add an event listener to the role dropdown
roleDropdown.addEventListener("change", function () {
    if (roleDropdown.value === "mentor") {
        requestButton.innerHTML = "Go Online";
    } else {
        requestButton.innerHTML = "Request Mentor";
    }
});

// Add an event listener to the request button
requestButton.addEventListener("click", function () {
    const role = roleDropdown.value;
    const category = document.getElementById("category").value;
    const statusDiv = document.getElementById("status");

    // Define Google Meet links for each category
    const meetLinks = {
        animation: "https://meet.google.com/zbi-yixj-zkn",
        sports: "https://meet.google.com/bdy-gtas-okq",
        esports: "https://meet.google.com/ngn-xdvp-zes"
    };

    if (role === "mentor") {
        // Mentor goes online
        localStorage.setItem(`mentor_${category}`, "online");
        const meetLink = meetLinks[category];
        statusDiv.innerHTML = `You are now available as a mentor! Share this link: <a href="${meetLink}" target="_blank" style="color:blue";>${meetLink}</a>`;
    } else {
        // User checks for mentor availability
        const isMentorAvailable = localStorage.getItem(`mentor_${category}`) === "online";

        if (isMentorAvailable) {
            const meetLink = meetLinks[category];
            statusDiv.innerHTML = `Mentor is available! <a href="${meetLink}" target="_blank" style="color:blue;border: 2px solid black;margin-left:37em;margin-right:37em;padding:5px;border-radius:15px;">Join Google Meet</a>`;
        } else {
            statusDiv.innerHTML = "Mentor is not available at the moment. Please try again later.";
        }
    }
});
