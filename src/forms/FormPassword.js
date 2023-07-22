import React, { useEffect } from 'react'
import validate from './validateInfoPassword';
import useForm from './useFormPassword';
import './Form.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from 'react-bootstrap'


const FormPassword = ({ submitForm, channelID }) => {
  useEffect(() => {
    document.getElementById("formPassword").focus();
  }, []); // <-- empty array means 'run onc

  const { handleChange, handleSubmit, values, errors, passwordError } = useForm(
    submitForm,
    validate,
    channelID
  );
  
  return (
    <Container className="form-login">
      <Row>
        <Col>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPassword">
          <Form.Label className="label">Canal protegido con CONTRASEÑA</Form.Label>
          <Form.Control
            type="password"
            name="password"
            maxLength="20"
            placeholder='Ingresá la Contraseña'
            value={values.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className='form-inputs'>{errors.password}</p>}
        </Form.Group>
      </Form>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {passwordError && <p className='form-inputs'>{passwordError}</p>}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button variant="primary" className="btn-submit" onClick={handleSubmit}>INGRESAR</Button>
        </Col>
      </Row>
    </Container>
  )
};

export default FormPassword;
