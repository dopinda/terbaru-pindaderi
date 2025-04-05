import React, { useState, useCallback } from "react";
import { Upload, FileX, FolderOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onTemplateLoad?: () => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected = () => {},
  onTemplateLoad = () => {},
  acceptedFileTypes = [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov"],
  maxFileSize = 100, // 100MB default
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(
          `${file.name} exceeds the maximum file size of ${maxFileSize}MB`,
        );
        continue;
      }

      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        errors.push(
          `${file.name} is not an accepted file type (accepted: ${acceptedFileTypes.join(", ")})`,
        );
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
    } else {
      setError(null);
    }

    return validFiles;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Create a unique array of files by name
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) return;

      // Create a map to track unique files by name
      const uniqueFiles = new Map();
      droppedFiles.forEach((file) => {
        if (!uniqueFiles.has(file.name)) {
          uniqueFiles.set(file.name, file);
        }
      });

      const validFiles = validateFiles(Array.from(uniqueFiles.values()));
      if (validFiles.length > 0) {
        // Clear the dataTransfer to prevent duplicate uploads
        e.dataTransfer.clearData();

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev === null) return 0;
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploadProgress(null);
                onFilesSelected(validFiles);
              }, 500);
              return 100;
            }
            return prev + 10;
          });
        }, 200);
      }
    },
    [onFilesSelected, validateFiles],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      // Create a unique array of files by name
      const selectedFiles = Array.from(e.target.files);

      // Create a map to track unique files by name
      const uniqueFiles = new Map();
      selectedFiles.forEach((file) => {
        if (!uniqueFiles.has(file.name)) {
          uniqueFiles.set(file.name, file);
        }
      });

      const validFiles = validateFiles(Array.from(uniqueFiles.values()));

      if (validFiles.length > 0) {
        // Clear the input to prevent duplicate uploads
        e.target.value = "";

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev === null) return 0;
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploadProgress(null);
                onFilesSelected(validFiles);
              }, 500);
              return 100;
            }
            return prev + 10;
          });
        }, 200);
      }
    },
    [onFilesSelected, validateFiles],
  );

  return (
    <div className="w-full bg-background">
      <Card className="w-full">
        <CardContent className="p-6">
          <div
            className={`relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-lg transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {uploadProgress !== null ? (
              <div className="w-full max-w-md space-y-4">
                <Upload className="w-12 h-12 mx-auto text-primary animate-pulse" />
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  Uploading files... {uploadProgress}%
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Drag & Drop Files</h3>
                <p className="mb-4 text-sm text-center text-muted-foreground max-w-md">
                  Drop your image or video files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Accepted formats: {acceptedFileTypes.join(", ")} (Max:{" "}
                  {maxFileSize}MB)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept={acceptedFileTypes.join(",")}
                  multiple={multiple}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <FileX className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={onTemplateLoad}
              className="flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Load Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploader;
