import { GenderType } from 'entities'

export interface SignupBody {
  email: string
  password: string
  username: string
  gender: GenderType
  birthday: number
}
