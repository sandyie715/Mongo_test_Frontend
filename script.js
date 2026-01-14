console.log("SCRIPT LOADED ✅");

const API = "https://mongo-test-backend-mlxj.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const list = document.getElementById("noteList");

    let editId = null;

    // ================= FETCH NOTES =================
    async function fetchNotes() {
        try {
            const res = await fetch(`${API}/notes`);
            if (!res.ok) throw new Error("Failed to fetch notes");

            const notes = await res.json();
            list.innerHTML = "";

            notes.forEach(note => {
                const li = document.createElement("li");

                const titleEl = document.createElement("b");
                titleEl.textContent = note.title;

                const contentEl = document.createElement("p");
                contentEl.textContent = note.content;

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.onclick = () => editNote(note);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.onclick = () => deleteNote(note.id);

                li.append(titleEl, contentEl, editBtn, deleteBtn);
                list.appendChild(li);
            });
        } catch (err) {
            console.error(err);
            alert("Error loading notes");
        }
    }

    // ================= ADD / UPDATE NOTE =================
    async function addNote() {
        const payload = {
            title: titleInput.value.trim(),
            content: contentInput.value.trim()
        };

        if (!payload.title || !payload.content) {
            alert("Title and Content are required");
            return;
        }

        try {
            if (editId) {
                // UPDATE
                await fetch(`${API}/notes/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                editId = null;
            } else {
                // CREATE
                await fetch(`${API}/notes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            titleInput.value = "";
            contentInput.value = "";
            fetchNotes();
        } catch (err) {
            console.error(err);
            alert("Failed to save note");
        }
    }

    // ================= DELETE NOTE =================
    async function deleteNote(id) {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            await fetch(`${API}/notes/${id}`, { method: "DELETE" });
            fetchNotes();
        } catch (err) {
            console.error(err);
            alert("Failed to delete note");
        }
    }

    // ================= EDIT NOTE =================
    function editNote(note) {
        titleInput.value = note.title;
        contentInput.value = note.content;
        editId = note.id;
    }

    // Expose function to HTML button
    window.addNote = addNote;

    // Initial Load
    fetchNotes();
});
