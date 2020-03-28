import React, { Component } from 'react';
import { Table, Button, Container, FormGroup, Label, Input } from 'reactstrap';

import AgregarClienteModal from './clientes/agregarClienteModal';
import EditarClienteModal from './clientes/editarClienteModal';

import { withFirebase } from './firebase/index';


class Clientes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buscarValor: '',
      clientesColeccion: [],
      clientesColeccionCache: [],
      clientesCount: 0
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData = () => {
    this.props.firebase.firestore.collection("Clientes").onSnapshot(async (querySnapshot) => {
      let clientesColeccionBackend = [];

      await querySnapshot.forEach((doc) => {
        clientesColeccionBackend.push({ id: doc.id, data: doc.data() });
      });

      this.setState({
        buscarValor: '',
        clientesColeccion: clientesColeccionBackend,
        clientesColeccionCache: clientesColeccionBackend,
        clientesCount: clientesColeccionBackend.length
      });

    });
  }

  _filterData = async (filterData) => {
    let clientesColeccionFiltro = await this.state.clientesColeccion.filter((cliente) => {
      return cliente.data.client_name.toLowerCase().trim().includes(filterData.toLowerCase().trim());
    });

    if(clientesColeccionFiltro.length <= 0){
      clientesColeccionFiltro = await this.state.clientesColeccionCache.filter((cliente) => {
        return cliente.data.client_name.toLowerCase().includes(filterData.toLowerCase());
      });
    }

    this.setState({
      buscarValor: filterData,
      clientesColeccion: clientesColeccionFiltro,
      clientesCount: clientesColeccionFiltro.length
    });
    
  }

  onBuscarChange = (event) => {
    const { value } = event.target;
    if(value === ""){
      this._loadData();
    } else {
      this._filterData(value);
    }
    
  }

  onDelete = (docId) => {
    if (window.confirm("¿Realmente quieres ELIMINAR este cliente?")) {
      this.props.firebase.firestore.collection("Clientes").doc(docId).delete()
        .then(function () {
          console.log("Document successfully deleted!");
        }).catch(function (error) {
          console.error("Error removing document: ", error);
        })
    }
    else
      return false;
  }

  onExpediente = (docId) => {
    this.props.history.push(`/expediente/${docId}`);
  }

  render() {
    return (
      <Container className="mt-5" >
        <h1>Clientes {this.state.clientesCount}</h1>
        <AgregarClienteModal /><br />
        <FormGroup>
          <Label for="buscarCliente">Introduce algun dato del cliente:</Label>
          <Input type="text" name="buscarCliente" id="buscarCliente" placeholder="Buscar cliente..." onChange={this.onBuscarChange} value={this.state.buscarValor} />
        </FormGroup>
        <Table dark striped responsive>
          <thead>
            <tr>
              <th scope="row">Nombre</th>
              <th>Celular</th>
              <th>E-mail</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.clientesColeccion.map((cliente) => {
              return (
                <tr key={cliente.id}>
                  <td>{cliente.data.client_name}</td>
                  <td>{cliente.data.celular}</td>
                  <td>{cliente.data.mail}</td>
                  <td>
                    <Button color="primary" className="mr-4" onClick={()=>this.onExpediente(cliente.id)}>Expediente</Button>
                    <EditarClienteModal docId={cliente.id} datosCliente={cliente.data} />
                    <Button color="danger" className="ml-4" onClick={()=>this.onDelete(cliente.id)}>Eliminar</Button>
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

export default withFirebase(Clientes);