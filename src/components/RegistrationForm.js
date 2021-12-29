import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import './RegistrationForm.css'

const RegistrationForm = (props) => {
    const api = useSelector( state => state.api)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [department, setDepartment] = useState('');
    const [loading,setLoading] = useState(false);
    const [data, setData] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`${api}/departments`).then(res => {
            console.log(res.data);
            setData(res.data);
            setLoading(true);
        }); 
    }, [])

    const onUserRegistrationHandler = (e) => {
        e.preventDefault();
        // Check if email exists
        axios.post(`${api}/users/email-exists`, {email: email}).then(res => {
        // if email exists, don't register
        // if email does not exist, proceed with registration
        // res.data === true (email exists)
        let user = {
            email: email,
            password: password,
            fullname: fullname,
            department: department
        };

        if(!res.data){
            // res.data === false (email does not exist) --> proceed
            axios.post(`${api}/users/register`, user).then(res => {
                alert('Registration Successful!');
                navigate('/');
                dispatch({type: 'LOAD_USERS', payload: res.data})
            });
        }else{
            alert('Email already exists!');
        }
    })
    }

    return (
        <div>
            <Form className="registration-form" onSubmit={onUserRegistrationHandler}>           
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                        Email
                    </Form.Label>
                    <Col sm="10">
                     <Form.Control required type="email" value={email} placeholder="name@olympiapearl.com" onChange={(e) => setEmail(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                        Password
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control required type="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                        Name
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control required type="text" value={fullname} placeholder="John Doe" onChange={(e) => setFullname(e.target.value)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                        Department
                    </Form.Label>
                    <Col sm="10">
                        <Form.Select onChange={(e) => setDepartment(e.target.value)}>
                            {
                                loading && data.map(dat => {
                                    return(
                                        <>
                                            <option> {dat.name} </option>
                                        </>
                                    )
                                })       
                            }
                        </Form.Select>
                    </Col>
                </Form.Group> 

                <Form.Group as={Row} className="mb-6">
                    <Col sm={{ span: 10, offset: 2 }}>
                    <Button style={{width: '150px', marginRight:'50px', color:'rgb(31, 30, 30)', borderColor: 'rgb(31, 30, 30)', background: 'white'}} className="register" type="submit">Register</Button>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    );
};

export default RegistrationForm;