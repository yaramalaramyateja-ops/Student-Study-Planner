let sessions = JSON.parse(localStorage.getItem("studySessions")) || [];

let currentFilter = "All";

function addSession() {
    const subject = document.getElementById("subject").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const date = document.getElementById("date").value;
    const duration = document.getElementById("duration").value;

    if (subject === "" || topic === "" || date === "" || duration === "") {
        alert("Please fill all fields.");
        return;
    }

    const session = {
        id: Date.now(),
        subject: subject,
        topic: topic,
        date: date,
        duration: duration,
        completed: false
    };

    sessions.push(session);

    saveSessions();
    createFilterButtons();
    displaySessions();
    updateProgress();

    document.getElementById("subject").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("date").value = "";
    document.getElementById("duration").value = "";
}

function saveSessions() {
    localStorage.setItem("studySessions", JSON.stringify(sessions));
}

function displaySessions() {
    const sessionList = document.getElementById("sessionList");

    sessionList.innerHTML = "";

    const filteredSessions =
        currentFilter === "All"
            ? sessions
            : sessions.filter(session => session.subject === currentFilter);

    if (filteredSessions.length === 0) {
        sessionList.innerHTML = "<p>No study sessions found.</p>";
        return;
    }

    filteredSessions.forEach(session => {

        const sessionDiv = document.createElement("div");

        sessionDiv.className = "session";

        if (session.completed) {
            sessionDiv.classList.add("completed");
        }

      sessionDiv.innerHTML = `
    <h3>
        ${session.completed ? "✅" : "📖"}
        ${session.subject} - ${session.topic}
    </h3>

    <p>📅 Date: ${session.date}</p>

    <p>⏱️ Duration: ${session.duration} minutes</p>

    <button onclick="toggleCompleted(${session.id})">
        ${session.completed ? "Mark Pending" : "Mark Completed"}
    </button>

    <button onclick="deleteSession(${session.id})">
        Delete
    </button>
`;

        sessionList.appendChild(sessionDiv);
    });
}

function toggleCompleted(id) {

    const session = sessions.find(session => session.id === id);

    if (session) {
        session.completed = !session.completed;
    }

    saveSessions();
    displaySessions();
    updateProgress();
}

function deleteSession(id) {

    sessions = sessions.filter(session => session.id !== id);

    saveSessions();
    createFilterButtons();
    displaySessions();
    updateProgress();

    // If the selected subject no longer exists,
    // return to showing all sessions.
    const subjectStillExists = sessions.some(
        session => session.subject === currentFilter
    );

    if (currentFilter !== "All" && !subjectStillExists) {
        currentFilter = "All";
        createFilterButtons();
        displaySessions();
    }
}
function createFilterButtons() {
    const filterButtons = document.getElementById("filterButtons");

    filterButtons.innerHTML = "";

    // Always show All button
    const allButton = document.createElement("button");
    allButton.textContent = "All";
    allButton.onclick = () => filterSessions("All");
    filterButtons.appendChild(allButton);

    // Get unique subjects
    const subjects = [...new Set(
        sessions.map(session => session.subject)
    )];

    // Create one button for each subject
    subjects.forEach(subject => {
        const button = document.createElement("button");

        button.textContent = subject;

        button.onclick = () => filterSessions(subject);

        filterButtons.appendChild(button);
    });
}

function filterSessions(subject) {

    currentFilter = subject;

    displaySessions();
}

function updateProgress() {

    const total = sessions.length;

    const completed = sessions.filter(
        session => session.completed
    ).length;

    const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("progressText").textContent =
        `${completed} / ${total} completed`;

    document.getElementById("progressPercent").textContent =
        `${percentage}%`;

    document.getElementById("progressFill").style.width =
        `${percentage}%`;
}

createFilterButtons();
displaySessions();
updateProgress();