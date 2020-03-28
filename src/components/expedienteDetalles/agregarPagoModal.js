import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Row, Col, Container, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import pagoClienteModel from '../../models/pagoCliente';

import { withFirebase } from '../firebase/index';

const AgregarPagoModal = (props) => {

  const {
    idExpediente,
    nombreCliente,
    tourNombre,
    tourFecha,
    precioSaldo,
  } = props;

  const [modal, setModal] = useState(false);
  const [pagoCliente, setPagoCliente] = useState(Object.assign({ ...pagoClienteModel }, { id_expediente: idExpediente }));

  const toggle = () => {
    setModal(!modal);
  }

  const onSubmit = () => {
    props.firebase.firestore.collection("PagosCliente").add(pagoCliente)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onPagoChange = (event) => {
    const { name, value } = event.target;
    setPagoCliente(Object.assign({ ...pagoCliente }, { [name]: value }));
  }

  return (
    <>
      <Button onClick={toggle} className={"huitziilColor float-right"}>{"+ Agregar"}</Button>
      <Modal isOpen={modal} toggle={toggle} size="lg" style={{ maxWidth: '1600px', width: '80%' }}>
        <ModalHeader toggle={toggle}>Aplicar pago de cliente</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="tour">Cliente:</Label>
                  <h3>{nombreCliente}</h3>
                </FormGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Date:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    disabled
                    type="date"
                    id="tourFecha"
                    name="tourFecha"
                    value={tourFecha}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="tour">Tour:</Label>
                  <h3>{tourNombre}</h3>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="tour">Saldo</Label>
                  <h3>${precioSaldo}</h3>
                </FormGroup>
              </Col>
            </Row>
            <hr />
            <Row form>
              <Col md={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Fecha de pago:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="date"
                    id="datePago"
                    name="datePago"
                    onChange={onPagoChange}
                    value={pagoCliente?.datePago}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Saldo:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    disabled
                    type="text"
                    id="precioSaldo"
                    name="precioSaldo"
                    value={'$' + precioSaldo}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Monto:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    id="montoPago"
                    name="montoPago"
                    onChange={onPagoChange}
                    value={pagoCliente?.montoPago}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row form className="my-3">
              <Col md={4}>
                <Input type="select" name="cuentaPago" id="cuentaPago" onChange={onPagoChange} value={pagoCliente?.cuentaPago || ""}>
                  <option value="" disabled>Cuenta destino</option>
                  <optgroup label="BANCOS">
                    <option>BBVA - Bancomer</option>
                    <option>Banco Azteca</option>
                  </optgroup>
                  <optgroup label="ONLINE">
                    <option>Mercado Pago</option>
                    <option>Tienda en linea</option>
                    <option>PayPal</option>
                  </optgroup>
                  <optgroup label="CASH">
                    <option>Caja chica</option>
                  </optgroup>
                </Input>
              </Col>
              <Col md={4}>
                <Input type="select" name="tipoPago" id="tipoPago" onChange={onPagoChange} value={pagoCliente?.tipoPago || ""}>
                  <option value="" disabled>Tipo de pago</option>
                  <option>Oxxo pay</option>
                  <option>Transferencia</option>
                  <option>Efectivo</option>
                  <option>WEB</option>
                  <option>Deposito</option>
                </Input>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Reff:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    id="reffPago"
                    name="reffPago"
                    onChange={onPagoChange}
                    value={pagoCliente?.reffPago}
                  />
                </InputGroup>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="tour">Notas:</Label>
                  <Input
                    onChange={onPagoChange}
                    type="textarea"
                    name="commPago"
                    id="commPago"
                    value={pagoCliente?.commPago || ""}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={onSubmit}>Ok</Button>
          <Button color="danger" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default withFirebase(AgregarPagoModal);