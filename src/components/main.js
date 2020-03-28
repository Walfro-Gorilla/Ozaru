import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Clientes from './clientes';
import Expedientes from './expedientes';
import ExpedienteDetalles from './expedienteDetalles';
import Proveedores from './proveedores';
import Tours from './tours';
import Ayuda from './ayuda';


const Main = () => (
  <Switch>
    <Route exact path="/" component={Clientes} />
    <Route path="/clientes" component={Clientes} />
    <Route exact path="/expediente/:id_cliente" component={Expedientes} />
    <Route path="/expediente/:id_cliente/ver/:id_expediente" component={ExpedienteDetalles} />
    <Route path="/proveedores" component={Proveedores} />
    <Route path="/tours" component={Tours} />
    <Route path="/ayuda" component={Ayuda} />
  </Switch>
)

export default Main;