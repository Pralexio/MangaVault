const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadNotes: () => ipcRenderer.send('load-notes'),
  saveNote: (note) => ipcRenderer.send('save-note', note),
  onNotesLoaded: (callback) => ipcRenderer.on('notes', (event, notes) => callback(notes)),
  openNewWindow: (url) => ipcRenderer.invoke('open-new-window', url)
});
