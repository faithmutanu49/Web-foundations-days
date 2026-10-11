
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
    const text = noteText.value;
    const characters = text.length;
    const trimmedText = text.trim();
    const words = trimmedText === ""
        ? 0
        : trimmedText.split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.toggle("warning", characters > 180);
    charCount.classList.toggle("over", characters > 200);
}

function saveDraft() {
    localStorage.setItem("quickNotesDraft", noteText.value);
}

function clearNote() {
    noteText.value = "";
    localStorage.removeItem("quickNotesDraft");
    updateCounts();
}

noteText.addEventListener("input",updateCounts);
    updateCounts();
    saveDraft();

clearBtn.addEventListener("click", clearNote);

noteText.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearNote();
    }
});

noteText.value = localStorage.getItem("quickNotesDraft") || "";

const savedTheme = localStorage.getItem("quickNotesTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

function updateThemeLabel() {
    themeToggle.textContent = document.body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("quickNotesTheme", theme);
    updateThemeLabel();
});

updateThemeLabel();
updateCounts();