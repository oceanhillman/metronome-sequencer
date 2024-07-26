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
        <button onClick={handleShow} className="w-[25px] h-[25px] mx-auto">
            <Image src={DeleteIcon} alt="Delete icon" className="w-auto h-auto" draggable={false}/>
        </button>
  
        <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
          <Modal.Header className="mx-auto w-full" closeButton>
            <Modal.Title className="!text-red-500 break-words w-full">
                Confirm Deletion
                <p className="text-lg text-white m-0 break-words">"{songTitle}"</p>
            </Modal.Title>
          </Modal.Header>
            <Modal.Body>
                
                <p className="text-cultured m-0">Are you sure you want to delete this song?</p>
                
                <p className="text-red-500 m-0">This can not be reversed.</p>
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