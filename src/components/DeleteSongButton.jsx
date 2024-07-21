'use client'
import Modal from 'react-bootstrap/Modal'
import { Form, Button } from "react-bootstrap"
import { useState } from 'react';
import DeleteIcon from "/public/delete.svg"
import Image from 'next/image'

export default function DeleteSongButton(props) {
    const { songId, songTitle, onDelete } = props;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function handleClickDelete() {
        onDelete(songId);
        handleClose();
    }
  
    return (
      <>
        <button onClick={handleShow} className="w-[25px] h-[25px] bg-red-500 rounded-sm">
            <Image src={DeleteIcon} alt="Delete icon" className="w-auto h-auto"/>
        </button>
  
        <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
          <Modal.Header closeButton>
            <Modal.Title className="text-red-500">
                Confirm Delete
                <p className="text-lg text-white">"{songTitle}"</p>
            </Modal.Title>
          </Modal.Header>
            <Modal.Body>
                
                <p>Are you sure you want to delete this song?</p>
                
                <p className="text-red-500">This can not be reversed.</p>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleClickDelete}>
                Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }