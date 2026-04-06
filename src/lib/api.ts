const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID ?? "";
/** Must match this deployment’s row in the API (`Store.slug`). Prevents using another store’s id by mistake. */
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG ?? "fleettrack-pro";

export function getStoreId(): string {
  if (!STORE_ID) {
    console.warn("NEXT_PUBLIC_STORE_ID is not set");
  }
  return STORE_ID;
}

export function getExpectedStoreSlug(): string {
  return STORE_SLUG;
}

export type StoreConfigResult = { ok: true } | { ok: false; message: string };

/** Confirms `NEXT_PUBLIC_STORE_ID` is the id for this app’s slug (avoids Lighting id on Fleet, etc.). */
export async function verifyStoreConfig(): Promise<StoreConfigResult> {
  if (process.env.NEXT_PUBLIC_STORE_VERIFY === "false") {
    return { ok: true };
  }
  const id = getStoreId().trim();
  if (!id) {
    return { ok: false, message: "Set NEXT_PUBLIC_STORE_ID in .env to this storefront’s store id from the API." };
  }
  try {
    const res = await fetch(`${API}/stores/by-slug/${encodeURIComponent(STORE_SLUG)}`, { cache: "no-store" });
    if (res.status === 404) {
      return {
        ok: false,
        message: `No store with slug "${STORE_SLUG}". Create it or set NEXT_PUBLIC_STORE_SLUG to match your Store.slug.`,
      };
    }
    if (!res.ok) {
      return { ok: false, message: "Could not verify store configuration (API error)." };
    }
    const store = (await res.json()) as { id: string };
    if (store.id !== id) {
      return {
        ok: false,
        message: `NEXT_PUBLIC_STORE_ID in .env (${id}) does not match slug "${STORE_SLUG}" in the API (${store.id}). After re-seeding, copy the id from: ${API}/stores/by-slug/${STORE_SLUG} — then restart next dev.`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not reach the API to verify NEXT_PUBLIC_STORE_ID." };
  }
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-store-id": getStoreId(),
      ...(init?.headers as Record<string, string>),
    },
    cache: init?.cache ?? "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<T>;
}

export type StorefrontAccount = { id: string; email: string; name: string | null };

export async function storefrontLogout(): Promise<void> {
  await fetch(`${API}/storefront/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-store-id": getStoreId() },
  });
}

export async function fetchStorefrontAccount(): Promise<StorefrontAccount | null> {
  const res = await fetch(`${API}/storefront/auth/me`, {
    credentials: "include",
    headers: { "x-store-id": getStoreId() },
    cache: "no-store",
  });
  if (res.status === 401) {
    await storefrontLogout().catch(() => {});
    return null;
  }
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json() as Promise<StorefrontAccount>;
}

export type SavedAddress = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export async function fetchStorefrontAddresses(): Promise<SavedAddress[]> {
  const res = await fetch(`${API}/storefront/addresses`, {
    credentials: "include",
    headers: { "x-store-id": getStoreId() },
    cache: "no-store",
  });
  if (res.status === 401) return [];
  if (!res.ok) return [];
  return res.json() as Promise<SavedAddress[]>;
}

export type TrackedOrder = {
  id: string;
  orderNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  customerEmail: string | null;
  totalCents: number;
  subtotalCents: number;
  items: { productName: string; quantity: number; lineTotalCents: number; sku: string | null }[];
};

export async function trackStorefrontOrder(params: { orderNumber: string; email?: string }): Promise<TrackedOrder> {
  const orderNumber = params.orderNumber.trim();
  if (!orderNumber) throw new Error("Order number is required");
  const qs = new URLSearchParams({ orderNumber });
  const email = params.email?.trim();
  if (email) qs.set("email", email);
  const res = await fetch(`${API}/storefront/orders/track?${qs}`, {
    credentials: "include",
    headers: { "x-store-id": getStoreId() },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Could not load order (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) message = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<TrackedOrder>;
}

export { API };
