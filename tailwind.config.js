module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#eefff6",
          "100": "#d7ffec",
          "200": "#b2ffdb",
          "300": "#76ffbf",
          "400": "#33f59c",
          "500": "#09de7c",
          "600": "#00a95c",
          "700": "#049152",
          "800": "#0a7143",
          "900": "#0a5d3a",
          "950": "#00341e",
        },
        accent: {
          "50": "#ffffe7",
          "100": "#feffc1",
          "200": "#fffd86",
          "300": "#fff441",
          "400": "#ffe60d",
          "500": "#ffd700",
          "600": "#d19e00",
          "700": "#a67102",
          "800": "#89580a",
          "900": "#74480f",
          "950": "#442604",
        },
        red: {
          "50": "#fef2f2",
          "100": "#ffe1e1",
          "200": "#ffc9ca",
          "300": "#fea3a5",
          "400": "#fc6d6f",
          "500": "#f43f42",
          "600": "#d01c1f",
          "700": "#bd181b",
          "800": "#9d1719",
          "900": "#821a1c",
          "950": "#470809",
        },
      },
      animation: {
        fadeIn: "fadeIn 700ms forwards",
        scaleup: "scaleup 700ms forwards",
        scaleButton: "scaleButton 400ms forwards",
        scaleUpAndDown: "scaleUpAndDown 700ms alternate infinite",
        slideToLeft: "slideToLeft 400ms forwards",
        slideToRight: "slideToRight 400ms forwards",
        slideFromLeft: "slideFromLeft 400ms forwards",
        slideFromRight: "slideFromRight 400ms forwards",
        slideFromTop: "slideFromTop 700ms forwards",
      },
      fontFamily: {
        sans: ['LouguiyaFR', 'sans-serif'],
      },

      //@ts-ignore
      keyframes: (theme) => ({
        fadeIn: {
          //@ts-ignore
          "0%": { opacity: theme("opacity.0") },

          //@ts-ignore
          "100%": { opacity: theme("opacity.100") },
        },
        scaleup: {
          "0%": {
            transform: "scale(0.3)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        scaleButton: {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.008)",
          },
        },
        blink: {
          "50%": {
            opacity: 0.5,
          },
        },
        scaleUpAndDown: {
          "0%": {
            transform: "scale(0.9)",
            opacity: 0.8,
          },
          "100%": {
            transform: "scale(1.1)",
            opacity: 1,
          },
        },
        slideToLeft: {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
          },
          "100%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
        },
        slideToRight: {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: 0,
          },
        },
        slideFromLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        slideFromRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        slideFromTop: {
          "0%": {
            transform: "translateY(-20%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      }),
    },
  },
  // daisyui: {
  //   themes: []
  // },

  // plugins: [require("@tailwindcss/forms"), require("daisyui")],
}

