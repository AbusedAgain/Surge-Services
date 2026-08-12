import * as yup from 'yup';

const schema = yup.object().shape({
    content: yup.string().required('errors.announcements.content.required')
});

export default schema;