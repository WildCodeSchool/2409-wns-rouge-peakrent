// export function getQueryFromMutation(mutation: DocumentNode): string {
//   return `#graphql${mutation.loc.source.body}`;
// }
export function getQueryFromMutation(mutation: string): string {
  return `#graphql${mutation}`;
}
