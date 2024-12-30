import Joi from 'joi';

const userJoiSchema = Joi.object({
    name: Joi.string().min(3).max(30).case('lower').pattern(new RegExp('^[a-zA-Z]+$')).required(),
    email: Joi.string().case('lower').email().required(),
    password: Joi.string().min(6).max(20).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{6,20}$')).required()
})

export default userJoiSchema;