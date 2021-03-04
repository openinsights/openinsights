import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import sizes from "rollup-plugin-sizes";

const __dirname = path.resolve();
const extensions = [".ts", ".js"];
const commonPlugins = [
    terser({
      output: {
        comments: false
      }
    }),
    license({
      banner: {
        content: {
          file: "LICENSE_TEMPLATE"
        }
      }
    }),
    sizes()
];

export default [
  {
    input: "./src/index.ts",
    plugins: [
      resolve({ extensions }),
      typescript({
        target: "es5",
        composite: false
      }),
      ...commonPlugins
    ],
    output: {
      dir: path.resolve(__dirname, "dist"),
      format: "umd",
      name: "openinsights"
    }
  },
  {
    input: "./src/index.ts",
    plugins: [
      resolve({ extensions }),
      typescript({
        declaration: true,
        composite: false,
        declarationDir: path.resolve(__dirname, "dist", "esm", "types"),
        outDir: path.resolve(__dirname, "dist", "esm"),
        rootDir: path.resolve(__dirname, "src")
      }),
      ...commonPlugins
    ],
    output: {
      dir: path.resolve(__dirname, "dist", "esm"),
      format: "es"
    }
  }
];

