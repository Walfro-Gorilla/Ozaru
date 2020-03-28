import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Row, Col, Container } from 'reactstrap';

import ventaModel from '../../models/venta';

import { withFirebase } from '../firebase/index';

const AgregarVentaModal = (props) => {

  const {
    buttonText,
    buttonClassName,
    tourDescripcion,
    tourPrecios,
    idExpediente,
  } = props;

  const [modal, setModal] = useState(false);
  const [venta, setVenta] = useState(Object.assign({ ...ventaModel }, { id_expediente: idExpediente }));
  const [precio, setPrecio] = useState('');

  const toggle = () => {
    setModal(!modal);
  }

  const onSubmit = () => {
    props.firebase.firestore.collection("Ventas").add(venta)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onVentaChange = (event) => {
    const { name, value } = event.target;

    if (name === "id_price") {
      let precioSeleccion = tourPrecios.filter((precioFiltro) => {
        return precioFiltro.id === value;
      })[0];

      setPrecio(precioSeleccion.data.costo);
    }

    setVenta(Object.assign({ ...venta }, { [name]: value }));
  }

  return (
    <>
      <Button onClick={toggle} className={ buttonClassName || "huitziilColor float-right"}>{buttonText || "+ Agregar"}</Button>
      <Modal isOpen={modal} toggle={toggle} size="lg" style={{ maxWidth: '1600px', width: '80%' }}>
        <ModalHeader toggle={toggle}>Agregar Partida</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={8}>
                <FormGroup>
                  <Label for="tour">Tour:</Label>
                  <Input
                    disabled
                    type="text"
                    name="tour"
                    id="tour"
                    value={tourDescripcion?.data.tour || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="tour">Destino:</Label>
                  <Input
                    disabled
                    type="text"
                    name="destino"
                    id="destino"
                    value={tourDescripcion?.data.destino || ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="fecha_ida_salida">Fecha del:</Label>
                  <Input
                    disabled
                    type="date"
                    name="fecha_ida_salida"
                    id="fecha_ida_salida"
                    value={tourDescripcion?.data.fecha_ida_salida || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="fecha_vuelta_salida">Fechas al:</Label>
                  <Input
                    disabled
                    type="date"
                    name="fecha_vuelta_salida"
                    id="fecha_vuelta_salida"
                    value={tourDescripcion?.data.fecha_vuelta_salida || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="transporte">Transporte:</Label>
                  <Input
                    disabled
                    type="text"
                    name="transporte"
                    id="transporte"
                    value={tourDescripcion?.data.transporte || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="hospedaje">Hotel:</Label>
                  <Input
                    disabled
                    type="text"
                    name="hospedaje"
                    id="hospedaje"
                    value={tourDescripcion?.data.hospedaje || ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Container>
              <Row className="py-5">
                <Col md={6}>
                  <Label for="client_name">Trip:</Label>
                  <Input type="select" name="id_price" id="id_price" onChange={onVentaChange} value={venta?.id_price || ""}>
                    <option value="" disabled>Trip</option>
                    {tourPrecios.map((precio) => {
                        return <option key={precio.id} value={precio.id}>{`Habitacion ${precio.data.habitacion} + Acceso ${precio.data.acceso}` }</option>
                    })}
                  </Input>
                </Col>
                <Col md={6}>
                  <Label for="client_name">Costo:</Label>
                  <Input
                    disabled
                    type="text"
                    name="precio"
                    id="precio"
                    value={`$${precio}`}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Input
                    onChange={onVentaChange}
                    type="textarea"
                    name="comentario"
                    id="comentario"
                    placeholder="Comentarios extras..."
                    value={venta?.comentario || ""}
                  />
                </Col>
              </Row>
            </Container>

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

export default withFirebase(AgregarVentaModal);