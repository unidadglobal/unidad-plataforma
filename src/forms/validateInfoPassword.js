export default function validateInfo(values) {
  let errors = {};

  if (!values.password.trim()) {
    errors.password = 'Ingresá una contraseña';
  }
  else if (values.password.trim().length >= 20) {
    errors.password = 'La contraseña ingresada es muy larga';
  }
  else if (/\s/g.test(values.password.trim())) {
    errors.password = 'La contraseña no puede tener espacios';
  }

  return errors;
}