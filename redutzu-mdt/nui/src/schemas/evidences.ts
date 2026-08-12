import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().min(3, 'errors.evidences.name.length').required('errors.evidences.name.required'),
    description: yup.string().min(10, 'errors.evidences.description.length').required('errors.evidences.description.required'),
    players: yup.array(),
    images: yup.array().min(1, 'errors.evidences.images.length').max(9, 'errors.evidences.images.max')
});

export default schema;