/** Returns the value if it's an array, otherwise an empty array. Guards the
 *  public site against malformed CMS overrides crashing a `.map()`. */
export function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
