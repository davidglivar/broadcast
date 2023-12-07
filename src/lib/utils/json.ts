/**
 * Stringify a serializable object with shared output settings.
 * @param obj Any json serializable object
 * @returns the stringified object
 */
export function stringify(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
