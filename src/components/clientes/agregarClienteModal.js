import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';

import clienteModel from '../../models/cliente';

import { withFirebase } from '../firebase/index';

const AgregarClienteModal = (props) => {

  const [modal, setModal] = useState(false);
  const [cliente, setCliente] = useState(clienteModel);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    return () => {
      if(modal === false){
        setCliente(clienteModel);
      }
    }
  }, [modal])

  const onSubmit = () => {
    props.firebase.firestore.collection("Clientes").add(cliente)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onClienteChange = (event) => {
    const { name, value } = event.target;
    setCliente(Object.assign({ ...cliente }, { [name]: value }));
  }

  return (
    <>
      <Button onClick={toggle} className="huitziilColor float-right mb-3">+ Nuevo</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Admin Clientes</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="client_name">Nombre:</Label>
              <Input type="text" name="client_name" id="client_name" placeholder="Nombre del cliente" onChange={onClienteChange} value={cliente?.client_name || ""} />
            </FormGroup>
            <FormGroup>
              <Label for="celular">Celular:</Label>
              <Input type="phone" name="celular" id="celular" placeholder="Numero de celular" onChange={onClienteChange} value={cliente?.celular || ""} />
            </FormGroup>
            <FormGroup>
              <Label for="mail">E-mail:</Label>
              <Input type="email" name="mail" id="mail" placeholder="E-mail" onChange={onClienteChange} value={cliente?.mail || ""} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onSubmit}>Guardar</Button>
          <Button color="danger" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default withFirebase(AgregarClienteModal);