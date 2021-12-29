import {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Col, Row, Modal, Form, Button} from 'react-bootstrap';
import './Guests.css'
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

const Bookings = () => {
    const dispatch = useDispatch();
    const api = useSelector(state => state.api)
    const bookings = useSelector(state => state.bookings);
    const User = useSelector(state => state.loggedInUser);
    const [loading,setLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
    const [roomLoading, setRoomLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [guest, setGuest] = useState('');
    const [room, setRoom] = useState('');
    const [roomNum, setRoomNum] = useState('');
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [status, setStatus] = useState('')
    const [guestData, setGuestData] = useState('');
    const [roomData, setRoomData] = useState('');
    const [toUpdateBooking, setToUpdateBooking] = useState({});
    const [save,setSave] = useState(false);

    useEffect( () => {
        axios.get(`${api}/bookings`).then( res => {
            console.log(res.data);
            setLoading(true);
            dispatch({type: 'LOAD_BOOKINGS', payload: res.data});
        }); 
    }, [dispatch])

    console.log(bookings);

    useEffect(() => {
        axios.get(`${api}/guests`).then(res => {
            console.log(res.data);
            setGuestData(res.data);
            setGuestLoading(true);
        }); 
    }, [])
    console.log(guestData);

    useEffect(() => {
        axios.get(`${api}/rooms`).then(res => {
            setRoomData(res.data);
            setRoomLoading(true);
        }); 
    }, [])

    const onAddBookingFormHandler = (e) => {
        e.preventDefault();
        let newBooking = {
            guest: guest,
            room: room,
            room_num: roomNum,
            checkin_date: checkinDate,
            checkout_date: checkoutDate,
            status: status
        }
        if(toUpdateBooking._id){
            axios
                .put(`${api}/bookings/${toUpdateBooking._id}`, newBooking)
                .then(res => {
                    newBooking._id = res.data._id
                    dispatch({type: 'UPDATE_BOOKING', payload: newBooking})
                    axios
                        .get(`${api}/bookings`)
                        .then(res1 => {
                            setSave(true);
                        });
                });
        }else{
            axios.post(`${api}/bookings`, newBooking).then(res => {
                    alert('New room record created!');
                    axios.get(`${api}/bookings/${res.data._id}`).then(result => {
                        console.log(result.data);
                    dispatch({type: 'ADD_BOOKING', payload: result.data});
                    })
                   
                });
             }
        setGuest('');
        setRoom('');
        setRoomNum('');
        setCheckinDate('');
        setCheckoutDate('');
        setToUpdateBooking({});
        setLgShow(false);
    }

    const onBookingDeleteHandler = (id) => {
        axios.delete(`${api}/bookings/${id}`).then(res => {
            alert('Record has been deleted.')
            dispatch({type: 'DELETE_BOOKING', payload: id})
        })
    }

    const onBookingUpdateHandler = (booking) => {
        setToUpdateBooking(booking);
        setLgShow(true);
        setGuest(booking.guest._id);
        setRoom(booking.room._id);
        setRoomNum(booking.room_num);
        setCheckinDate(moment(booking.checkin_date).format('llL'));
        setCheckoutDate(moment(booking.checkout_date).format('ll'));
        setStatus(booking.status);
    }

    return (
        <div className='wrapper'>
            <Row className='d-flex justify-content-end'>
                <h1>Bookings</h1> 
                <Button style={{width: '150px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} className="mb-3" variant="primary" onClick={() => setLgShow(true)}>
                    + New Booking
                </Button>
            </Row>

            <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    {
                       toUpdateBooking._id ? 'Update Booking' : 'New Booking'
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form className='guest-form' onSubmit={onAddBookingFormHandler}>
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Booked by
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={JSON.parse(User).fullname} text={JSON.parse(User).fullname}/>
                            </Col>
                        </Row>
               
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Guest Name
                            </Form.Label>
                            <Col>
                            <Form.Select required value={guest} onChange={(e) => setGuest(e.target.value)}>
                            <option>Select Guest</option>
                            {
                                guestLoading && guestData.map(dat => {
                                    return(
                                        <>
                                            
                                            <option value={dat._id}> {dat.full_name} </option>
                                        </>
                                    )
                                })       
                            }
                        </Form.Select>
                            </Col>
                        </Row>
         
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Room Type
                            </Form.Label>
                            <Col>
                            <Form.Select required value={room} onChange={(e) => setRoom(e.target.value)}>
                            <option>Select Room</option>
                            {
                                roomLoading && roomData.map(dat => {
                                    
                                    return(
                                        <>
                                            
                                            <option value={dat._id}> {dat.type} </option>
                                        </>
                                    )
                                })       
                            }
                        </Form.Select>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Room Number
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={roomNum} onChange={(e) => setRoomNum(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Check In Date
                            </Form.Label>
                            <Col>
                                <Form.Control required type='date' value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Check Out Date
                            </Form.Label>
                            <Col>
                                <Form.Control required type='date' value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)}/>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Status
                            </Form.Label>
                            <Col>
                            <Form.Select required onChange={(e) => setStatus(e.target.value)}>
                                <option>Set Status</option>
                                <option value="Open">Open</option>
                                <option value="Close">Close</option>
                            </Form.Select>
                            </Col>
                        </Row>

                        <Button style={{width: '180px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} type='submit' onClick={() => setLgShow(false)}>
                        {
                         toUpdateBooking._id ? 'Update Booking' : 'Save New Booking'
                        }
                        </Button>
                    </Form>

                </Modal.Body>
                
            </Modal>

           <div className='guest-table'>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Guest Name</th>
                        <th>Room Type</th>
                        <th>Room Number</th>
                        <th>Check In Date</th>
                        <th>Check Out Date</th>
                        <th>Status</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            loading && bookings.map( dat => {
                                return(
                                    <>
                                    <tr>
                                        <td>{dat.guest.full_name}</td>
                                        <td>{dat.room.type}</td>
                                        <td>{dat.room_num}</td>
                                        <td>{moment(dat.checkin_date).format('ll')}</td>
                                        <td>{moment(dat.checkout_date).format('ll')}</td>
                                        <td>{dat.status}</td>
                                        <td className='edit d-flex' style={{fontSize: '15px'}}>
                                            <span>
                                                <FaEdit style={{marginRight: '-45px',marginTop: '-5px'}} onClick={()=> onBookingUpdateHandler(dat)}/> 
                                                Edit
                                            </span>
                                            <span>
                                                <AiFillDelete style={{marginRight: '-45px',marginTop: '-5px', color:'red', fontSize:'18px'}} onClick={()=> onBookingDeleteHandler(dat._id)} /> 
                                                Delete
                                            </span> 
                                        </td>
                                        
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

export default Bookings;