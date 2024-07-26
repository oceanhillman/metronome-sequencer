import Modal from 'react-bootstrap/Modal'
import { Form, Button } from "react-bootstrap"
import { useState } from 'react';

export default function SaveAsNewButton(props) {
    const { songTitle, updateSongTitle, onSave } = props;
        

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleClickSave() {
        onSave();
        handleClose();
    }
  
    return (
      <>
        <button className="disabled:text-gray-400" onClick={handleShow}>
          Save as new
        </button>
  
        <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
          <Modal.Header closeButton>
            <Modal.Title>
                Save as new song
            </Modal.Title>
          </Modal.Header>
            <Modal.Body>
                <Form.Control className="w-[200px] self-center"
                    type="text"
                    value={songTitle}
                    onChange={(e) => updateSongTitle(e.target.value)}
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
      </>
    );
  }