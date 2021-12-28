import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {ReactComponent as Logo} from './olympia-pearl-logo.svg';
import { NavLink, Routes, Route } from 'react-router-dom';
import {Navbar, Container, Nav} from 'react-bootstrap';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Bookings from './components/Bookings';
import Guests from './components/Guests';
import Invoices from './components/Invoices';
import Payments from './components/Payments';
import Departments from './components/Departments';
import Rooms from './components/Rooms';
import './App.css';

const App = () => {
  const User = useSelector(state => state.loggedInUser);
  const dispatch = useDispatch();
  return (
    <div className="main-wrapper">
       <Navbar className='nav-wrapper ' expand='lg'>
        <Container className='mynav'>
          <Navbar.Brand className='brand'>
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav ' />
          <Navbar.Collapse className='mynav-collapse' id='basic-navbar-nav '>
            <Nav className='me-auto '>
              {!User && <Nav.Link ><NavLink to='/register' className='active'>Register</NavLink></Nav.Link>}
              {!User && <Nav.Link ><NavLink  exact to='/' className='active' >Log In</NavLink></Nav.Link>}
              {User && <Nav.Link ><NavLink to='/bookings' className='active'>Bookings</NavLink></Nav.Link>}
              {User && <Nav.Link ><NavLink to='/guests' className='active'>Guests</NavLink></Nav.Link>}
              {User && <Nav.Link disabled><NavLink to='/invoices' className='active' >Invoices</NavLink></Nav.Link>}
              {User && <Nav.Link disabled><NavLink to='/payments' className='active' disabled>Payments</NavLink></Nav.Link>}
              {User && <Nav.Link ><NavLink to='/departments' className='active'>Departments</NavLink></Nav.Link>}
              {User && <Nav.Link ><NavLink to='/rooms' className='active'>Rooms</NavLink></Nav.Link>}
              {User && <Nav.Link ><NavLink to='/' onClick={() => { dispatch({ type: "LOGOUT" })}}>Log Out</NavLink></Nav.Link>}
              {User && <Navbar.Text> Signed in as: {JSON.parse(User).fullname} </Navbar.Text>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path='/register' element={<RegistrationForm/>}></Route>
        <Route exact path='/' element={<LoginForm/>}></Route>
        <Route exact path='/bookings' element={<Bookings/>}></Route>
        <Route exact path='/guests' element={<Guests/>}></Route>
        <Route exact path='/invoices' element={<Invoices/>}></Route>
        <Route exact path='/payments' element={<Payments/>}></Route>
        <Route exact path='/departments' element={<Departments/>}></Route>
        <Route exact path='/rooms' element={<Rooms/>}></Route>
      </Routes>
    </div>
  );
};

export default App;