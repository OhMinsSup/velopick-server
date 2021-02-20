import { ResponseType } from 'libs/response'
import { StatusCodes } from 'http-status-codes'

const resultCode = {
  EXISTS_CODE: 40001,
}

export function badRequestResponse<Data = any>({
  message,
}: {
  message: string
}): ResponseType<Data> {
  return {
    ok: false,
    statusCode: StatusCodes.BAD_REQUEST,
    resultCode: 0,
    message,
    data: null,
  }
}

export function existsResponse<Data = any>({
  message,
  data,
}: {
  message: string
  data: Data
}): ResponseType<Data> {
  return {
    ok: false,
    statusCode: StatusCodes.CONFLICT,
    resultCode: resultCode.EXISTS_CODE,
    message,
    data,
  }
}
