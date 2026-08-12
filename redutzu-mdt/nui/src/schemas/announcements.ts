import * as yup from 'yup';

const schema = yup.object().shape({
    title: yup.string().required('errors.announcements.title.required'),
    content: yup.string().required('errors.announcements.content.required'),
});

export default schema;