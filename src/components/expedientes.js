import React, { Component } from 'react';
import { Table, Button, Container, FormGroup, Label, Input } from 'reactstrap';

import AgregarExpedienteModal from './expedientes/agregarExpedienteModal';

import { withFirebase } from './firebase/index';
import cliente from '../models/cliente';


class Expedientes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clienteData: cliente,
            toursColeccion: [],
            expedientesColeccion: [],
            expedientesCount: 0
        };
    }

    async componentDidMount() {
        Promise.all(
            [
                this.props.firebase.firestore.collection("Clientes").doc(this.props.match.params.id_cliente).get(),
                this.props.firebase.firestore.collection("Expedientes").where("id_cliente", "==", this.props.match.params.id_cliente),
                this.props.firebase.firestore.collection("TourDescripciones")
            ]
        )
        .then(async ([clienteValor, expedientesColeccionBackend, toursColeccionBackend]) => {

           await expedientesColeccionBackend.onSnapshot(async (querySnapshot) => {
                let expedientesColeccionMap = [];

                await querySnapshot.forEach((doc) => {
                    expedientesColeccionMap.push({ id: doc.id, data: doc.data() });
                });

                this.setState({
                    expedientesColeccion: expedientesColeccionMap,
                    expedientesCount: expedientesColeccionMap.length
                });

            });

            await toursColeccionBackend.onSnapshot(async (querySnapshot) => {
                let toursColeccionMap = [];

                await querySnapshot.forEach((doc) => {
                    toursColeccionMap.push({ id: doc.id, data: doc.data() });
                });

                this.setState({                    
                    toursColeccion: toursColeccionMap
                });
            });


            this.setState({
                clienteId: clienteValor.id,
                clienteData: clienteValor.data()
            });
        });
    }

    onVer = (docId) => {
        this.props.history.push(`/expediente/${this.props.match.params.id_cliente}/ver/${docId}`);
      }

    render() {
        return (
            <Container className="mt-5" >
                <h1>{this.state.expedientesCount} Expedientes</h1>
                <AgregarExpedienteModal
                    clienteId={this.state.clienteId}
                    toursColeccion={this.state.toursColeccion}
                    clienteData={this.state.clienteData}
                /><br />
                <p>del cliente:</p>
                <h2>{this.state.clienteData.client_name}</h2>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th scope="row">Status</th>
                            <th>Medio</th>
                            <th>Tour</th>
                            <th>Comentarios</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.expedientesColeccion.map((expediente) => {
                            return (
                                <tr key={expediente.id}>
                                    <td>{expediente.data.status}</td>
                                    <td>{expediente.data.medio}</td>
                                    <td>{expediente.data.tour}</td>
                                    <td>{expediente.data.comentarios}</td>
                                    <td>
                                        <Button color="primary" className="mr-4" onClick={() => { this.onVer(expediente.id) }}>Ver...</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default withFirebase(Expedientes);