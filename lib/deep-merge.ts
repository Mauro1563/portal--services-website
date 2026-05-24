export type Json = Record<string, unknown>;

export function isObject(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Deep-merge override into base. Arrays and primitives in override win. */
export function deepMerge<T extends Json>(base: T, override: Json): T {
  const out: Json = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (isObject(v) && isObject(out[k])) {
      out[k] = deepMerge(out[k] as Json, v);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}
