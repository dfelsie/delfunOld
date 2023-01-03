export default function isNullOrUndefined(
  val: unknown
): val is null | undefined {
  return typeof val === "undefined" || val === null;
}
