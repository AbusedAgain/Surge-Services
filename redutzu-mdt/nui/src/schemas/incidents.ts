import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().min(3, 'errors.incidents.name.length').required('errors.incidents.name.required'),
    description: yup.string().min(10, 'errors.incidents.description.length').required('errors.incidents.description.required'),
    players: yup.array().min(1, 'errors.incidents.players.length').required('errors.incidents.players.required'),
    cops: yup.array().min(1, 'errors.incidents.cops.length').required('errors.incidents.cops.required'),
    vehicles: yup.array(),
    evidences: yup.array(),
    fines: yup.array(),
    jail: yup.array(),
    fine_reduction: yup.number(),
    jail_reduction: yup.number()
});

export default schema;