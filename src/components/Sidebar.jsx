import React, { useState } from "react";

export default function Sidebar(props) {
    const [isSidebarBodyVisible, setIsSidebarBodyVisible] = useState(false);

    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div
                className={`title ${note.id === props.currentNote.id ? "selected-note" : ""
                    }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">{note.body.split("\n", 1)}</h4>
                <button
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ));

    const toggleSidebarBody = () => {
        setIsSidebarBodyVisible(!isSidebarBodyVisible);
    };

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <button className="toggle-sidebar" onClick={toggleSidebarBody}>
                    {isSidebarBodyVisible ? "Hide" : "Show"}
                </button>
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>

            <div className={`sidebar--body ${isSidebarBodyVisible ? "visible" : ""}`}>
                {noteElements}

                <div className="toggler">
                    <p className="toggler--light">Light</p>
                    <div className="toggler--slider" onClick={props.toggle}>
                        <div className="toggler--slider--circle"></div>
                    </div>
                    <p className="toggler--dark">Dark</p>
                </div>
            </div>
        </section>
    );
}
