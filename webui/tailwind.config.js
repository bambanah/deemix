const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    // https://medium.com/@kyis/vue-tailwind-purgecss-the-right-way-c70d04461475
    content: [
      "./public/**/*.html",
      "./public/**/*.ejs",
      "./src/**/*.vue",
      "./src/**/*.js",
    ],
    defaultExtractor(content) {
      const contentWithoutStyleBlocks = content.replace(
        /<style[^]+?<\/style>/gi,
        "",
      );
      return (
        contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
        []
      );
    },
    whitelist: [],
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
    ],
  },
  theme: {
    extend: {
      colors: {
        grayscale: {
          100: "hsl(0, 0%, 10%)",
          200: "hsl(0, 0%, 20%)",
          300: "hsl(0, 0%, 30%)",
          400: "hsl(0, 0%, 40%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 60%)",
          700: "hsl(0, 0%, 70%)",
          800: "hsl(0, 0%, 80%)",
          840: "hsl(0, 0%, 84%)", // Remove maybe
          870: "hsl(0, 0%, 87%)", // Remove maybe
          900: "hsl(0, 0%, 90%)",
          930: "hsl(0, 0%, 93%)", // Remove maybe
        },
        primary: "hsl(272, 100%, 61%)",
        background: {
          main: "var(--main-background)",
          secondary: "var(--secondary-background)",
        },
        foreground: "var(--foreground)",
        panels: {
          bg: "var(--panels-background)",
        },
      },
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    textColor: ({ after }) => after(["group-hover"]),
    margin: ({ before }) => before(["first"]),
    borderWidth: ["responsive", "first", "hover", "focus"],
    cursor: ["responsive", "hover"],
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
