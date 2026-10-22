interface ApiErrorBody {
  message?: string;
  action?: string;
}

export class ApiError extends Error {
  action?: string;
  statusCode: number;

  constructor(params: {
    message: string;
    action?: string;
    statusCode: number;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.action = params.action;
    this.statusCode = params.statusCode;
  }
}

export async function apiFetch<T = void>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch {
    throw new ApiError({
      message: "Não foi possível conectar ao servidor.",
      action: "Verifique sua conexão e tente novamente.",
      statusCode: 0,
    });
  }

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;

    throw new ApiError({
      message: errorBody?.message ?? "Algo deu errado.",
      action: errorBody?.action,
      statusCode: response.status,
    });
  }

  return body as T;
}

export function getErrorText(error: unknown): string {
  if (error instanceof ApiError) {
    return [error.message, error.action].filter(Boolean).join(" ");
  }

  return "Algo deu errado. Tente novamente.";
}
