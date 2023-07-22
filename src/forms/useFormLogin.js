import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
  login, passwordRecovery
} from '../redux/actions/auth.action'

const useForm = (callback, validate) => {
  let loginError;
  
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
  const handleChange = e => {
    const { name, value } = !e.target ? e : e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handlePasswordRecovery = e => {
    e.preventDefault();
    setErrors(validate(values, true));
    setIsRecovering(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const { error } = useSelector(state => state.auth)

  if (error && isSubmitting && (error.includes("wrong") || error.includes("not-found"))) {
    loginError = "El E-mail o contraseña ingresados son incorrectos";
  }
  else if (error && isSubmitting && error.includes("timeout")){
    loginError = "Ocurrió un error, intentá de nuevo";
  }
  else if (error && isSubmitting){
    loginError = error;
  }

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        dispatch(login("email", values));
      }
      else if (Object.keys(errors).length === 0 && isRecovering) {
        dispatch(passwordRecovery(values.email));
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors, loginError, handlePasswordRecovery };
};

export default useForm;