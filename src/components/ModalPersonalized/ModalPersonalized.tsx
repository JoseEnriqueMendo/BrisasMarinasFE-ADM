import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalPersonalized.css';
import logo from '../../assets/Images/logo Brisas marinas.png';

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const ModalPersonalized: React.FC<AlertModalProps> = ({ message, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} className="ModalPersonalized-container">
      <Modal.Header closeButton className="ModalPersonalized-hader">
        <img src={logo} className="ModalPersonalized-img" alt="logo brisas" />
        <Modal.Title className="ModalPersonalized-title">BRISAS MARINAS DICE:</Modal.Title>
      </Modal.Header>
      <Modal.Body className="ModalPersonalized-body">{message}</Modal.Body>
      <Modal.Footer className="ModalPersonalized-body">
        <Button variant="primary" onClick={onClose} className="ModalPersonalized-button">
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPersonalized;
