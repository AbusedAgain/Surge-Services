import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('errors.charges.name.required'),
    time: yup.number()
});

export default schema;