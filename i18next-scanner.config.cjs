const typescriptTransform = require("i18next-scanner-typescript");

// Every text of the package lives in the namespace `aa-geuthur-react`. The files
// `i18n/<lng>/aa-geuthur-react.json` are bundled into the package (`src/i18nResources.ts`) and
// translated in Weblate. The scanner maintains only `en`, the Weblate template (key equals value).
// The other languages hold real translations only, Weblate writes them and leaves untranslated
// texts out; a missing key falls back to English through `fallbackLng`.
module.exports = {
  input: [
    "src/**/*.{js,jsx,ts,tsx}",
    // Use ! to filter out files or directories
    "!src/__tests__/**",
    "!src/setupTests.ts",
    "!**/node_modules/**",
  ],
  output: "./",
  options: {
    debug: true,
    func: {
      list: ["i18next.t", "i18n.t", "t"],
      extensions: [".js", ".jsx"],
    },
    trans: false,
    lngs: ["en"],
    ns: ["aa-geuthur-react"],
    defaultLng: "en",
    defaultNs: "aa-geuthur-react",
    defaultValue: function (lng, ns, key) {
      return key;
    },
    resource: {
      loadPath: "i18n/{{lng}}/{{ns}}.json",
      savePath: "i18n/{{lng}}/{{ns}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
  },
  transform: typescriptTransform(
    {
      extensions: [".ts", ".tsx"],
      tsOptions: {
        target: "es5",
        module: "esnext",
      },
    },
    function transform(outputText, file, enc, done) {
      this.parser.parseFuncFromString(outputText);
      done();
    }
  ),
};
