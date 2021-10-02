module.exports = {
  purge: {
    content: ["./layouts/**/*.html"],
    extractors: [
      {
        extractor: (content) => {
          let els = JSON.parse(content).htmlElements;
          return els.tags.concat(els.classes, els.ids);
        },
      },
    ],
    mode: "all",
    enabled: process.env.HUGO_ENVIRONMENT === "production",
    options: {
      keyframes: true,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      display: ["Gilroy", "sans-serif"],
      body: ["Graphik", "sans-serif"],
    },
    borderWidth: {
      default: "1px",
      0: "0",
      2: "2px",
      4: "4px",
    },
    extend: {
      colors: {
        grayish: "#0D2439",
        blackish: "#5E81AC",
        cyan: "#9cdbff",
      },
      spacing: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
