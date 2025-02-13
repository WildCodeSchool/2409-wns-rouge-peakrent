import { FetchResult } from "@apollo/client";

export const handleMutation = async <T, V>(
  mutation: (options?: { variables: V }) => Promise<FetchResult<T>>,
  variables: V,
  successMessage: string
): Promise<T | undefined> => {
  try {
    const result = await mutation({ variables });
    if (result.data !== null && result.data !== undefined) {
      console.log(successMessage, result.data);
      return result.data;
    } else {
      console.warn("No data returned from mutation.");
      return undefined;
    }
  } catch (error) {
    console.error(`Error during ${successMessage.toLowerCase()}:`, error);
    return undefined;
  }
};
