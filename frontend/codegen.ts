import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8080/api",
  documents: "src/**/*.ts",
  generates: {
    "src/gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      plugins: [],
    },
  },
};

export default config;
