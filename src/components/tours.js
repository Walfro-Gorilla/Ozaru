import React, { Component } from 'react';
import { Table, Button, Container, FormGroup, Label, Input } from 'reactstrap';

import AgregarTourModal from './tours/agregarTourModal';
import EditarTourModal from './tours/editarTourModal';
import PreciosTourModal from './tours/preciosTourModal';

import { withFirebase } from './firebase/index';


class Tours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buscarValor: '',
      tourColeccion: [],
      tourColeccionCache: [],
      tourCount: 0
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData = () => {
    this.props.firebase.firestore.collection("TourDescripciones").onSnapshot(async (querySnapshot) => {
      let tourColeccionBackend = [];

      await querySnapshot.forEach((doc) => {
        tourColeccionBackend.push({ id: doc.id, data: doc.data() });
      });

      this.setState({
        buscarValor: '',
        tourColeccion: tourColeccionBackend,
        tourColeccionCache: tourColeccionBackend,
        tourCount: tourColeccionBackend.length
      });

    });
  }

  _filterData = async (filterData) => {
    let tourColeccionFiltro = await this.state.tourColeccion.filter((tour) => {
      return tour.data.tour.toLowerCase().trim().includes(filterData.toLowerCase().trim());
    });

    if(tourColeccionFiltro.length <= 0){
      tourColeccionFiltro = await this.state.tourColeccionCache.filter((tour) => {
        return tour.data.tour.toLowerCase().includes(filterData.toLowerCase());
      });
    }

    this.setState({
      buscarValor: filterData,
      tourColeccion: tourColeccionFiltro,
      tourCount: tourColeccionFiltro.length
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
    if (window.confirm("¿Realmente quieres ELIMINAR este tour?")) {
      this.props.firebase.firestore.collection("TourDescripciones").doc(docId).delete()
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
        <h1>Tours {this.state.tourCount}</h1>
        <AgregarTourModal /><br />
        <FormGroup>
          <Label for="exampleEmail">Introduce algun dato del tour:</Label>
          <Input type="text" name="buscarProveedor" id="buscarProveedor" placeholder="Buscar tour..." onChange={this.onBuscarChange} value={this.state.buscarValor} />
        </FormGroup>
        <Table dark striped responsive>
          <thead>
            <tr>
              <th scope="row">Tour</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.tourColeccion.map((tour) => {
              return (
                <tr key={tour.id}>
                  <td>{tour.data.tour}</td>
                  <td>{tour.data.destino}</td>
                  <td>{tour.data.fecha_ida_salida}</td>
                  <td>{tour.data.qty}</td>
                  <td>
                    <PreciosTourModal docId={tour.id} />
                    <EditarTourModal docId={tour.id} datosTour={tour.data} />
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

export default withFirebase(Tours);