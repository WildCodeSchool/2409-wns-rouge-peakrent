import { Paperclip } from "lucide-react";
import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { FileSvgDraw } from "@/components/icons/uploadFileSvg";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/uploadingFile";

type FileUploaderInputProps = {
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  setFilesFunction?: (files: File[] | null) => void;
  formFiles?: File[] | null;
};

const FileUploaderInput = forwardRef(
  (
    {
      maxFiles = 1,
      maxSize = 1024 * 1024 * 4,
      multiple = false,
      setFilesFunction,
      formFiles,
    }: FileUploaderInputProps,
    ref
  ) => {
    const [files, setFiles] = useState<File[] | null>(formFiles ?? null);
    const dropZoneConfig = {
      maxFiles,
      maxSize,
      multiple,
    };

    useEffect(() => {
      setFiles(formFiles ?? null);
    }, [formFiles]);

    const handleSetFiles = (files: File[] | null) => {
      if (files && files.length > 0) {
        setFiles(files);
        if (setFilesFunction) {
          setFilesFunction(files);
        }
      } else {
        setFiles([]);
        if (setFilesFunction) {
          setFilesFunction(null);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      resetFiles: () => {
        setFiles(null);
      },
    }));

    return (
      <FileUploader
        value={files}
        onValueChange={handleSetFiles}
        dropzoneOptions={dropZoneConfig}
        className="bg-background relative rounded-[5px] p-2"
      >
        {(!files || files?.length === 0 || files.length < maxFiles) && (
          <FileInput className="hover:bg-card/10 outline-dashed outline-1">
            <div className="flex w-full flex-col flex-wrap items-center justify-center rounded-[5px] p-4">
              <FileSvgDraw
                clickText={"uploadFileClickText"}
                dragText={"uploadFileDragText"}
                extensionsText={"uploadFileExtensionsText"}
              />
            </div>
          </FileInput>
        )}
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <Fragment key={i}>
                <FileUploaderItem key={i} index={i}>
                  <Paperclip className="size-4 stroke-current" />
                  <span className="max-w-[300px] truncate" title={file.name}>
                    {file.name}
                  </span>
                </FileUploaderItem>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    width={320}
                    height={300}
                    alt={file.name}
                    className="mt-2 h-[300px] w-full max-w-[320px] rounded border object-contain mx-auto"
                  />
                )}

                {file.type === "application/pdf" && (
                  <embed
                    src={URL.createObjectURL(file)}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="mt-2 h-64 w-full rounded border object-contain mx-auto"
                  />
                )}
              </Fragment>
            ))}
        </FileUploaderContent>
      </FileUploader>
    );
  }
);

FileUploaderInput.displayName = "FileUploaderInput";

export default FileUploaderInput;
