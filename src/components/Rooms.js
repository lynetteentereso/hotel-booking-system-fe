import {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Col, Row, Modal, Form, Button} from 'react-bootstrap';
import './Guests.css'
import { AiFillDelete } from "react-icons/ai"
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector} from 'react-redux';

const Rooms = () => {
    const api = useSelector(state => state.api);
    const dispatch = useDispatch();
    const rooms = useSelector(state => state.rooms);
    const [loading,setLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [type, setType] = useState('');
    const [rate, setRate] = useState('');
    const [count, setCount] = useState('');
    const [toUpdateRoom, setToUpdateRoom] = useState({});
   
    useEffect( () => {
        axios.get(`${api}/rooms`).then( res => {
            setLoading(true);
            dispatch({type: 'LOAD_ROOMS', payload: res.data});
        }); 
    }, [dispatch])

    const onAddRoomFormHandler = (e) => {
        e.preventDefault();
        let newRoom = {
            type: type,
            rate: rate,
            count: count,
        }
        if(toUpdateRoom._id){
            axios.put(`${api}/rooms/${toUpdateRoom._id}`, newRoom).then(res => {
                newRoom._id = res.data._id
                dispatch({type: 'UPDATE_ROOM', payload: newRoom})
            })
        }else{
            axios.post(`${api}/rooms`, newRoom).then(res => {
                    alert('New room record created!');
                    console.log(res.data);
                    dispatch({type: 'ADD_ROOM', payload: res.data});
                   
                });
             }
        setType('');
        setRate('');
        setCount('');
        setToUpdateRoom({});
        setLgShow(false);
    }

    const onDeleteRoomHandler = (id) => {
        axios.delete(`${api}/rooms/${id}`).then(res => {
            alert('Record has been deleted.')
            dispatch({type: 'DELETE_ROOM', payload: id})
        })
    }

    const onUpdateRoomHandler = (room) => {
        setToUpdateRoom(room);
        setLgShow(true);
        setType(room.type);
        setRate(room.rate);
        setCount(room.count);
    }

    return (
        <div className='wrapper'>
            <Row className='d-flex justify-content-end'>
                <h1>Rooms</h1> 
                <Button style={{width: '150px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} className="mb-3" variant="primary" onClick={() => setLgShow(true)} className="mb-3" variant="primary" onClick={() => setLgShow(true)}>
                + New Room
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
                       toUpdateRoom._id ? 'Update Record' : 'New Room'
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form className='guest-form' onSubmit={onAddRoomFormHandler}>
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Type
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={type} onChange={(e) => setType(e.target.value)}/>
                            </Col>
                        </Row>
               
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Rate
                            </Form.Label>
                            <Col>
                                <Form.Control required type='number' value={rate} onChange={(e) => setRate(e.target.value)}/>
                            </Col>
                        </Row>
         
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Count
                            </Form.Label>
                            <Col>
                                <Form.Control required type='number' value={count} onChange={(e) => setCount(e.target.value)}/>
                            </Col>
                        </Row>

                        <Button style={{width: '150px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} type='submit' onClick={() => setLgShow(false)}>
                        {
                         toUpdateRoom._id ? 'Update Room' : 'Save New Room'
                        }
                        </Button>
                    </Form>

                </Modal.Body>
                
            </Modal>

           <div className='guest-table'>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Type</th>
                        <th>Rate</th>
                        <th>Count</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            loading && rooms.map( dat => {
                                return(
                                    <>
                                    <tr>
                                        <td>{dat.type}</td>
                                        <td>{dat.rate}</td>
                                        <td>{dat.count}</td>                                   
                                        <td className='edit d-flex' style={{fontSize: '15px'}}>
                                            <span>
                                                <FaEdit style={{marginRight: '-45px',marginTop: '-5px'}} onClick={()=> onUpdateRoomHandler(dat)}/> 
                                                Edit
                                            </span>
                                            <span>
                                                <AiFillDelete style={{marginRight: '-45px',marginTop: '-5px', color:'red', fontSize:'18px'}} onClick={()=> onDeleteRoomHandler(dat._id)} /> 
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

export default Rooms;