import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';

import tourDescripcionModel from '../../models/tourDescripcion';

import { withFirebase } from '../firebase/index';

const AgregarTourModal = (props) => {

  const [modal, setModal] = useState(false);
  const [tourDescripcion, setTourDescripcion] = useState(tourDescripcionModel);
  const [hospedajeOpciones, setHospedajeOpciones] = useState([]);
  const [transporteOpciones, setTransporteOpciones] = useState([]);

  const _clean = () => {
    setTourDescripcion([]);
  }

  useEffect(() => {
    props.firebase.firestore.collection("Proveedores").where("tipo", "==", "Hospedaje").onSnapshot(async (querySnapshot) => {
      let hospedajeResultado = [];
      await querySnapshot.forEach((doc) => {
        hospedajeResultado.push({ id: doc.id, data: doc.data() });
      });

      setHospedajeOpciones(hospedajeResultado);
    });

    props.firebase.firestore.collection("Proveedores").where("tipo", "==", "Transporte").onSnapshot(async (querySnapshot) => {
      let transporteResultados = [];
      await querySnapshot.forEach((doc) => {
        transporteResultados.push({ id: doc.id, data: doc.data() });
      });

      setTransporteOpciones(transporteResultados);
    });

    return () => {
      _clean();
    }
  }, [modal]);

  const toggle = () => { 
    setModal(!modal); 
  }

  const onSubmit = () => {
    props.firebase.firestore.collection("TourDescripciones").add(tourDescripcion)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onTourChange = (event) => {

    const { name, value } = event.target;

    setTourDescripcion(Object.assign({ ...tourDescripcion }, { [name]: value }));

  }

  return (
    <>
      <Button onClick={toggle} className="huitziilColor float-right mb-3">+ Nuevo</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Admin Tours</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="tour">Nombre del tour:</Label>
                  <Input type="text" name="tour" id="tour" placeholder="Nombre del tour:" onChange={onTourChange} value={tourDescripcion?.tour || ""} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="qty">Cantidad:</Label>
                  <Input type="text" name="qty" id="qty" placeholder="Total de plazas" onChange={onTourChange} value={tourDescripcion?.qty || ""} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="hospedaje">Hospedaje:</Label>
                  <Input type="select" name="hospedaje" id="hospedaje" onChange={onTourChange} value={tourDescripcion?.hospedaje || ""}>
                    <option value="" disabled>Hospedaje</option>
                    {hospedajeOpciones.map((opcion) => {
                      return <option key={opcion.id}>{opcion.data.proveedor}</option>
                    })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="transporte">Transporte:</Label>
                  <Input type="select" name="transporte" id="transporte" onChange={onTourChange} value={tourDescripcion?.transporte || ""}>
                  <option value="" disabled>Transporte</option>
                    {transporteOpciones.map((opcion) => {
                      return <option key={opcion.id}>{opcion.data.proveedor}</option>
                    })}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="origen">Origen:</Label>
                  <Input type="select" name="origen" id="origen" onChange={onTourChange} value={tourDescripcion?.origen || ""}>
                    <option value="" disabled>Origen</option>
                    <option value="CJS">Cd Juarez</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="destino">Destino:</Label>
                  <Input type="select" name="destino" id="destino" onChange={onTourChange} value={tourDescripcion?.destino || ""}>
                    <option value="" disabled>Destino</option>
                    <option value="CUU">Chihuahua</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <p>IDA</p>
              </Col>
              <Col md={6}>
                <p>VUELTA</p>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <p>~Salida</p>
              </Col>
              <Col md={6}>
                <p>~Salida</p>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="fecha_ida_salida">-Fecha</Label>
                <Input
                  type="date"
                  name="fecha_ida_salida"
                  id="fecha_ida_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.fecha_ida_salida || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="fecha_vuelta_salida">-Fecha</Label>
                <Input
                  type="date"
                  name="fecha_vuelta_salida"
                  id="fecha_vuelta_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.fecha_vuelta_salida || ""}
                />
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="hora_ida_salida">-Hora</Label>
                <Input
                  type="time"
                  name="hora_ida_salida"
                  id="hora_ida_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.hora_ida_salida || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="hora_vuelta_salida">-Hora</Label>
                <Input
                  type="time"
                  name="hora_vuelta_salida"
                  id="hora_vuelta_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.hora_vuelta_salida || ""}
                />
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="sitio_ida_salida">-Sitio</Label>
                <Input
                  type="text"
                  name="sitio_ida_salida"
                  id="sitio_ida_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.sitio_ida_salida || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="sitio_vuelta_salida">-Sitio</Label>
                <Input
                  type="text"
                  name="sitio_vuelta_salida"
                  id="sitio_vuelta_salida"
                  onChange={onTourChange}
                  value={tourDescripcion?.sitio_vuelta_salida || ""}
                />
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <p>~Llegada</p>
              </Col>
              <Col md={6}>
                <p>~Llegada</p>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="fecha_ida_llegada">-Fecha</Label>
                <Input
                  type="date"
                  name="fecha_ida_llegada"
                  id="fecha_ida_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.fecha_ida_llegada || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="fecha_vuelta_llegada">-Fecha</Label>
                <Input
                  type="date"
                  name="fecha_vuelta_llegada"
                  id="fecha_vuelta_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.fecha_vuelta_llegada || ""}
                />
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="hora_ida_llegada">-Hora</Label>
                <Input
                  type="time"
                  name="hora_ida_llegada"
                  id="hora_ida_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.hora_ida_llegada || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="hora_vuelta_llegada">-Hora</Label>
                <Input
                  type="time"
                  name="hora_vuelta_llegada"
                  id="hora_vuelta_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.hora_vuelta_llegada || ""}
                />
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <Label for="sitio_ida_llegada">-Sitio</Label>
                <Input
                  type="text"
                  name="sitio_ida_llegada"
                  id="sitio_ida_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.sitio_ida_llegada || ""}
                />
              </Col>
              <Col md={6}>
                <Label for="sitio_vuelta_llegada">-Sitio</Label>
                <Input
                  type="text"
                  name="sitio_vuelta_llegada"
                  id="sitio_vuelta_llegada"
                  onChange={onTourChange}
                  value={tourDescripcion?.sitio_vuelta_llegada || ""}
                />
              </Col>
            </Row>
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

export default withFirebase(AgregarTourModal);