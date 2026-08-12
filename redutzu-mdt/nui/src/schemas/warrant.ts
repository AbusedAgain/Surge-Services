import * as yup from 'yup';

const schema = yup.object().shape({
    description: yup.string().optional(),
    done: yup.boolean().optional()
});

export default schema;