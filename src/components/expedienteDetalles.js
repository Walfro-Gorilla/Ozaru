import React, { Component } from 'react';
import { Table, Button, Container, Row, Col, Input, InputGroup, Label, FormGroup, InputGroupAddon, InputGroupText, Badge } from 'reactstrap';

import AgregarVentaModal from './expedienteDetalles/agregarVentaModal';
import AgregarPagoModal from './expedienteDetalles/agregarPagoModal';

import { withFirebase } from './firebase/index';

import clienteModel from '../models/cliente';
import expedienteModel from '../models/expediente';
import tourDescipcionModel from '../models/tourDescripcion';


class ExpedienteDetalles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tourDescipcion: { id: 0, data: tourDescipcionModel },
            cliente: { id: this.props.match.params.id_cliente, data: { ...clienteModel } },
            expediente: { id: this.props.match.params.id_expediente, data: { ...expedienteModel } },
            tourPreciosColeccion: [],
            ventasColeccion: [],
            totalPrecio: 0,
            pagosColeccion: [],
            totalPagos: 0,
            ventaAbierta: false
        };
    }

    async componentDidMount() {
        Promise.all(
            [
                this.props.firebase.firestore.collection("Clientes").doc(this.state.cliente.id).get(),
                this.props.firebase.firestore.collection("Expedientes").doc(this.state.expediente.id).get(),
                this.props.firebase.firestore.collection("Ventas").where("id_expediente", "==", this.state.expediente.id),
                this.props.firebase.firestore.collection("PagosCliente").where("id_expediente", "==", this.state.expediente.id),
            ]
        )
            .then(async ([clienteRespuesta, expedienteRespuesta, ventasRespuesta, pagosRespuesta]) => {

                let tourDescipcionRespuesta = await this.props.firebase.firestore.collection("TourDescripciones").doc(expedienteRespuesta.data().id_tour).get();

                await this.props.firebase.firestore.collection("TourPrecios").where("id_tour", "==", expedienteRespuesta.data().id_tour).onSnapshot(async (querySnapshot) => {
                    let tourPreciosMap = [];

                    await querySnapshot.forEach((doc) => {
                        tourPreciosMap.push({ id: doc.id, data: doc.data() });
                    });

                    this.setState({
                        tourPreciosColeccion: tourPreciosMap
                    });
                });

                await ventasRespuesta.onSnapshot(async (querySnapshot) => {
                    let ventasColeccionMap = [];

                    await querySnapshot.forEach(async (doc) => {

                        let filterPrecio = this.state.tourPreciosColeccion.find((precio) => {
                            return precio.id === doc.data().id_price;
                        });

                        ventasColeccionMap.push({ id: doc.id, data: doc.data(), precio: filterPrecio });
                    });

                    this.setState({
                        ventasColeccion: ventasColeccionMap,
                        totalPrecio: ventasColeccionMap.length > 0 ? ventasColeccionMap.map(venta => venta.precio.data.costo).reduce((a, b) => parseInt(a) + parseInt(b)) : 0
                    });

                });

                await pagosRespuesta.onSnapshot(async (querySnapshot) => {
                    let pagosColeccionMap = [];

                    await querySnapshot.forEach(async (doc) => {
                        pagosColeccionMap.push({ id: doc.id, data: doc.data() });
                    });

                    this.setState({
                        pagosColeccion: pagosColeccionMap,
                        totalPagos: pagosColeccionMap.length > 0 ? pagosColeccionMap.map(pago => pago.data.montoPago).reduce((a, b) => parseInt(a) + parseInt(b)) : 0
                    });

                });


                this.setState({
                    tourDescipcion: { id: tourDescipcionRespuesta.id, data: tourDescipcionRespuesta.data() },
                    cliente: Object.assign(this.state.cliente, { data: { ...clienteRespuesta.data() } }),
                    expediente: Object.assign(this.state.expediente, { data: { ...expedienteRespuesta.data() } }),
                });
            });
    }

    onExpedienteChange = (event) => {
        const { name, value } = event.target;
        this.setState(Object.assign({ ...this.state.expediente }, { [name]: value }));
    }

    onEliminar = (docId) => {
        if (window.confirm("¿Realmente quieres ELIMINAR esta venta?")) {
            this.props.firebase.firestore.collection("Ventas").doc(docId).delete()
                .then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                })
        }
        else
            return false;
    }

    onEliminarPago = (docId) => {
        if (window.confirm("¿Realmente quieres ELIMINAR este pago?")) {
            this.props.firebase.firestore.collection("PagosCliente").doc(docId).delete()
                .then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                })
        }
        else
            return false;
    }

    onCerrarVenta = () => {
        var ExpRef = this.props.firebase.firestore.collection("Expedientes").doc(this.state.expediente.id);

        return ExpRef.update({
            venta: "close",
            status: "Saldo"
        }).then(function () {
            console.log("Success");
        })
    }

    render() {
        return (
            <Container className="mt-5" >
                <p>Expediente de</p>
                <h2>{this.state.cliente.data.client_name}</h2>
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th scope="row">User</th>
                            <th>Medio</th>
                            <th>Status</th>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Tour</th>
                            <th>Categoria</th>
                            <th>Fecha</th>
                            <th>Exp</th>
                            <th>Cancelar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Huitzill</td>
                            <td>{this.state.expediente.data.medio}</td>
                            <td>{this.state.expediente.data.status}</td>
                            <td>{this.state.cliente.data.client_name}</td>
                            <td>{this.state.cliente.data.mail}</td>
                            <td>{this.state.cliente.data.celular}</td>
                            <td>{this.state.expediente.data.tour}</td>
                            <td>{this.state.expediente.data.categoria}</td>
                            <td>{this.state.tourDescipcion.data.fecha_ida_salida}</td>
                            <td>-</td>
                            <td>
                                <Button color="danger" className="mr-4" onClick={() => { }}>x</Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Row>
                    <Col md={6}>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Input
                                            disabled
                                            type="textarea"
                                            name="comentarios"
                                            id="comentarios"
                                            value={this.state.expediente?.data.comentarios || ""}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Plan de pagos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Input type="select" name="frequencia" id="frequencia" onChange={this.onExpedienteChange} value={this.state.expediente?.data.frecuencia || ""}>
                                            <option value="" disabled>Frecuencia</option>
                                            <option>Semanal</option>
                                            <option>Quincenal</option>
                                            <option>Mensual</option>
                                        </Input>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Table bordered className={this.state.ventasColeccion.length > 0 ? "d-none" : ""}>
                    <thead>
                        <tr>
                            <th>Venta... <AgregarVentaModal tourDescripcion={this.state.tourDescipcion} tourPrecios={this.state.tourPreciosColeccion} idExpediente={this.state.expediente?.id} /><br /></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </Table>
                <Container className={this.state.ventasColeccion.length > 0 ? "border rounded" : "d-none"}>
                    <Row style={{ backgroundColor: 'yellowgreen', color: 'white', fontWeight: 'bold' }}>
                        <Col md={12} className="my-3">
                            Venta...
                        </Col>
                    </Row>
                    <Row className="my-4">
                        <Col md={3}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Fecha:</InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    disabled
                                    type="data"
                                    id="fecha_ida_salida"
                                    name="fecha_ida_salida"
                                    value={this.state.tourDescipcion.data.fecha_ida_salida}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th scope="col">Tour</th>
                                        <th scope="col">Destino</th>
                                        <th scope="col">Transporte</th>
                                        <th scope="col">Hotel</th>
                                        <th scope="col">Tipo hab</th>
                                        <th scope="col">Accesos</th>
                                        <th scope="col">Costo</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.ventasColeccion.map((venta) => {
                                        return (
                                            <tr key={venta.id}>
                                                <td>{this.state.tourDescipcion.data.tour}</td>
                                                <td>{this.state.tourDescipcion.data.destino}</td>
                                                <td>{this.state.tourDescipcion.data.transporte}</td>
                                                <td>{this.state.tourDescipcion.data.hospedaje}</td>
                                                <td>{venta.precio?.data.habitacion || ''}</td>
                                                <td>{venta.precio?.data.acceso || ''}</td>
                                                <td>${venta.precio?.data.costo || ''}</td>
                                                <td><Button color="danger" onClick={() => this.onEliminar(venta.id)}>x</Button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>

                    </Row>


                    {/* Row precio final */}
                    <Row className="my-4">
                        <Col md={9} className="text-right">
                            <h6>Total:</h6>
                        </Col>
                        <Col md={3}>
                            <h3 align="center">${this.state.totalPrecio} <Badge color="info">MXN</Badge></h3>
                        </Col>
                    </Row>

                    {/* Row botons de accion */}
                    <Row className="my-4">
                        <Col md={12} className="text-right">
                            <Button color="info" className="mr-3 d-none">Abrir Venta</Button>
                            <AgregarVentaModal buttonText="Agregar Partida" buttonClassName="btn-warning mr-3" tourDescripcion={this.state.tourDescipcion} tourPrecios={this.state.tourPreciosColeccion} idExpediente={this.state.expediente?.id} />
                            <Button color="danger" className="d-none" onClick={this.onCerrarVenta}>Cerrar Venta</Button>
                        </Col>
                    </Row>

                    {/* Row pagos */}
                    <Container className="border rounded my-5">


                        <Row style={{ backgroundColor: 'yellowgreen', color: 'white', fontWeight: 'bold' }}>
                            <Col md={12} className="my-3">
                                <span>Pagos del cliente...</span><AgregarPagoModal idExpediente={this.state.expediente?.id} nombreCliente={this.state.cliente.data.client_name} tourNombre={this.state.tourDescipcion.data.tour} tourFecha={this.state.tourDescipcion.data.fecha_ida_salida} precioSaldo={parseInt(this.state.totalPrecio) - parseInt(this.state.totalPagos)} />
                            </Col>
                        </Row>

                        <Row className={this.state.pagosColeccion.length > 0 ? "d-none" : "my-3"}>
                            <Col md={12}>
                                <h5 style={{ color: 'orangered' }}>Aun no hay pagos del cliente u.u</h5>
                            </Col>
                        </Row>

                        <Row className={this.state.pagosColeccion.length <= 0 ? "d-none" : "my-3"}>
                            <Col md={9}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <td>Fecha</td>
                                            <td>Pago</td>
                                            <td>Cuenta</td>
                                            <td>Tipo</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.pagosColeccion.map((pago) => {
                                            return (
                                                <tr key={pago.id}>
                                                    <td>{pago?.data.datePago}</td>
                                                    <td>{pago?.data.montoPago}</td>
                                                    <td>{pago?.data.cuentaPago}</td>
                                                    <td>{pago?.data.tipoPago}</td>
                                                    <td><Button color="danger" onClick={() => this.onEliminarPago(pago.id)}>x</Button></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>

                            <Col md={3}>
                                <Table bordered>
                                    <thead>
                                        <tr align="center">
                                            <th>Pagos</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr align="center">
                                            <th id="tdPagos">${this.state.totalPagos}</th>
                                            <th id="tdSaldo">${parseInt(this.state.totalPrecio) - parseInt(this.state.totalPagos)}</th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>


                        </Row>

                    </Container>

                </Container>

            </Container>
        );
    }
}

export default withFirebase(ExpedienteDetalles);