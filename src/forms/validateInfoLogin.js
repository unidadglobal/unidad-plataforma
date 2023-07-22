export default function validateInfo(values, isRecovering) {
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
    errors.password = 'El e-mail no puede tener espacios';
  }

  if (!isRecovering){
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
  }

  return errors;
}

