import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';

import expedienteModel from '../../models/expediente';

import { withFirebase } from '../firebase/index';

const AgregarExpedienteModal = (props) => {

  const {
    toursColeccion,
    clienteId,
    clienteData,
  } = props;

  const [modal, setModal] = useState(false);
  const [expediente, setExpediente] = useState(expedienteModel);
  const [tourId, setTourId] = useState('');
  const [fecha_ida_salida, setFechaIdaSalida] = useState('');
  const [fecha_vuelta_salida, setFechaVueltaSalida] = useState('');

  const toggle = () => {
    setModal(!modal);
  }

  const onSubmit = () => {
    props.firebase.firestore.collection("Expedientes").add(Object.assign(expediente, { id_tour: tourId, id_cliente: clienteId }))
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        toggle();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toggle();
      });
  }

  const onExpedienteChange = (event) => {
    const { name, value } = event.target;
    if (name === "tour") {
      let tourSeleccion = toursColeccion.filter((tour) => {
        return tour.data.tour === value;
      })[0];

      setTourId(tourSeleccion.id);
      setFechaIdaSalida(tourSeleccion.data.fecha_ida_salida);
      setFechaVueltaSalida(tourSeleccion.data.fecha_vuelta_salida);
    }

    setExpediente(Object.assign({ ...expediente }, { [name]: value }));


  }

  return (
    <>
      <Button onClick={toggle} className="huitziilColor float-right mb-3">+ Nuevo</Button>
      <Modal isOpen={modal} toggle={toggle} size="lg" style={{maxWidth: '1600px', width: '80%'}}>
        <ModalHeader toggle={toggle}>Agregar Expediente</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={4}>
                <h4>{clienteData.client_name}</h4>
                <p style={{fontSize: 12}}>E-mail: {clienteData.mail}</p>
                <p style={{fontSize: 12}}>Cel: {clienteData.celular}</p>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="medio">Medio:</Label>
                  <Input type="select" name="medio" id="medio" onChange={onExpedienteChange} value={expediente?.medio || ""}>
                    <option value="" disabled>Medio</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Whatsapp</option>
                    <option>E mail</option>
                    <option>Llamada</option>
                    <option>Visita</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="categoria">Categoria:</Label>
                  <Input type="select" name="categoria" id="categoria" onChange={onExpedienteChange} value={expediente?.categoria || ""}>
                    <option value="" disabled>Categoria</option>
                    <option>Estudiantes</option>
                    <option>Familiar</option>
                    <option>Congreso</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="tour">Tour:</Label>
                  <Input type="select" name="tour" id="tour" onChange={onExpedienteChange} value={expediente?.tour || ""}>
                    <option value="" disabled>Tour</option>
                    {toursColeccion.map((tour) => {
                      return <option key={tour.id}>{tour.data.tour}</option>
                    })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="transporte">Adulto:</Label>
                  <Input
                    type="number"
                    name="paxs_adulto"
                    id="paxs_adulto"
                    onChange={onExpedienteChange}
                    value={expediente?.paxs_adulto || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="paxs_junior">Jr:</Label>
                  <Input
                    type="number"
                    name="paxs_junior"
                    id="paxs_junior"
                    onChange={onExpedienteChange}
                    value={expediente?.paxs_junior || ""}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={3}>
                <Label for="fecha_ida_salida">Ida</Label>
                <Input
                  style={{fontSize: 9}}
                  disabled
                  type="date"
                  name="fecha_ida_salida"
                  id="fecha_ida_salida"
                  placeholder=""
                  onChange={onExpedienteChange}
                  value={fecha_ida_salida}
                />
              </Col>
              <Col md={3}>
                <Label for="fecha_vuelta_salida">Reg</Label>
                <Input
                  style={{fontSize: 9}}
                  disabled
                  type="date"
                  name="fecha_vuelta_salida"
                  id="fecha_vuelta_salida"
                  placeholder=""
                  onChange={onExpedienteChange}
                  value={fecha_vuelta_salida}
                />
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="paxs_menor">Mnr:</Label>
                  <Input
                    type="number"
                    name="paxs_menor"
                    id="paxs_menor"
                    onChange={onExpedienteChange}
                    value={expediente?.paxs_menor || ""}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="pax_infante">Inf:</Label>
                  <Input
                    type="number"
                    name="pax_infante"
                    id="pax_infante"
                    onChange={onExpedienteChange}
                    value={expediente?.pax_infante || ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Input
                type="textarea"
                name="comentarios"
                id="comentarios"
                placeholder="Comentarios extras..."
                onChange={onExpedienteChange}
                value={expediente?.comentarios || ""}
              />
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

export default withFirebase(AgregarExpedienteModal);