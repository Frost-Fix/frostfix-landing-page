const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

type RequestOptions = {
    token?: string | null;
    query?: Record<string, string | number | boolean | undefined>;
};

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
    const url = new URL(`${API_BASE_URL}${path}`);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url.toString();
};

const request = async <T = any>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    options: RequestOptions = {}
): Promise<T> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(buildUrl(path, options.query), {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
        const message =
            payload?.error?.message ||
            payload?.message ||
            "Something went wrong. Please try again.";
        throw new ApiError(message, response.status);
    }

    return payload;
};

export const apiGet = <T = any>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options);

export const apiPost = <T = any>(
    path: string,
    body?: unknown,
    options?: RequestOptions
) => request<T>("POST", path, body, options);

export const apiPatch = <T = any>(
    path: string,
    body?: unknown,
    options?: RequestOptions
) => request<T>("PATCH", path, body, options);

export const apiDelete = <T = any>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options);

export { API_BASE_URL };
