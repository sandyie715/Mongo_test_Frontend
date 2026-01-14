console.log("SCRIPT LOADED ✅");

const API = "https://mongo-test-backend-mlxj.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    const list = document.getElementById("noteList");

    let editId = null;

    async function fetchNotes() {
        const res = await fetch(`${API}/notes`);
        const notes = await res.json();
        list.innerHTML = "";

        notes.forEach(note => {
            const li = document.createElement("li");
            li.innerHTML = `
                <b>${note.title}</b><br>
                ${note.content}<br>
                <button>Edit</button>
                <button>Delete</button>
            `;

            li.children[2].onclick = () => editNote(note);
            li.children[3].onclick = () => deleteNote(note.id);
            list.appendChild(li);
        });
    }

    async function addNote() {
        const payload = { title: title.value, content: content.value };

        if (editId) {
            await fetch(`${API}/notes/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            editId = null;
        } else {
            await fetch(`${API}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        title.value = "";
        content.value = "";
        fetchNotes();
    }

    async function deleteNote(id) {
        await fetch(`${API}/notes/${id}`, { method: "DELETE" });
        fetchNotes();
    }

    function editNote(note) {
        title.value = note.title;
        content.value = note.content;
        editId = note.id;
    }

    window.addNote = addNote;
    fetchNotes();
});
