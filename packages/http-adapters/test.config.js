export default {
    input: ["src/index.t.js"],
    output: [
      {
        dir: "lib",
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named"
      }
    ],
    plugins: [],
    external: []
  };