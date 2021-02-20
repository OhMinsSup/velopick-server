import { GenderType } from 'entities'

export const SignupBodyJsonSchema = {
  type: 'object',
  required: ['email', 'password', 'username'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    username: { type: 'string' },
    gender: {
      type: 'string',
      enum: [GenderType.Male, GenderType.FeMale],
    },
    birthday: {
      type: ['string', 'null'],
    },
  },
}

export interface SignupBody {
  email: string
  password: string
  username: string
  gender: GenderType
  birthday: string | null
}
