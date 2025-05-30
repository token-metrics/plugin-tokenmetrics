import axios, { type AxiosRequestConfig } from "axios";

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Validate the presence of the Token Metrics API key.
 * @throws Will throw an error if the API key is not set.
 * @returns The API key.
 */
export function validateApiKey(): string {
    const apiKey = process.env.TOKEN_METRICS_API_KEY;
    if (!apiKey) {
        throw new Error("Token Metrics API key is not set");
    }
    return apiKey;
}

/**
 * Validate if a given input string is non-empty.
 * @param input - The input string to validate.
 * @param field - Optional field name for error clarity.
 */
export function validateInput(input: string, field = "Input"): void {
    if (!input.trim()) {
        throw new Error(`${field} cannot be empty`);
    }
}

/**
 * Send a request to the Token Metrics API.
 * @param url - Full Token Metrics API URL.
 * @param params - Optional query parameters.
 * @param apiKey - Token Metrics API key.
 * @returns The response data.
 * @throws Will throw an error for request failures or rate limits.
 */
export async function callTokenMetricsApi<T>(
    url: string,
    params: Record<string, unknown> = {},
    apiKey: string
): Promise<T> {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            timeout: DEFAULT_TIMEOUT,
            params,
        };
        const response = await axios.get<T>(url, config);
        return response.data;
    } catch (error) {
        console.error("Error communicating with Token Metrics API:", error instanceof Error ? error.message : String(error));
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error("Rate limit exceeded. Please try again later.");
            }
            if (error.response?.status === 401) {
                throw new Error("Invalid API key for Token Metrics.");
            }
        }
        throw new Error("Failed to communicate with Token Metrics API");
    }
}
