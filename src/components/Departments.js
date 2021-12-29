import {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Col, Row, Modal, Form, Button} from 'react-bootstrap';
import './Guests.css'
import { AiFillDelete } from "react-icons/ai"
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector} from 'react-redux';

const Departments = () => {
    const dispatch = useDispatch();
    const api = useSelector(state => state.api)
    const departments = useSelector(state => state.departments);
    const [deptLoading,setDeptLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [name, setName] = useState('');
    const [head, setHead] = useState('');
    const [toUpdateDepartment, setToUpdateDepartment] = useState({});
   
    useEffect( () => {
        axios.get(`${api}/departments`).then( res => {
            setDeptLoading(true);
            dispatch({type: 'LOAD_DEPARTMENTS', payload: res.data});
        }); 
    }, [dispatch])

    const onAddDepartmentFormHandler = (e) => {
        e.preventDefault();
        let newDepartment = {
            name: name,
            head: head
        }
        if(toUpdateDepartment._id){
            axios.put(`${api}/departments/${toUpdateDepartment._id}`, newDepartment).then(res => {
                newDepartment._id = res.data._id
                dispatch({type: 'UPDATE_DEPARTMENT', payload: newDepartment})
            })
        }else{
            axios.post(`${api}/departments`, newDepartment).then(res => {
                    alert('New room record created!');
                    console.log(res.data);
                    dispatch({type: 'ADD_DEPARTMENT', payload: res.data});
                   
                });
             }
        setName('');
        setHead('');
        setToUpdateDepartment({});
        setLgShow(false);
    }

    const onDeleteDepartmentHandler = (id) => {
        axios.delete(`${api}/departments/${id}`).then(res => {
            alert('Department has been deleted.')
            dispatch({type: 'DELETE_DEPARTMENT', payload: id})
        })
    }

    const onUpdateDepartmentHandler = (dept) => {
        setToUpdateDepartment(dept);
        setLgShow(true);
        setName(dept.name);
        setHead(dept.head);
    }

    return (
        <div className='wrapper'>
           <Row className='d-flex justify-content-end'>
            <h1>Departments</h1> 
            <Button style={{width: '170px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} className="mb-3" variant="primary" onClick={() => setLgShow(true)}>
            + New Department
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
                       toUpdateDepartment._id ? 'Update Record' : 'New Department'
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form className='guest-form' onSubmit={onAddDepartmentFormHandler}>
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Department Name
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={name} onChange={(e) => setName(e.target.value)}/>
                            </Col>
                        </Row>
               
                        <Row className="mb-3">
                            <Form.Label column lg={2}>
                            Department Head
                            </Form.Label>
                            <Col>
                                <Form.Control required type='text' value={head} onChange={(e) => setHead(e.target.value)}/>
                            </Col>
                        </Row>
         

                        <Button style={{width: '200px', marginRight:'50px', background:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)'}} type='submit' onClick={() => setLgShow(false)}>
                        {
                         toUpdateDepartment._id ? 'Update Department' : 'Save New Department'
                        }
                        </Button>
                    </Form>

                </Modal.Body>
                
            </Modal>

           <div className='guest-table'>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Department Head</th>
                        <th></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            deptLoading && departments.map( dat => {
                                return(
                                    <>
                                    <tr>
                                        <td>{dat.name}</td>
                                        <td>{dat.head}</td>                             
                                        <td className='edit d-flex' style={{fontSize: '15px'}}>
                                            <span>
                                                <FaEdit style={{marginRight: '-45px',marginTop: '-5px'}} onClick={()=> onUpdateDepartmentHandler(dat)}/> 
                                                Edit
                                            </span>
                                            <span>
                                                <AiFillDelete style={{marginRight: '-45px',marginTop: '-5px', color:'red', fontSize:'18px'}} onClick={()=> onDeleteDepartmentHandler(dat._id)} /> 
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

export default Departments;