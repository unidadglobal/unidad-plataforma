import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
  signUpWithEmailAndPassword
} from '../redux/actions/auth.action'

const useForm = (callback, validate) => {
  let signUpError;
  
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    email: '',
    nombre: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = e => {
    const { name, value } = !e.target ? e : e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  

  const { error } = useSelector(state => state.auth)

  if (error && isSubmitting) {
    if  (error.includes("email-already-in-use")){
      signUpError = "El E-mail ingresado ya está en uso";
    }
    else if (error.includes("timeout")){
      signUpError = "Ocurrió un error, intentá de nuevo";
    }
    else{
      signUpError = error
    }
  }

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        dispatch(signUpWithEmailAndPassword(values.email, values.password, values.nombre));
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors, signUpError };
};

export default useForm;