import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input } from 'reactstrap';

import proveedorModel from '../../models/proveedor';
import { withFirebase } from '../firebase/index';

const AgregarProveedorModal = (props) => {

  const [modal, setModal] = useState(false);
  const [proveedor, setProveedor] = useState(proveedorModel);

  const toggle = () => setModal(!modal);

  const onSubmit = () => {
    props.firebase.firestore.collection("Proveedores").add(proveedor)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onProveedorChange = (event) => {

    const { name, value } = event.target;

    setProveedor(Object.assign({ ...proveedor }, { [name]: value }));

  }

  return (
    <>
      <Button onClick={toggle} className="huitziilColor float-right mb-3">+ Nuevo</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Nuevo Proveedor</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Input type="select" name="tipo" id="tipo" value={proveedor?.tipo} onChange={onProveedorChange}>
                <option value="" disabled>Tipo</option>
                <option value="Transporte">Transporte</option>
                <option value="Hospedaje">Hospedaje</option>
                <option value="Operadora">Operadora</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input type="select" name="tipo_desc" id="tipo_desc" value={proveedor?.tipo_desc} onChange={onProveedorChange}>
                <option value="" disabled>Descripcion</option>
                <option value="Autobus">Autobus</option>
                <option value="Aerolinea">Aerolinea</option>
                <option value="Hotel">Hotel</option>
                <option value="Hostal">Hostal</option>
                <option value="Tours">Tours</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="proveedor" id="proveedor" placeholder="Proveedor" onChange={onProveedorChange} value={proveedor?.proveedor || ""} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="contacto" id="contacto" placeholder="Contacto" onChange={onProveedorChange} value={proveedor?.contacto} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="telefono" id="telefono" placeholder="Telefono" onChange={onProveedorChange} value={proveedor?.telefono} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="ext" id="ext" placeholder="Extension" onChange={onProveedorChange} value={proveedor?.ext} />
            </FormGroup>
            <FormGroup>
              <Input type="email" name="email" id="email" placeholder="Email" onChange={onProveedorChange} value={proveedor?.email} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="web" id="web" placeholder="Sitio Web" onChange={onProveedorChange} value={proveedor?.web} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="pais" id="pais" placeholder="Pais" onChange={onProveedorChange} value={proveedor?.pais} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="estado" id="estado" placeholder="Estado" onChange={onProveedorChange} value={proveedor?.estado} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="ciudad" id="ciudad" placeholder="Ciudad" onChange={onProveedorChange} value={proveedor?.ciudad} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="comision" id="comision" placeholder="Comision" onChange={onProveedorChange} value={proveedor?.comision} />
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

export default withFirebase(AgregarProveedorModal);