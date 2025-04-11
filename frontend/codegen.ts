import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5050",
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
