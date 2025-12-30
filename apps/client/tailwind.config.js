/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933",
        gold: "#FFD700",
        kumkum: "#C21E56",
        sandal: "#F5DEB3",
        "dark-brown": "#4B3621",
      },
    },
  },
  plugins: [],
};
