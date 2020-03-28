import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, Table } from 'reactstrap';
import { withFirebase } from '../firebase/index';

import tourPrecioModel from '../../models/tourPrecio';

const PreciosTourModal = (props) => {

  const {
    docId
  } = props;

  const [modal, setModal] = useState(false);
  const [preciosTourColeccion, setPreciosTourColeccion] = useState([]);
  const [tourPrecio, setTourPrecio] = useState(tourPrecioModel || {});

  const toggle = () => setModal(!modal);

  useEffect(() => {
    props.firebase.firestore.collection("TourPrecios").where("id_tour", "==", docId).onSnapshot(async (querySnapshot) => {
      let preciosResultado = [];
      await querySnapshot.forEach((doc) => {
        preciosResultado.push({ id: doc.id, data: doc.data() });
      });

      setPreciosTourColeccion(preciosResultado);
    });
  }, []);

  const onSubmit = () => {
    tourPrecio.id_tour = docId;
    props.firebase.firestore.collection("TourPrecios").add(tourPrecio)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  const onDelete = (precioDocId) => {
    if (window.confirm("¿Realmente quieres ELIMINAR este precio?")) {
      props.firebase.firestore.collection("TourPrecios").doc(precioDocId).delete()
        .then(function () {
          console.log("Document successfully deleted!");
        }).catch(function (error) {
          console.error("Error removing document: ", error);
        })
    }
    else
      return false;
  }

  const onTourPrecioChange = (event) => {
    const { name, value } = event.target;
    setTourPrecio(Object.assign({ ...tourPrecio }, { [name]: value }));
  }

  return (
    <>
      <Button onClick={toggle} color="success" className="mr-3">Precios</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Admin Precios</ModalHeader>
        <ModalBody>
          <Form>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="habitacion">Habitacion:</Label>
                  <Input type="select" name="habitacion" id="habitacion" value={tourPrecio?.habitacion || ""} onChange={onTourPrecioChange}>
                    <option value="" disabled>Habitacion</option>
                    <option value="DOBLE">Doble</option>
                    <option value="TRIPLE">Triple</option>
                    <option value="CUADRUPLE">Cuadruple</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="acceso">Accesos:</Label>
                  <Input type="select" name="acceso" id="acceso" value={tourPrecio?.acceso || ""} onChange={onTourPrecioChange}>
                    <option value="" disabled>Acceso</option>
                    <option value="GRL">GRL</option>
                    <option value="VIP">VIP</option>
                    <option value="NA">N/A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="costo">Costo:</Label>
                  <Input type="text" name="costo" id="costo" placeholder="Costo" value={tourPrecio?.costo || ""} onChange={onTourPrecioChange} />
                </FormGroup>
              </Col>
              <Col md={3} className="mt-3 text-center justify-content-center align-self-center">
                <Button color="success" onClick={onSubmit}>Agregar</Button>
              </Col>
            </Row>
          </Form>
          <Table striped responsive>
            <thead>
              <tr>
                <th scope="row">Habitacion:</th>
                <th>Acceso:</th>
                <th>Costo:</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {preciosTourColeccion.map((precio) => {
                return (
                  <tr key={precio.id}>
                    <td>{precio.data.habitacion}</td>
                    <td>{precio.data.acceso}</td>
                    <td>{precio.data.costo}</td>
                    <td>
                      <Button color="warning" onClick={() => onDelete(precio.id)}>Eliminar</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>Salir</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default withFirebase(PreciosTourModal);