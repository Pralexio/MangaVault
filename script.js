const notesList = document.getElementById('notesList');
const noteContent = document.getElementById('noteContent');
const newNoteModal = document.getElementById('newNoteModal');
const newNoteButton = document.getElementById('newNoteButton');
const saveNoteButton = document.getElementById('saveNoteButton');
const noteTitle = document.getElementById('noteTitle');
const episodeNumber = document.getElementById('episodeNumber');
const noteBody = document.getElementById('noteBody');
const noteURL = document.getElementById('noteURL');
const noteTypeRadios = document.querySelectorAll('input[name="noteType"]');

const editNoteModal = document.getElementById('editNoteModal');
const closeEditNoteModal = editNoteModal.querySelector('.close-edit');
const updateNoteButton = document.getElementById('updateNoteButton');
const editNoteTitle = document.getElementById('editNoteTitle');
const editEpisodeNumber = document.getElementById('editEpisodeNumber');
const editNoteBody = document.getElementById('editNoteBody');
const editNoteURL = document.getElementById('editNoteURL');
const editNoteTypeRadios = document.querySelectorAll('input[name="editNoteType"]');

let notes = [];
let editingNoteId = null;

function loadNotes() {
  notes = JSON.parse(localStorage.getItem('notes')) || [];
  displayNotes();
}

function displayNotes() {
  notesList.innerHTML = '';
  notes.forEach(note => addNoteToList(note));
}

function addNoteToList(note) {
  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');
  noteDiv.dataset.id = note.id;

  const iconSpan = document.createElement('span');
  iconSpan.classList.add('note-icon');
  iconSpan.classList.add(note.isAnime ? 'stream' : 'book');

  const titleSpan = document.createElement('span');
  titleSpan.textContent = note.title;

  const actionButtonsDiv = document.createElement('div');
  actionButtonsDiv.classList.add('action-buttons');

  const editButton = document.createElement('button');
  editButton.innerHTML = '✏️';
  editButton.classList.add('edit-button');
  editButton.onclick = (event) => {
    event.stopPropagation();
    openEditNoteModal(note);
  };

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '🗑️';
  deleteButton.classList.add('delete-button');
  deleteButton.onclick = (event) => {
    event.stopPropagation();
    deleteNoteFromStorage(note.id);
    noteDiv.remove();
  };

  actionButtonsDiv.appendChild(editButton);
  actionButtonsDiv.appendChild(deleteButton);

  noteDiv.appendChild(iconSpan);
  noteDiv.appendChild(titleSpan);
  noteDiv.appendChild(actionButtonsDiv);
  noteDiv.onclick = () => showNoteContent(note.id);
  notesList.appendChild(noteDiv);
}

function showNoteContent(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    let contentHTML = `
      <h2>${note.title}</h2>
      <p><strong>Numéro d'épisode/chapitre:</strong> ${note.episodeNumber}</p>
      <p><strong>Type:</strong> ${note.isAnime ? 'Anime' : ''} ${note.isScan ? 'Scan' : ''}</p>
      <p>${note.body}</p>
    `;
    
    if (note.url) {
      contentHTML += `
        <button class="open-url-button" onclick="openURL('${note.url}')">Ouvrir l'URL</button>
      `;
    }

    noteContent.innerHTML = contentHTML;
  }
}


function openURL(url) {
  console.log('Opening URL:', url);
  window.api.openNewWindow(url)
    .then(() => console.log('URL opened successfully'))
    .catch(error => console.error('Failed to open URL:', error));
}

newNoteButton.onclick = () => {
  newNoteModal.classList.add('show');
};

saveNoteButton.onclick = () => {
  const selectedType = [...noteTypeRadios].find(radio => radio.checked)?.value || '';
  const note = {
    id: Date.now(),
    title: noteTitle.value,
    episodeNumber: episodeNumber.value,
    body: noteBody.value,
    url: noteURL.value,
    isAnime: selectedType === 'anime',
    isScan: selectedType === 'scan'
  };
  notes.push(note);
  saveNoteToStorage();
  addNoteToList(note);
  newNoteModal.classList.remove('show');
  noteTitle.value = '';
  episodeNumber.value = '';
  noteBody.value = '';
  noteURL.value = '';
  noteTypeRadios.forEach(radio => radio.checked = false);
};

function openEditNoteModal(note) {
  editingNoteId = note.id;
  editNoteTitle.value = note.title;
  editEpisodeNumber.value = note.episodeNumber;
  editNoteBody.value = note.body;
  editNoteURL.value = note.url;
  editNoteTypeRadios.forEach(radio => {
    radio.checked = (radio.value === (note.isAnime ? 'anime' : 'scan'));
  });
  editNoteModal.style.display = 'block';
}

updateNoteButton.onclick = () => {
  const selectedType = [...editNoteTypeRadios].find(radio => radio.checked)?.value || '';
  const updatedNote = {
    id: editingNoteId,
    title: editNoteTitle.value,
    episodeNumber: editEpisodeNumber.value,
    body: editNoteBody.value,
    url: editNoteURL.value,
    isAnime: selectedType === 'anime',
    isScan: selectedType === 'scan'
  };

  notes = notes.map(note => note.id === editingNoteId ? updatedNote : note);
  saveNoteToStorage();
  displayNotes();
  showNoteContent(editingNoteId);
  editNoteModal.style.display = 'none';
};

document.querySelector('.close').onclick = () => {
  newNoteModal.classList.remove('show');
};

closeEditNoteModal.onclick = () => {
  editNoteModal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === newNoteModal) {
    newNoteModal.classList.remove('show');
  } else if (event.target === editNoteModal) {
    editNoteModal.style.display = 'none';
  }
};

function saveNoteToStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNoteFromStorage(noteId) {
  notes = notes.filter(note => note.id !== noteId);
  saveNoteToStorage();
}

loadNotes();
