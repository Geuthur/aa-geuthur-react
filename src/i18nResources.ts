/**
 * Translations of this package, one bundle per language, bundled at build time from
 * `i18n/<lng>/aa-geuthur-react.json`. Every file in `i18n/` is picked up, so a language
 * Weblate adds needs no change here.
 */
const files = import.meta.glob<Record<string, string>>("../i18n/*/aa-geuthur-react.json", {
  eager: true,
  import: "default",
});

/** `{ de: { Close: "" }, en: { Close: "Close" }, … }` keyed by the directory name of the file. */
export const i18nResources: Record<string, Record<string, string>> = {};
for (const [path, bundle] of Object.entries(files)) {
  const lng = path.split("/").at(-2);
  if (lng) i18nResources[lng] = bundle;
}
