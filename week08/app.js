const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');
const savedTheme = localStorage.getItem('devforge-theme');

function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.dataset.theme = isLight ? 'light' : 'dark';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
}

applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('devforge-theme', nextTheme);
    applyTheme(nextTheme);
});

const timerDisplay = document.querySelector('[data-timer-display]');
const timerMode = document.querySelector('[data-timer-mode]');
const timerProgress = document.querySelector('[data-timer-progress]');
const timerStart = document.querySelector('[data-timer-start]');
const timerReset = document.querySelector('[data-timer-reset]');

const timerDurations = {
    focus: 25 * 60,
    break: 5 * 60
};

let timerType = 'focus';
let secondsRemaining = timerDurations[timerType];
let timerId = null;

function renderTimer() {
    const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    timerProgress.style.setProperty('--timer-progress', `${(1 - secondsRemaining / timerDurations[timerType]) * 100}%`);
    timerMode.textContent = timerType === 'focus' ? 'Focus' : 'Break';
    timerStart.textContent = timerId ? 'Pause' : 'Start';
}

function switchTimerMode() {
    timerType = timerType === 'focus' ? 'break' : 'focus';
    secondsRemaining = timerDurations[timerType];
    renderTimer();
}

function tickTimer() {
    secondsRemaining -= 1;
    if (secondsRemaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        switchTimerMode();
        return;
    }
    renderTimer();
}

timerStart.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        timerId = setInterval(tickTimer, 1000);
    }
    renderTimer();
});

timerReset.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    secondsRemaining = timerDurations[timerType];
    renderTimer();
});

const noteForm = document.querySelector('[data-note-form]');
const notesList = document.querySelector('[data-notes-list]');
const addNoteButton = document.querySelector('[data-add-note]');
const cancelNoteButton = document.querySelector('[data-cancel-note]');
const notesStorageKey = 'devforge-week08-notes';

function loadNotes() {
    try {
        const notes = JSON.parse(localStorage.getItem(notesStorageKey));
        return Array.isArray(notes) ? notes : [];
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    localStorage.setItem(notesStorageKey, JSON.stringify(notes));
}

function renderNotes() {
    const notes = loadNotes();
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'notes-empty';
        emptyState.textContent = 'No notes yet. Capture the next thought.';
        notesList.append(emptyState);
        return;
    }

    notes.forEach((note) => {
        const noteElement = document.createElement('article');
        noteElement.className = 'sticky-note';
        noteElement.dataset.noteId = note.id;

        const title = document.createElement('h4');
        title.textContent = note.title;
        const body = document.createElement('p');
        body.textContent = note.body;
        const deleteButton = document.createElement('button');
        deleteButton.className = 'note-delete';
        deleteButton.type = 'button';
        deleteButton.dataset.deleteNote = note.id;
        deleteButton.setAttribute('aria-label', `Delete ${note.title}`);
        deleteButton.textContent = 'Delete';

        noteElement.append(title, body, deleteButton);
        notesList.append(noteElement);
    });
}

addNoteButton.addEventListener('click', () => {
    noteForm.hidden = false;
    noteForm.elements.title.focus();
});

cancelNoteButton.addEventListener('click', () => {
    noteForm.reset();
    noteForm.hidden = true;
});

noteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(noteForm);
    const notes = loadNotes();

    notes.unshift({
        id: crypto.randomUUID(),
        title: String(formData.get('title')).trim(),
        body: String(formData.get('body')).trim()
    });

    saveNotes(notes);
    noteForm.reset();
    noteForm.hidden = true;
    renderNotes();
});

notesList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete-note]');
    if (!deleteButton) return;

    const notes = loadNotes().filter((note) => note.id !== deleteButton.dataset.deleteNote);
    saveNotes(notes);
    renderNotes();
});

renderTimer();
renderNotes();
