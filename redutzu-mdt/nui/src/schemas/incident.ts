import * as yup from 'yup';

const schema = yup.object().shape({
    description: yup.string().optional()
});

export default schema;