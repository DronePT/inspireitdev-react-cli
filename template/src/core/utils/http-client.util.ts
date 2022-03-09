/* eslint-disable max-classes-per-file */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestTransformer,
  Method,
} from 'axios';

interface HttpOnRequest {
  (data: any, headers: Record<string, string | number | boolean>): any;
}

export class HttpError<T> extends Error {
  code: number;

  data?: T;

  constructor(message: string, code = 400, data?: T) {
    super(message);

    this.code = code;
    this.data = data;

    this.name = this.constructor.name;
  }
}

export class HttpClient {
  private client: AxiosInstance;

  private resource: string;

  private onRequest?: HttpOnRequest;

  constructor(
    resource: string,
    baseURL = process.env.REACT_APP_BASE_URL,
    config: AxiosRequestConfig = {},
  ) {
    this.resource = resource;

    this.client = axios.create({
      baseURL,
      ...config,
    });
  }

  protected setOnRequest(onRequest: HttpOnRequest) {
    this.onRequest = onRequest;

    return this;
  }

  private qs(url: string, query: Record<string, any> = {}): string {
    const keyValues = Object.entries(query);
    const u = [this.resource, url].join('');

    if (!keyValues.length) return u;

    const qs = keyValues.map((keyValue) => keyValue.join('=')).join('&');

    const joinString = u.includes('?') ? '&' : '?';

    return [u, qs].join(joinString);
  }

  private async request<T, E>(
    method: Method,
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const request = {
        method,
        url,
        ...config,
      };

      if (this.onRequest) {
        request.transformRequest = this.onRequest as AxiosRequestTransformer;
      }

      const result = await this.client.request(request);

      return result.data;
    } catch (error) {
      if (!(error as AxiosError).isAxiosError) throw error;

      const err = error as AxiosError;

      const { message, response } = err;
      const { status = 400, data } = response || {};

      throw new HttpError<E>(message, status, data);
    }
  }

  async get<T>(
    url: string,
    query = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('GET', this.qs(url, query), config);
  }

  async post<T>(
    url: string,
    body = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('POST', this.qs(url), {
      data: body,
      ...config,
    });
  }

  async put<T>(
    url: string,
    body = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('PUT', this.qs(url), {
      data: body,
      ...config,
    });
  }

  async patch<T>(
    url: string,
    body = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('PATCH', this.qs(url), {
      data: body,
      ...config,
    });
  }

  async delete<T>(
    url: string,
    query = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request('DELETE', this.qs(url, query), config);
  }
}
