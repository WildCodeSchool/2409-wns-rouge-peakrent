import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues } from "react-hook-form"; // For type safety from react-hook-form

import FileUploaderInput from "@/components/ui/FileUploaderInput";

// Define the props types for the component
interface FileUploadFormFieldProps<T extends FieldValues> {
  form: any;
  name?: any; // 'name' should correspond to a field in the form values
  label?: string; // Label for the form field
  maxFiles?: number; // Optional, with a default of 1
  files?: File[] | null;
}

// Create a form field for file upload
export const FileUpload = <T extends FieldValues>({
  form,
  name = "file",
  label = "Upload File",
  maxFiles = 1,
  files,
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
                field.onChange(files);
              }}
              multiple={maxFiles > 1}
              formFiles={files}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
