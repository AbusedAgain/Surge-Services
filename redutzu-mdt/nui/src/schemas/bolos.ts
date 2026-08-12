import * as yup from 'yup';

const schema = yup.object().shape({
    title: yup.string().min(3, 'errors.bolos.title.length').required('errors.bolos.title.required'),
    description: yup.string().min(10, 'errors.bolos.description.length').required('errors.bolos.description.required'),
    bolo_type: yup.string().required('errors.bolos.bolo_type.required'),
    players: yup.array(),
    vehicles: yup.array(),
    status: yup.number()
});

export default schema;