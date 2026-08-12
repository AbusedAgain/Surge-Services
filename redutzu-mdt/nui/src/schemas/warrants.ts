import * as yup from 'yup';

const schema = yup.object().shape({
    reason: yup.string().min(5, 'errors.warrants.reason.length').required('errors.warrants.reason.required'),
    description: yup.string().min(10, 'errors.warrants.description.length').required('errors.warrants.description.required'),
    wtype: yup.string().required('errors.warrants.wtype.required'),
    house: yup.array().optional(),
    players: yup.array(),
    done: yup.number()
});

export default schema;