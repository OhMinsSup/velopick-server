import { StatusCodes } from 'http-status-codes'

export type ResponseType<Data = any> = {
  ok: boolean
  statusCode: number
  resultCode: number
  message: string
  data: Data
}

export function successResponse<Data = any>({
  data,
}: {
  data: Data
}): ResponseType<Data> {
  return {
    ok: true,
    statusCode: StatusCodes.OK,
    resultCode: 1,
    message: '',
    data,
  }
}
