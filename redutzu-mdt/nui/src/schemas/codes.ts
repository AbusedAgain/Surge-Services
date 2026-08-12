import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('errors.codes.name.required'),
    code: yup.string().required('errors.codes.code.required').matches(window.CONFIG.CONSTANTS.CODE_FORMAT.REGEX, 'errors.codes.code.format')
});

export default schema;