import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import FormLogin from '../../forms/FormLogin';
import FormSignup from '../../forms/FormSignup';
import { login } from '../../redux/actions/auth.action'
import './loginBox.css';
import {FaGoogle, FaEnvelope} from 'react-icons/fa';

function LoginBox() {
    const dispatch = useDispatch()
    
    const [formType, setformType] = useState(null);
    
    const handleLogin = () => {
        setformType(null)
        dispatch(login("google"))
    }

    const handleLoginWithEmailAndPassword = () => {
        setformType(0)
    }

    const handleSignUpWithEmailAndPassword = () => {
        setformType(1)
    }

    return (
            <div className="login-wrapper" style={{minHeight: "100vh"}}>
                <div className='login__container'>
                    <h4 className="mb-4 text-light text-center">Iniciá Sesión para empezar.</h4>
                    <button className="btn btn-danger" onClick={handleLogin}><FaGoogle/> INGRESAR CON GOOGLE</button>
                    <button className="btn btn-success" onClick={handleLoginWithEmailAndPassword}><FaEnvelope/> INGRESAR CON E-MAIL Y CONTRASEÑA</button>
                    {
                        formType === 0 ? <FormLogin/> : <></>
                    }
                    <h4 className="mt-3">¿No tenés una cuenta?</h4>
                    <button className="btn btn-primary" onClick={handleSignUpWithEmailAndPassword}><FaEnvelope/> REGISTRARME CON E-MAIL Y CONTRASEÑA</button>
                    {
                        formType === 1 ? <FormSignup/> : <></>
                    }
                </div>
            </div>
    )
}

export default LoginBox
