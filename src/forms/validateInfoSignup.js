export default function validateInfo(values) {
  let errors = {};

  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  
  if (!values.email.trim()) {
    errors.email = 'Ingresá tu e-mail';
  }
  else if (values.email.trim().length >= 50) {
    errors.email = 'El e-mail ingresado es muy largo';
  }
  else if (!filter.test(values.email.trim())) {
    errors.email = 'El e-mail ingresado no es válido';
  }
  else if (/\s/g.test(values.email.trim())) {
    errors.email = 'El e-mail no puede tener espacios';
  }
  else if (values.email.trim().includes("@gmail")) {
    errors.email = 'Para usar GMail, clickeá en INGRESAR CON GOOGLE';
  }

  if (!values.nombre.trim()) {
    errors.nombre = 'Completá tu Nombre y Apellido';
  }
  else if (values.nombre.trim().length > 35) {
    errors.nombre = 'El nombre ingresado es muy largo';
  }
  else if (!/^[A-Za-záéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ' `]+$/.test(values.nombre.trim())) {
    errors.nombre = 'Tu Nombre sólo puede contener letras';
  }

  if (!values.password.trim()) {
    errors.password = 'Ingresá una contraseña';
  }
  else if (values.password.trim().length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  else if (values.password.trim().length >= 50) {
    errors.password = 'La contraseña ingresada es muy larga';
  }
  else if (/\s/g.test(values.password.trim())) {
    errors.password = 'La contraseña no puede tener espacios';
  }

  if (!values.password2.trim()) {
    errors.password2 = 'Ingresá una contraseña';
  }
  else if (values.password2.trim().length < 8) {
    errors.password2 = 'La contraseña debe tener al menos 8 caracteres';
  }
  else if (values.password2.trim().length >= 50) {
    errors.password2 = 'La contraseña ingresada es muy larga';
  }
  else if (/\s/g.test(values.password2.trim())) {
    errors.password2 = 'La contraseña no puede tener espacios';
  }

  if (values.password.trim() !== values.password2.trim()){
    errors.password = 'Las contraseñas no coinciden';
    errors.password2 = 'Las contraseñas no coinciden';
  }

  return errors;
}