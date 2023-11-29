export default {
  input: ["app.js"],
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].mjs",
      format: "esm",
      exports: "named"
    }
  ],
  plugins: [],
  external: []
}