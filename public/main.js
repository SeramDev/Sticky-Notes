// -----Variables-----
var form = document.getElementById("add-frm");
var items = document.getElementById("items");
var ntitle = document.getElementById("n-title");
var nbody = document.getElementById("n-body");
var tableDiv = document.getElementById("tbl-div");
var search = document.getElementById("srch");
var resetBtn = document.getElementById("reset");
var saveBtn = document.getElementById("save");

var selectedNoteID = null;
var noteCount = 0;
var newNote = "";
var isUpdate = false;
var record = "";
var note = "";
var body = "";

// -----Events-----
// For Page Loads
// window.onload = updateTable;
window.addEventListener("load", async () => {
  await getNotes();
});

//add notes
saveBtn.addEventListener("click", createNote);

// For Search
search.addEventListener("keyup", searchNotes);

// For Reset
resetBtn.addEventListener("click", resetAll);

// -----Functions-----

// Update table
function updateTable() {
  // Display the table when notes get added
  if (noteCount > 0) {
    tableDiv.style.display = "block";

    // Update note
    if (isUpdate) {
      note.firstChild.textContent = ntitle.value;
      note.lastChild.textContent = nbody.value;
    }
    // Add a new note
    else {
      items.innerHTML = newNote;
    }
  } else {
    tableDiv.style.display = "none";
  }
}

// Search Notes
function searchNotes(e) {
  // Text to lower case
  var searchTxt = e.target.value.toLowerCase();

  // Get list(HTML Collection)
  var list = items.getElementsByClassName("item");

  // Convert to an array
  var listArr = Array.from(list);
  listArr.forEach(function (item) {
    // Get title
    var noteTitle = item.children[0].firstChild.textContent;
    // Match
    if (noteTitle.toLowerCase().startsWith(searchTxt)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Reset All
function resetAll() {
  ntitle.value = "";
  nbody.value = "";
  isUpdate = false;
  newNote = "";
  saveBtn.textContent = "Save";
  selectedNoteID = null;
}

async function getNotes() {
  const response = await fetch("/notes");
  const notes = await response.json();
  noteCount = notes.length;
  newNote = "";
  for (const note of notes) {
    newNote += `<tr class="item">
        <td>${note.title}<span class="note-body">${note.body}</span></td>
        <td class="btcellv"><button onclick="loadNote('${note._id}')">View</button></td>
        <td class="btcelld"><button onclick="deleteNote('${note._id}')">Delete</button></td>
        </tr>`;
  }

  updateTable();
}

async function loadNote(id) {
  const response = await fetch(`/notes/${id}`, {
    method: "GET",
  });
  const note = await response.json();
  selectedNoteID = note._id;
  ntitle.value = note.title;
  nbody.value = note.body;
  saveBtn.textContent = "Update";
}

async function createNote(e) {
  e.preventDefault();
  if (ntitle.value.trim() == "" || nbody.value.trim() == "") {
    return alert("Please fill valid data");
  }
  await fetch("/notes", {
    method: "POST",
    body: JSON.stringify({
      title: ntitle.value,
      body: nbody.value,
      selectedNoteID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Increment note count
  noteCount++;
  console.log(noteCount);

  getNotes();
  resetAll();
}

async function deleteNote(id) {
  await fetch(`/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  noteCount--;
  getNotes();
}
