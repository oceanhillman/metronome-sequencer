import Modal from 'react-bootstrap/Modal'
import { Form, Button } from "react-bootstrap"
import { useState, useEffect } from 'react';

export default function SaveAsNewButton(props) {
    const { updateSongTitle, onSave, songTitle } = props;
        
    const [newSongTitle, setNewSongTitle] = useState(songTitle);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setNewSongTitle(songTitle);
    }

    function handleClickSave() {
        onSave(newSongTitle);
        handleClose();
    }
  
    return (
      <div onKeyDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onFocus={e => e.stopPropagation()}
      onMouseOver={e => e.stopPropagation()}>
        <button className="disabled:text-gray-400" onClick={handleShow}>
          Save as new
        </button>
  
        <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
          <Modal.Header closeButton>
            <Modal.Title className="!text-cultured">
                Save As New Song
            </Modal.Title>
          </Modal.Header>
            <Modal.Body>
                <Form.Control className="w-[200px] self-center"
                    type="text"
                    value={newSongTitle}
                    onChange={(e) => setNewSongTitle(e.target.value)}
                    placeholder={"Song Title"}
                />
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClickSave}>
                Save New Song
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }