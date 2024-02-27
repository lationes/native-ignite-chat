import {KeyValueModel} from "~/models/common.model";

export interface Validator {
  required: string[],
  requiredOne?: string[],
}

export const validate = (validator: Validator, fields: KeyValueModel) => {
  if (validator) {
    let errors = {} as KeyValueModel;
    const unfilled = validator.required.filter(field => !fields[field]);

    if (validator.requiredOne) {
      const unfilled = validator.requiredOne.filter(field => !fields[field] || !fields[field]?.length);
      if (validator.requiredOne.length <= unfilled.length) {
        unfilled.forEach(error => {
          errors[error] = 'Please fill required fields';
        });
      }
    }

    if (unfilled.length) {
      unfilled.forEach(field => {
        errors[field] = 'Please fill required fields';
      });
    }

    return { errors };
  }

  return { errors: null };
};

export const email = (fields: KeyValueModel) => ({
  error: 'Incorrect email format',
  validate: validateEmail,
  fields,
});

export const phone = (fields: KeyValueModel) => ({
  error: 'Phone format must be XXX-XXX-XXXX',
  validate: validatePhone,
  fields,
});

export const ssn = (fields: KeyValueModel) => ({
  error: 'SSN format must be XXX-XX-XXXX',
  validate: validateSSN,
  fields,
});

export const samePasswords = (fields: KeyValueModel) => ({
  error: 'Passwords must be same',
  validate: (password: string, repeat: string) => password === repeat,
  fields,
});

export const password = (fields: KeyValueModel) => ({
  error: 'Incorrect Password',
  validate: validatePassword,
  fields,
});

const validatePassword = (password: string) => {
  const re = /^.*.{8,20}$/;
  return re.test(password);
};

const validateEmail = (email: string) => {
  /* eslint-disable no-useless-escape */
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const validatePhone = (phone: string) => {
  /* eslint-disable no-useless-escape */
  const re = /^\d{3}-\d{3}-\d{4}$/;
  return re.test(phone);
};

const validateSSN = (ssn: string) => {
  /* eslint-disable no-useless-escape */
  const re = /^\d{3}-\d{2}-\d{4}$/;
  return re.test(ssn);
};
