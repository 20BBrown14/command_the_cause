import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from './errorTypes';

type Config<TBody> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: RequestInfo;
  body?: TBody;
  headers?: HeadersInit;
};

export const fetchWrapper = async <TData, TBody>({
  method = 'GET',
  url,
  body,
  ...additionalOptions
}: Config<TBody>): Promise<TData> => {
  const options = {
    ...additionalOptions,
    method: method,
    headers: {
      ...(additionalOptions.headers || {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body && JSON.stringify(body), // body can be undefined, that's ok
  };

  const response = await fetch(url, options);
  const data = await handleResponse<TData>(response);
  return data;
};

export const handleResponse = async <TData>(
  response: Response
): Promise<TData> => {
  if (response.status === 401) {
    const error = new Error('Unauthorized');
    throw error;
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `There has been an error. Response status: ${response.status}`
    );
  }

  let res;
  try {
    res = await response.json();

    if (response.status === 400) {
      throw new BadRequestError(res.message);
    }

    if (response.status === 403) {
      throw new ForbiddenError(res.message);
    }

    if (response.status === 404) {
      throw new NotFoundError(res.message);
    }
  } catch (err) {
    // if the status is 204, trying to parse the body will throw an error, so we should catch
    // but do nothing
  }
  return res;
};