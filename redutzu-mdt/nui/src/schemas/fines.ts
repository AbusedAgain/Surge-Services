import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('errors.fines.name.required'),
    code: yup.string().required('errors.fines.code.required').matches(window.CONFIG.CONSTANTS.CODE_FORMAT.REGEX, 'errors.fines.code.format'),
    amount: yup.number().required('errors.fines.amount.required')
});

export default schema;