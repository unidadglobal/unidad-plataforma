import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
  checkChannelPassword
} from '../redux/actions/channel.action'

const useForm = (callback, validate, channelID) => {
  let passwordError;
  
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    password: '',
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
    passwordError = error
  }

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        dispatch(checkChannelPassword(values.password, channelID));
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors, passwordError };
};

export default useForm;