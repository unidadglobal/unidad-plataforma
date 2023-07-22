import React, { useEffect } from 'react'
import validate from './validateInfoSignup';
import useForm from './useFormSignup';
import './Form.css';

import "react-datepicker/dist/react-datepicker.css";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from 'react-bootstrap'


const FormSignup = ({ submitForm }) => {
  useEffect(() => {
    document.getElementById("formEmail").focus();
  }, []); // <-- empty array means 'run onc

  const { handleChange, handleSubmit, values, errors, signUpError } = useForm(
    submitForm,
    validate
  );
  
  return (
    <Container className="form-login">
      <Row>
        <Col>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label className="label">E-Mail</Form.Label>
          <Form.Control
            type="text"
            name="email"
            maxLength="50"
            placeholder='Ingresá tu E-Mail'
            value={values.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className='form-inputs'>{errors.email}</p>}
        </Form.Group>

        <Form.Group controlId="formNombre">
          <Form.Label className="label">Nombre y Apellido</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            maxLength="35"
            placeholder='Ingresá tu Nombre y Apellido'
            value={values.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && <p className='form-inputs'>{errors.nombre}</p>}
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="label">Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            maxLength="50"
            placeholder='Ingresá tu Contraseña'
            value={values.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className='form-inputs'>{errors.password}</p>}
        </Form.Group>

        <Form.Group controlId="formPassword2">
          <Form.Label className="label">Reingresá tu Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            maxLength="50"
            placeholder='Reingresá tu Contraseña'
            value={values.password2}
            onChange={handleChange}
            required
          />
          {errors.password2 && <p className='form-inputs'>{errors.password2}</p>}
        </Form.Group>
      </Form>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {signUpError && <p className='form-inputs'>{signUpError}</p>}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button variant="primary" className="btn-submit" onClick={handleSubmit}>CREAR CUENTA</Button>
        </Col>
      </Row>
    </Container>
  )
};

export default FormSignup;
