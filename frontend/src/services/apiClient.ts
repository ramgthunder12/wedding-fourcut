export type HttpMethod = "GET" | "POST";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ?? `${window.location.protocol}//${window.location.hostname}:8080`;

export async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: BodyInit | Record<string, unknown>
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const payload = body && !isFormData ? JSON.stringify(body) : (body as BodyInit | undefined);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: payload
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
