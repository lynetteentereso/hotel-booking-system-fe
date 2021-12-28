import {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Col, Row, Modal, Form, Button} from 'react-bootstrap';
import './Guests.css'
import { AiFillDelete } from "react-icons/ai"
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector} from 'react-redux';

const Guests = () => {
    const dispatch = useDispatch();
    const guests = useSelector(state => state.guests);
    const [loading,setLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [toUpdateGuest, setToUpdateGuest] = useState({});
   
    useEffect( () => {
        axios.get('http://localhost:8000/guests').then( res => {
            setLoading(true);
            dispatch({type: 'LOAD_GUESTS', payload: res.data});
        }); 
    }, [dispatch])

    const onAddGuestFormHandler = (e) => {
        e.preventDefault();
        let newGuest = {
            full_name: fullName,
            address: address,
            city: city,
            province: province,
            zip_code: zipCode,
            company_name: companyName,
            email_address: email,
            mobile_number: mobile
        }
        if(toUpdateGuest._id){
            axios.put(`http://localhost:8000/guests/${toUpdateGuest._id}`, newGuest).then(res => {
                newGuest._id = res.data._id
                dispatch({type: 'UPDATE_GUEST', payload: newGuest})
            })
        }else{

            // Check if email exists
            axios.post('http://localhost:8000/guests/email-exists', {email_address:email}).then(res => {
            
            if(!res.data){
                axios.post('http://localhost:8000/guests', newGuest).then(res => {
                    alert('New guest record created!');
                    console.log(res.data);
                    dispatch({type: 'ADD_GUEST', payload: res.data});
                   
                });
            }else{
                alert('Guest record already exists!');
            }
            })
        }
        setFullName('');
        setAddress('');
        setCity('');
        setProvince('');
        setZipCode('');
        setCompanyName('');
        setEmail('');
        setMobile('');
        setToUpdateGuest({});
        setLgShow(false);
    }
    console.log(guests);
    const onDeleteHandler = (id) => {
        axios.delete(`http://localhost:8000/guests/${id}`).then(res => {
            alert('Record has been deleted.')
            dispatch({type: 'DELETE_GUEST', payload: id})
        })
    }

    const onUpdateHandler = (guest) => {
        setToUpdateGuest(guest);
        setLgShow(true);
        setFullName(guest.full_name);
        setAddress(guest.address);
        setCity(guest.city);
        setProvince(guest.province);
        setZipCode(guest.zip_code);
        setCompanyName(guest.company_name);
        setEmail(guest.email_address);
        setMobile(guest.mobile_number);
    }

    return (
        <div className='wrapper'>
           <h1>Guests</h1> 
            <Button className="mb-3" variant="primary" onClick={() => setLgShow(true)}>
            + New Guest
            </Button>

            <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    {
                       toUpdateGuest._id ? 'Update Record' : 'New Guest'
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form className='guest-form' onSubmit={onAddGuestFormHandler}>
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Full Name
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                            </Col>
                        </Row>
         
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Address
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={address} onChange={(e) => setAddress(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            City
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={city} onChange={(e) => setCity(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Province
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={province} onChange={(e) => setProvince(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Zip Code
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Company Name
                            </Form.Label>
                            <Col>
                                <Form.Control type='text' value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Email Address
                            </Form.Label>
                            <Col>
                                <Form.Control required type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Mobile Number
                            </Form.Label>
                            <Col>
                                <Form.Control type='text' value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                            </Col>
                        </Row>

                        <Button variant="primary" type='submit' onClick={() => setLgShow(false)}>
                        {
                         toUpdateGuest._id ? 'Update Record' : 'Save New Guest'
                        }
                        </Button>
                    </Form>

                </Modal.Body>
                
            </Modal>

           <div className='guest-table'>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Full Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Province</th>
                        <th>Zip Code</th>
                        <th>Company Name</th>
                        <th>Email Address</th>
                        <th>Contact Number</th>
                        <th></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            loading && guests.map( dat => {
                                return(
                                    <>
                                    <tr>
                                        <td>{dat.full_name}</td>
                                        <td>{dat.address}</td>
                                        <td>{dat.city}</td>
                                        <td>{dat.province}</td>
                                        <td>{dat.zip_code}</td>
                                        <td>{dat.company_name}</td>
                                        <td>{dat.email_address}</td>
                                        <td>{dat.mobile_number}</td>
                                        <td className='edit' onClick={()=> onUpdateHandler(dat)}><FaEdit /></td>
                                        <td className='delete' onClick={()=> onDeleteHandler(dat._id)}><AiFillDelete /></td>
                                    </tr>
                                    </>
                                )
                            }) 
                        }
                    </tbody>
                </Table>
           </div>
        </div>
    );
};

export default Guests;