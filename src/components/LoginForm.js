import {useState} from 'react';
import { useNavigate } from 'react-router';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import './LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const onSubmitFormHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/users/login', {email: email, password: password}).then(res => {
            if(!res.data.error){
                let response = res.data;
                dispatch({type: 'SET_LOGGEDIN_USER', payload: response.user});
                navigate('/bookings');
            }else{
                alert(res.data.error)
            }
        })
    }

    return (
        <div>
            <Form className="registration-form" onSubmit={onSubmitFormHandler}>           
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                        Email
                    </Form.Label>
                    <Col sm="10">
                     <Form.Control required type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
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

                <Form.Group as={Row} className="mb-6">
                    <Col sm={{ span: 10, offset: 2 }}>
                    <Button className="login" type="submit">Log in</Button>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    );
};

export default LoginForm;