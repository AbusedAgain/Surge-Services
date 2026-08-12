import * as yup from 'yup';

const schema = yup.object().shape({
    notes: yup.string().optional(),
    height: yup.number().optional(),
    image: yup.string().optional()
});

export default schema;