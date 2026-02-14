export class ServiceResponseDto<T> {
  state: boolean;
  data: T;
  message: string;
  statusCode?: number;
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
  errors?: any[];
}
