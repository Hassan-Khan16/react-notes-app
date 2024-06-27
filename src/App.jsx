import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "../firebase"

export default function App() {
  const [tempNoteText, setTempNoteText] = React.useState("")
  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState("")
  const [darkMode, setDarkMode] = React.useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) ?? true
  })

  function toggle() {
    setDarkMode(prevDarkMode => {
      const newDarkMode = !prevDarkMode
      localStorage.setItem("darkMode", JSON.stringify(newDarkMode))
      return newDarkMode
    })
  }
  const currentNote =
    notes.find(note => note.id === currentNoteId)
    || notes[0]

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr)
    })
    return unsubscribe
  }, [])

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentNote?.body && tempNoteText !== currentNote.body) {
        updateNote(tempNoteText)
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [tempNoteText])

  async function createNewNote() {
    const newNote = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      body: "# Type your markdown note's title here"
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
  }

  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId)
    await setDoc(docRef, { updatedAt: Date.now(), body: text }, { merge: true })
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId)
    await deleteDoc(docRef)
  }

  return (
    <main data-theme={darkMode ? "dark" : "light"}>
      {
        notes.length > 0
          ?
          <Split
            sizes={[100, 100]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
              darkMode={darkMode}
              toggle={toggle}
            />
            {
              <Editor
                tempNoteText={tempNoteText}
                setTempNoteText={setTempNoteText}
                darkMode={darkMode}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note-button"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
