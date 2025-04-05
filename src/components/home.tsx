import React, { useState } from "react";
import { motion } from "framer-motion";
import FileUploader from "./FileUploader";
import FileQueue from "./FileQueue";
import MetadataEditor from "./MetadataEditor";
import ValidationPanel from "./ValidationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Settings, HelpCircle, Save, Download } from "lucide-react";

const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<
    Array<{
      file: File;
      metadata: {
        title: string;
        description: string;
        keywords: string[];
        compliance: {
          isValid: boolean;
          warnings: string[];
        };
        legal: {
          isValid: boolean;
          warnings: string[];
        };
      };
    }>
  >([]);

  const handleFilesAdded = (newFiles: File[]) => {
    // Create a map of existing files by name for faster lookup
    const existingFilesMap = new Map();
    files.forEach((file) => existingFilesMap.set(file.name, true));

    // Filter out duplicates
    const uniqueNewFiles = newFiles.filter(
      (file) => !existingFilesMap.has(file.name),
    );

    if (uniqueNewFiles.length === 0) return;

    // Add unique files to state
    const updatedFiles = [...files, ...uniqueNewFiles];
    setFiles(updatedFiles);

    // Automatically select newly added files
    const startIndex = files.length;
    const newIndexes = uniqueNewFiles.map((_, i) => startIndex + i);
    setSelectedFiles((prev) => [...prev, ...newIndexes]);
    console.log("Files added:", uniqueNewFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((i) => i !== index));
  };

  const handleSelectFile = (index: number) => {
    setSelectedFiles((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleProcessFiles = () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const processed = files.map((file) => {
        // Create a copy of the file to ensure it's properly accessible
        const fileBlob = new Blob([file], { type: file.type });
        const fileCopy = new File([fileBlob], file.name, { type: file.type });

        // Generate more relevant metadata based on file type and name
        const isImage = file.type.includes("image");
        const fileName = file.name.split(".")[0].replace(/[_-]/g, " ");
        const capitalizedFileName =
          fileName.charAt(0).toUpperCase() + fileName.slice(1);

        // Generate 40-49 single-word keywords
        // Base keywords for all content types
        const baseKeywords = [
          "photography",
          "stock",
          "image",
          "professional",
          "quality",
          "commercial",
          "creative",
          "digital",
          "modern",
          "clean",
          "beautiful",
          "detailed",
          "vibrant",
          "sharp",
          "clear",
          "artistic",
          "contemporary",
          "premium",
          "elegant",
          "stylish",
        ];

        // Media type specific keywords
        const mediaTypeKeywords = isImage
          ? [
              "photo",
              "picture",
              "snapshot",
              "photograph",
              "wallpaper",
              "backdrop",
              "visual",
              "still",
              "capture",
              "shot",
            ]
          : [
              "video",
              "footage",
              "clip",
              "film",
              "motion",
              "sequence",
              "recording",
              "movie",
              "reel",
              "animation",
            ];

        // Color and visual keywords
        const visualKeywords = [
          "colorful",
          "bright",
          "dark",
          "light",
          "shadow",
          "contrast",
          "saturated",
          "muted",
          "focus",
          "blur",
        ];

        // Subject matter keywords based on filename
        const subjectKeywords = [];
        const lcFileName = fileName.toLowerCase();

        // Nature/landscape related
        if (lcFileName.includes("nature") || lcFileName.includes("landscape")) {
          subjectKeywords.push(
            "nature",
            "landscape",
            "outdoor",
            "scenic",
            "mountain",
            "forest",
            "tree",
            "sky",
            "cloud",
            "water",
            "river",
            "lake",
            "ocean",
            "beach",
            "sunset",
            "sunrise",
            "horizon",
            "environment",
            "wilderness",
          );
        }
        // People/portrait related
        else if (
          lcFileName.includes("person") ||
          lcFileName.includes("people") ||
          lcFileName.includes("portrait")
        ) {
          subjectKeywords.push(
            "portrait",
            "people",
            "person",
            "face",
            "smile",
            "expression",
            "emotion",
            "human",
            "model",
            "lifestyle",
            "fashion",
            "beauty",
            "adult",
            "young",
            "professional",
            "casual",
            "formal",
          );
        }
        // Urban/city related
        else if (lcFileName.includes("city") || lcFileName.includes("urban")) {
          subjectKeywords.push(
            "urban",
            "city",
            "architecture",
            "building",
            "skyline",
            "street",
            "downtown",
            "metropolitan",
            "skyscraper",
            "structure",
            "construction",
            "landmark",
            "modern",
            "office",
            "residential",
            "commercial",
          );
        }
        // Sports related
        else if (
          lcFileName.includes("sport") ||
          lcFileName.includes("jersey") ||
          lcFileName.includes("team")
        ) {
          subjectKeywords.push(
            "sport",
            "athletic",
            "team",
            "game",
            "competition",
            "player",
            "jersey",
            "uniform",
            "equipment",
            "fitness",
            "active",
            "match",
            "tournament",
            "championship",
            "league",
            "professional",
          );
        }
        // Add generic keywords if no specific category is detected
        else {
          subjectKeywords.push(
            "object",
            "item",
            "product",
            "design",
            "concept",
            "abstract",
            "detail",
            "closeup",
            "texture",
            "pattern",
            "background",
            "composition",
            "arrangement",
            "collection",
            "set",
          );
        }

        // Add any single words from filename that are at least 3 chars
        const filenameKeywords = fileName
          .split(" ")
          .filter((word) => word.length >= 3)
          .map((word) => word.toLowerCase());

        // Combine all keywords and remove duplicates
        const allKeywords = [
          ...baseKeywords,
          ...mediaTypeKeywords,
          ...visualKeywords,
          ...subjectKeywords,
          ...filenameKeywords,
        ];
        const uniqueKeywords = [...new Set(allKeywords)];

        // Ensure we have between 40-49 keywords
        const finalKeywords = uniqueKeywords.slice(0, 49);

        return {
          file: fileCopy,
          metadata: {
            title: `${capitalizedFileName} - Professional ${isImage ? "Photo" : "Video"} Asset`,
            description: `High quality ${isImage ? "image" : "video"} featuring ${fileName}. Perfect for commercial use, marketing materials, and creative projects.`,
            keywords: finalKeywords, // Using 40-49 single-word keywords
            compliance: {
              isValid: true,
              warnings: [],
            },
            legal: {
              isValid: true,
              warnings: [],
            },
          },
        };
      });
      setProcessedFiles(processed);
      setIsProcessing(false);
      setActiveTab("metadata");
    }, 2000);
  };

  const handleClearQueue = () => {
    setFiles([]);
    setSelectedFiles([]);
    setProcessedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <h1 className="text-2xl font-bold text-primary">
              Generator Metadata AI
            </h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              Beta
            </span>
          </motion.div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="upload">Unggah Berkas</TabsTrigger>
              <TabsTrigger
                value="metadata"
                disabled={processedFiles.length === 0}
              >
                Edit Metadata
              </TabsTrigger>
              <TabsTrigger
                value="export"
                disabled={processedFiles.length === 0}
              >
                Ekspor
              </TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              {activeTab === "metadata" && (
                <Button variant="outline" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Template
                </Button>
              )}
              {activeTab === "export" && (
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Ekspor Semua
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FileUploader onFilesSelected={handleFilesAdded} />
                <div className="mt-6">
                  <FileQueue
                    files={files.map((file, index) => ({
                      id: index.toString(),
                      name: file.name,
                      type: file.type.includes("image") ? "image" : "video",
                      size: file.size,
                      thumbnail: file.type.includes("image")
                        ? URL.createObjectURL(file)
                        : file.type.includes("video")
                          ? "https://images.unsplash.com/photo-1601974915460-f55ea921f8ad?w=200&q=80"
                          : undefined,
                      status: "pending",
                      selected: selectedFiles.includes(index),
                    }))}
                    selectedFiles={selectedFiles.map(String)}
                    onSelectFile={(fileId, selected) =>
                      handleSelectFile(parseInt(fileId))
                    }
                    onRemoveFile={(fileId) =>
                      handleRemoveFile(parseInt(fileId))
                    }
                    onProcessFiles={handleProcessFiles}
                    onClearQueue={handleClearQueue}
                    isProcessing={isProcessing}
                    onSelectAll={(selected) => {
                      if (selected) {
                        setSelectedFiles(files.map((_, i) => i));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border p-4 h-full">
                  <h3 className="text-lg font-medium mb-4">
                    Template & Preset
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Muat template atau preset untuk menerapkan pengaturan
                    metadata ke berkas Anda.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Fotografi Alam
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Koleksi Potret
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Video Perjalanan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      + Buat Template Baru
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <MetadataEditor
                  files={processedFiles}
                  selectedFiles={selectedFiles
                    .filter((index) => processedFiles[index])
                    .map((index) => ({
                      id: index.toString(),
                      name: processedFiles[index]?.file.name || "",
                      type: processedFiles[index]?.file.type.includes("image")
                        ? "image"
                        : "video",
                      preview: URL.createObjectURL(processedFiles[index]?.file),
                      metadata: processedFiles[index]?.metadata,
                    }))}
                  onSave={(metadata) =>
                    console.log("Saving metadata:", metadata)
                  }
                  onExport={(format) => console.log("Exporting as:", format)}
                  onRunComplianceCheck={() =>
                    console.log("Running compliance check")
                  }
                  onRunLegalValidation={() =>
                    console.log("Running legal validation")
                  }
                />
              </div>
              <div className="lg:col-span-1">
                <ValidationPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Opsi Ekspor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Format Berkas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="xmp"
                        name="format"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <label htmlFor="xmp">Embed XMP/IPTC Metadata</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="csv"
                        name="format"
                        className="h-4 w-4"
                      />
                      <label htmlFor="csv">Export as CSV</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="json"
                        name="format"
                        className="h-4 w-4"
                      />
                      <label htmlFor="json">Export as JSON</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="xlsx"
                        name="format"
                        className="h-4 w-4"
                      />
                      <label htmlFor="xlsx">Export as XLSX</label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pengaturan Ekspor</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeOriginal"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <label htmlFor="includeOriginal">
                        Sertakan nama berkas asli
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeValidation"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <label htmlFor="includeValidation">
                        Sertakan hasil validasi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="groupByFolder"
                        className="h-4 w-4"
                      />
                      <label htmlFor="groupByFolder">
                        Kelompokkan berdasarkan struktur folder
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Batal</Button>
                <Button>Ekspor Berkas</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Generator Metadata AI untuk Adobe Stock © 2023
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {files.length} berkas dalam antrian
              </span>
              <span className="text-sm text-muted-foreground">
                {processedFiles.length} diproses
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
