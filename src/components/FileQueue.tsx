import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Play,
  FileImage,
  FileVideo,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
  size: number;
  thumbnail?: string;
  status: "pending" | "processing" | "completed" | "error";
  progress?: number;
  selected?: boolean;
}

interface FileQueueProps {
  files?: FileItem[];
  selectedFiles?: string[];
  onProcessFiles?: () => void;
  onClearQueue?: () => void;
  onSelectFile?: (fileId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onRemoveFile?: (fileId: string) => void;
  isProcessing?: boolean;
}

const FileQueue = ({
  files = [],
  selectedFiles = [],
  onProcessFiles = () => {},
  onClearQueue = () => {},
  onSelectFile = (fileId: string, selected: boolean) => {},
  onSelectAll = (selected: boolean) => {},
  onRemoveFile = (fileId: string) => {},
  isProcessing = false,
}: FileQueueProps) => {
  const [selectAll, setSelectAll] = useState(
    files.length > 0 && files.every((file) => file.selected),
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    onSelectAll(checked);
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    onSelectFile(fileId, checked);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Calculate total size of all files
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const formattedTotalSize = formatFileSize(totalSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Play className="h-3 w-3" /> Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-green-600 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Error
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const selectedCount = files.filter((file) => file.selected).length;
  const isAnyFileProcessing = files.some(
    (file) => file.status === "processing",
  );

  return (
    <Card className="w-full bg-background border shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">File Queue</h3>
            <Badge variant="outline">
              {files.length} files ({formattedTotalSize})
            </Badge>
            {selectedCount > 0 && (
              <Badge variant="secondary">{selectedCount} selected</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearQueue}
              disabled={files.length === 0}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear Queue
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onProcessFiles}
              disabled={
                files.length === 0 || isAnyFileProcessing || isProcessing
              }
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Process Files
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[250px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all files"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Preview</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>Tidak ada file dalam antrian.</p>
                      <p>
                        Seret dan lepas file atau gunakan browser file untuk
                        menambahkan file.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Checkbox
                        checked={file.selected}
                        onCheckedChange={(checked) =>
                          handleSelectFile(file.id, !!checked)
                        }
                        aria-label={`Select ${file.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        {file.thumbnail ? (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${file.name}`;
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            {file.type === "image" ? (
                              <FileImage className="h-6 w-6 text-muted-foreground" />
                            ) : (
                              <FileVideo className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>
                      {file.type === "image" ? "Image" : "Video"}
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      {getStatusBadge(file.status)}
                      {file.status === "processing" &&
                        file.progress !== undefined && (
                          <Progress
                            value={file.progress}
                            className="h-1 mt-2"
                          />
                        )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFile(file.id)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {files.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              Select files to perform batch operations or process all files to
              generate metadata.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileQueue;
