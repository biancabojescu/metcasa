const cleanQuery = (q: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(q)) {
    if (v === null || v === undefined || v === "") continue
    out[k] = v
  }
  return out
}

export const useListings = () => {
  const api = useApi()

  const fetchList = (filters: ListingFilters = {}) =>
    api<ListingsPage>("/listings", { method: "GET", query: cleanQuery(filters) })

  const fetchOne = (id: number) =>
    api<{ data: Listing }>(`/listings/${id}`, { method: "GET" })

  const create = (body: FormData) =>
    api<{ message: string; data: Listing }>("/listings", { method: "POST", body })

  const update = (id: number, body: FormData) =>
    api<{ message: string; data: Listing }>(`/listings/${id}`, { method: "POST", body })

  const remove = (id: number) =>
    api<{ message: string }>(`/listings/${id}`, { method: "DELETE" })

  return { fetchList, fetchOne, create, update, remove }
}
