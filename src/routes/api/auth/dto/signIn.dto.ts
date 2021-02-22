export const SigninBodyJsonSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
}

export interface SigninBody {
  email: string
  password: string
}
