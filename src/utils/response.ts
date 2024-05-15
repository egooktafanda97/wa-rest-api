export function responseSuccessWithData(data: any): { data: any } {
  return { data };
}

export function responseSuccessWithMessage(
  message: string = 'Yeyy... Request Send With Successfully'
): { message: string } {
  return { message };
}

export function responseErrorWithMessage(
  message: string = 'Upsss... Something went wrong on server'
): { message: string } {
  return { message };
}
