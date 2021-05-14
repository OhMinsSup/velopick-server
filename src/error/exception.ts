import { ResponseType } from '../libs/response'
import { StatusCodes } from 'http-status-codes'

export const resultCode = {
  EXISTS_PASSWORD: 30000,

  EXISTS_CODE: 40001,
  NOTFOUND_DATA: 40002,

  UNAUTHORIZED: 50001,
}

export function unauthorizedResponse<Data = any>(
  data = null
): ResponseType<Data> {
  return {
    ok: false,
    statusCode: StatusCodes.UNAUTHORIZED,
    resultCode: resultCode.UNAUTHORIZED,
    message: '로그인을 해주세요.',
    data,
  }
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

export function notFoundResponse<Data = any>({
  message,
  data,
}: {
  message: string
  data: Data
}): ResponseType<Data> {
  return {
    ok: false,
    statusCode: StatusCodes.NOT_FOUND,
    resultCode: resultCode.NOTFOUND_DATA,
    message,
    data,
  }
}

export function customExceptionResponse<Data = any>({
  statusCode,
  resultCode,
  message,
  data,
}: {
  resultCode: number
  statusCode: number
  message: string
  data: Data
}): ResponseType<Data> {
  return {
    ok: false,
    statusCode,
    resultCode,
    message,
    data,
  }
}
