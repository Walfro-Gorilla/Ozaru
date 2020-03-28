import React, { Component } from 'react';
import './App.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import Main from './components/main';
import { Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="demo-big-content">
    <Layout>
        <Header className="header-color" title={<Link style={{textDecoration: 'none', color: 'white'}} to="/">Huitziil 2.0</Link>} scroll>
            <Navigation>
                <Link style={{textDecoration: 'none', fontSize:'18px'}} to="/clientes">Clientes</Link>
                <Link style={{textDecoration: 'none', fontSize:'18px'}} to="/proveedores">Proveedores</Link>
                <Link style={{textDecoration: 'none', fontSize:'18px'}} to="/tours">Tours</Link>
                <Link style={{textDecoration: 'none', fontSize:'18px'}} to="/ayuda">Ayuda</Link>
            </Navigation>
        </Header>
        <Drawer title={<Link style={{textDecoration: 'none', color: 'black'}} to="/">Huitziil 2.0</Link>}>
            <Navigation>
              <Link to="/clientes">Clientes</Link>
              <Link to="/proveedores">Proveedores</Link>
              <Link to="/tours">Tours</Link>
              <Link to="/ayuda">Ayuda</Link>
            </Navigation>
        </Drawer>
        <Content>
            <div className="page-content" />
            <Main/>
        </Content>
    </Layout>
</div>

    );
  }
}

export default App;