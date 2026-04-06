const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID ?? "";

export async function serverApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-store-id": STORE_ID,
      ...(init?.headers as Record<string, string>),
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
