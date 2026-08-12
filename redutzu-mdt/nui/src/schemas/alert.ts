import * as yup from 'yup';

const schema = yup.object().shape({
    title: yup.string().required('errors.alert.title.required'),
    description: yup.string().required('errors.alert.description.required'),
});

export default schema;