import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form"; // For type safety from react-hook-form

import FileUploaderInput from "@/components/ui/FileUploaderInput";

// Define the props types for the component
interface FileUploadFormFieldProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name?: any; // 'name' should correspond to a field in the form values
  label?: string; // Label for the form field
  maxFiles?: number; // Optional, with a default of 1
}

// Create a form field for file upload
export const FileUpload = <T extends FieldValues>({
  form,
  name = "file",
  label = "Upload File",
  maxFiles = 1,
}: FileUploadFormFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FileUploaderInput
              maxFiles={maxFiles}
              setFilesFunction={(files) => {
                field.onChange(files ?? []);
              }}
              multiple={maxFiles > 1}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
