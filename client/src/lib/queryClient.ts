import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getTopicsOffline, getSecretsOffline, getProgressForTopic, storeTopicsOffline, storeSecretsOffline } from "./offline-storage";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache data for offline use
      if (url === "/api/topics") {
        storeTopicsOffline(data);
      } else if (url === "/api/secrets") {
        storeSecretsOffline(data);
      }
      
      return data;
    } catch (error) {
      // Return offline data when network fails
      console.log('Network request failed, trying offline data:', url);
      
      if (url === "/api/topics") {
        const offlineData = getTopicsOffline();
        if (offlineData.length > 0) return offlineData as T;
      } else if (url === "/api/secrets") {
        const offlineData = getSecretsOffline();
        if (offlineData.length > 0) return offlineData as T;
      } else if (url.startsWith("/api/progress/")) {
        const topicLabel = decodeURIComponent(url.split("/api/progress/")[1]);
        const offlineProgress = getProgressForTopic(topicLabel);
        if (offlineProgress) return offlineProgress as T;
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
