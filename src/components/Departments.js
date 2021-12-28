import {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Col, Row, Modal, Form, Button} from 'react-bootstrap';
import './Guests.css'
import { AiFillDelete } from "react-icons/ai"
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector} from 'react-redux';

const Departments = () => {
    const dispatch = useDispatch();
    const departments = useSelector(state => state.departments);
    const [deptLoading,setDeptLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [name, setName] = useState('');
    const [head, setHead] = useState('');
    const [toUpdateDepartment, setToUpdateDepartment] = useState({});
   
    useEffect( () => {
        axios.get('http://localhost:8000/departments').then( res => {
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
            axios.put(`http://localhost:8000/departments/${toUpdateDepartment._id}`, newDepartment).then(res => {
                newDepartment._id = res.data._id
                dispatch({type: 'UPDATE_DEPARTMENT', payload: newDepartment})
            })
        }else{
            axios.post('http://localhost:8000/departments', newDepartment).then(res => {
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

    const onDeleteHandler = (id) => {
        axios.delete(`http://localhost:8000/departments/${id}`).then(res => {
            alert('Department has been deleted.')
            dispatch({type: 'DELETE_DEPARTMENT', payload: id})
        })
    }

    const onUpdateHandler = (dept) => {
        setToUpdateDepartment(dept);
        setLgShow(true);
        setName(dept.name);
        setHead(dept.head);
    }

    return (
        <div className='wrapper'>
           <h1>Departments</h1> 
            <Button className="mb-3" variant="primary" onClick={() => setLgShow(true)}>
            + New Department
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
         

                        <Button variant="primary" type='submit' onClick={() => setLgShow(false)}>
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

export default Departments;