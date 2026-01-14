const API = "https://mongo-test-backend-mlxj-my62aonbi-sanjay-d-ks-projects.vercel.app";

const title = document.getElementById("title");
const content = document.getElementById("content");

let editId = null;

async function fetchNotes() {
    const res = await fetch(`${API}/notes`);
    if (!res.ok) {
        alert("Failed to fetch notes");
        return;
    }
    const notes = await res.json();

    const list = document.getElementById("noteList");
    list.innerHTML = "";

    notes.forEach(note => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${note.title}</b><br>
            ${note.content}<br>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector(".edit-btn").onclick = () =>
            editNote(note.id, note.title, note.content);

        li.querySelector(".delete-btn").onclick = () =>
            deleteNote(note.id);

        list.appendChild(li);
    });
}

async function addNote() {
    const payload = {
        title: title.value,
        content: content.value
    };

    if (editId) {
        await fetch(`${API}/notes/${editId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        editId = null;
    } else {
        await fetch(`${API}/notes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
    }

    title.value = "";
    content.value = "";
    fetchNotes();
}

function editNote(id, titleVal, contentVal) {
    title.value = titleVal;
    content.value = contentVal;
    editId = id;
}

async function deleteNote(id) {
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    fetchNotes();
}

fetchNotes();
