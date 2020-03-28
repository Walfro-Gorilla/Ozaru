import React, { Component } from 'react';
import { Table, Button, Container, FormGroup, Label, Input } from 'reactstrap';

import AgregarProveedorModal from './proveedores/agregarProveedorModal';
import EditarProveedorModal from './proveedores/editarProveedorModal';

import { withFirebase } from './firebase/index';


class Proveedores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buscarValor: '',
      proveedoresColeccion: [],
      proveedoresColeccionCache: [],
      proveedoresCount: 0
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData = () => {
    this.props.firebase.firestore.collection("Proveedores").onSnapshot(async (querySnapshot) => {
      let proveedoresColeccionBackend = [];

      await querySnapshot.forEach((doc) => {
        proveedoresColeccionBackend.push({ id: doc.id, data: doc.data() });
      });

      this.setState({
        buscarValor: '',
        proveedoresColeccion: proveedoresColeccionBackend,
        proveedoresColeccionCache: proveedoresColeccionBackend,
        proveedoresCount: proveedoresColeccionBackend.length
      });

    });
  }

  _filterData = async (filterData) => {
    let proveedoresColeccionFiltro = await this.state.proveedoresColeccion.filter((proveedor) => {
      return proveedor.data.proveedor.toLowerCase().trim().includes(filterData.toLowerCase().trim());
    });

    if(proveedoresColeccionFiltro.length <= 0){
      proveedoresColeccionFiltro = await this.state.proveedoresColeccionCache.filter((proveedor) => {
        return proveedor.data.proveedor.toLowerCase().includes(filterData.toLowerCase());
      });
    }

    this.setState({
      buscarValor: filterData,
      proveedoresColeccion: proveedoresColeccionFiltro,
      proveedoresCount: proveedoresColeccionFiltro.length
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
    if (window.confirm("¿Realmente quieres ELIMINAR este proveedor?")) {
      this.props.firebase.firestore.collection("Proveedores").doc(docId).delete()
        .then(function () {
          console.log("Document successfully deleted!");
        }).catch(function (error) {
          console.error("Error removing document: ", error);
        })
    }
    else
      return false;
  }

  render() {
    return (
      <Container className="mt-5" >
        <h1>Proveedores {this.state.proveedoresCount}</h1>
        <AgregarProveedorModal /><br />
        <FormGroup>
          <Label for="exampleEmail">Introduce algun dato de proveedor:</Label>
          <Input type="text" name="buscarProveedor" id="buscarProveedor" placeholder="Buscar proveedor..." onChange={this.onBuscarChange} value={this.state.buscarValor} />
        </FormGroup>
        <Table dark striped responsive>
          <thead>
            <tr>
              <th scope="row">Tipo</th>
              <th>Proveedor</th>
              <th>Contacto</th>
              <th>Telefono</th>
              <th>Ext</th>
              <th>E-mail</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.proveedoresColeccion.map((proveedor) => {
              return (
                <tr key={proveedor.id}>
                  <td>{proveedor.data.tipo}</td>
                  <td>{proveedor.data.proveedor}</td>
                  <td>{proveedor.data.contacto}</td>
                  <td>{proveedor.data.telefono}</td>
                  <td>{proveedor.data.ext}</td>
                  <td>{proveedor.data.email}</td>
                  <td>
                    <Button color="danger" className="mr-4" onClick={()=>this.onDelete(proveedor.id)}>Eliminar</Button>
                    <EditarProveedorModal docId={proveedor.id} datosProveedor={proveedor.data} />
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

export default withFirebase(Proveedores);