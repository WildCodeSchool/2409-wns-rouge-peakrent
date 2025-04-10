import { DocumentNode } from "graphql";

export function getQueryFromMutation(mutation: DocumentNode): string {
  return `#graphql${mutation.loc.source.body}`;
}
