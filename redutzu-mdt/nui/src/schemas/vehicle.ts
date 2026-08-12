import * as yup from 'yup';

const schema = yup.object().shape({
    notes: yup.string().optional(),
    image: yup.string().optional()
});

export default schema;