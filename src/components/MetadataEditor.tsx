import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  Info,
  Languages,
  Save,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MetadataEditorProps {
  selectedFiles?: Array<{
    id: string;
    name: string;
    type: string;
    preview: string;
    metadata?: {
      title: string;
      description: string;
      keywords: string[];
    };
  }>;
  onSave?: (metadata: any) => void;
  onExport?: (format: string) => void;
  onRunComplianceCheck?: () => void;
  onRunLegalValidation?: () => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({
  selectedFiles = [],
  onSave = () => {},
  onExport = () => {},
  onRunComplianceCheck = () => {},
  onRunLegalValidation = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("individual");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    keywords: string[];
    languages: { [key: string]: { description: string } };
  }>({
    title: selectedFiles?.[0]?.metadata?.title || "",
    description: selectedFiles?.[0]?.metadata?.description || "",
    keywords: selectedFiles?.[0]?.metadata?.keywords || [],
    languages: {
      en: { description: "" },
      es: { description: "" },
      fr: { description: "" },
    },
  });
  const [batchMetadata, setBatchMetadata] = useState<{
    title: string;
    description: string;
    keywords: string[];
    applyTitle: boolean;
    applyDescription: boolean;
    applyKeywords: boolean;
  }>({
    title: "",
    description: "",
    keywords: [],
    applyTitle: false,
    applyDescription: false,
    applyKeywords: false,
  });
  const [complianceResults, setComplianceResults] = useState<{
    status: "success" | "warning" | "error" | null;
    issues: Array<{
      type: string;
      message: string;
      severity: "low" | "medium" | "high";
    }>;
  }>({ status: null, issues: [] });
  const [legalResults, setLegalResults] = useState<{
    status: "success" | "warning" | "error" | null;
    issues: Array<{
      type: string;
      message: string;
      severity: "low" | "medium" | "high";
    }>;
  }>({ status: null, issues: [] });
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");

  const currentFile = selectedFiles[currentFileIndex] || null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (activeLanguage === "en") {
      setMetadata({ ...metadata, description: e.target.value });
    } else {
      setMetadata({
        ...metadata,
        languages: {
          ...metadata.languages,
          [activeLanguage]: { description: e.target.value },
        },
      });
    }
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !metadata.keywords.includes(keyword)) {
      setMetadata({ ...metadata, keywords: [...metadata.keywords, keyword] });
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setMetadata({
      ...metadata,
      keywords: metadata.keywords.filter((k) => k !== keyword),
    });
  };

  const handleKeywordReorder = (keyword: string, direction: "up" | "down") => {
    const index = metadata.keywords.indexOf(keyword);
    if (index === -1) return;

    const newKeywords = [...metadata.keywords];
    if (direction === "up" && index > 0) {
      [newKeywords[index], newKeywords[index - 1]] = [
        newKeywords[index - 1],
        newKeywords[index],
      ];
    } else if (direction === "down" && index < newKeywords.length - 1) {
      [newKeywords[index], newKeywords[index + 1]] = [
        newKeywords[index + 1],
        newKeywords[index],
      ];
    }

    setMetadata({ ...metadata, keywords: newKeywords });
  };

  const handleBatchChange = (field: string, value: any) => {
    setBatchMetadata({ ...batchMetadata, [field]: value });
  };

  const handleBatchApply = () => {
    // In a real app, this would apply the batch changes to all selected files
    console.log("Applying batch changes", batchMetadata);
  };

  const handleRunComplianceCheck = () => {
    onRunComplianceCheck();
    // Simulate compliance check results
    setComplianceResults({
      status: "warning",
      issues: [
        { type: "title", message: "Judul terlalu umum", severity: "medium" },
        {
          type: "keywords",
          message: "Menggunakan kurang dari 30 kata kunci mengurangi penemuan",
          severity: "low",
        },
      ],
    });
  };

  const handleRunLegalValidation = () => {
    onRunLegalValidation();
    // Simulate legal validation results
    setLegalResults({
      status: "warning",
      issues: [
        {
          type: "faces",
          message: "Terdeteksi wajah tanpa model release",
          severity: "high",
        },
        {
          type: "property",
          message: "Bangunan ikonik mungkin memerlukan property release",
          severity: "medium",
        },
      ],
    });
  };

  const handleSaveMetadata = () => {
    onSave(metadata);
  };

  const handleExport = (format: string) => {
    onExport(format);
  };

  const handleNavigateFile = (direction: "prev" | "next") => {
    if (direction === "prev" && currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    } else if (
      direction === "next" &&
      currentFileIndex < selectedFiles.length - 1
    ) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const renderKeywords = () => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">
            Kata Kunci ({metadata.keywords.length}/49)
          </h3>
          <div className="flex items-center space-x-2">
            <Input
              className="w-48 h-8"
              placeholder="Tambah kata kunci"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleKeywordAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLanguageDialog(true)}
            >
              <Languages className="h-4 w-4 mr-2" />
              Bahasa
            </Button>
          </div>
        </div>
        <ScrollArea className="h-48 border rounded-md p-2">
          <div className="flex flex-wrap gap-2">
            {metadata.keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center bg-muted rounded-md p-1"
              >
                <Badge variant="secondary" className="mr-1">
                  {index + 1}
                </Badge>
                <span className="text-sm mr-2">{keyword}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => handleKeywordReorder(keyword, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => handleKeywordReorder(keyword, "down")}
                    disabled={index === metadata.keywords.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-destructive"
                    onClick={() => handleKeywordRemove(keyword)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderIndividualEditor = () => {
    if (!currentFile)
      return <div className="p-4 text-center">Tidak ada berkas dipilih</div>;

    return (
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/3">
            <div className="aspect-square rounded-md overflow-hidden bg-muted">
              <img
                src={
                  currentFile.preview ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentFile.name}`
                }
                alt={currentFile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${currentFile.name}`;
                }}
              />
            </div>
            <div className="mt-2 text-sm text-center">
              {currentFileIndex + 1} dari {selectedFiles.length}
            </div>
            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigateFile("prev")}
                disabled={currentFileIndex === 0}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigateFile("next")}
                disabled={currentFileIndex === selectedFiles.length - 1}
              >
                Berikutnya
              </Button>
            </div>
          </div>
          <div className="w-2/3 space-y-4">
            <div>
              <Label htmlFor="title" className="flex items-center">
                Judul
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Buat judul deskriptif (maks 50 karakter)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={handleTitleChange}
                className="mt-1"
                placeholder="Masukkan judul deskriptif"
                maxLength={50}
              />
              <div className="text-xs text-right mt-1 text-muted-foreground">
                {metadata.title.length}/50 karakter
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="flex items-center">
                  Deskripsi
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deskripsi detail (maks 500 karakter)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={activeLanguage}
                  onValueChange={setActiveLanguage}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">Inggris</SelectItem>
                    <SelectItem value="es">Spanyol</SelectItem>
                    <SelectItem value="fr">Prancis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                id="description"
                value={
                  activeLanguage === "en"
                    ? metadata.description
                    : metadata.languages[activeLanguage]?.description || ""
                }
                onChange={handleDescriptionChange}
                className="mt-1"
                placeholder="Masukkan deskripsi detail"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-right mt-1 text-muted-foreground">
                {activeLanguage === "en"
                  ? metadata.description.length
                  : metadata.languages[activeLanguage]?.description.length || 0}
                /500 karakter
              </div>
            </div>

            {renderKeywords()}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <Button
              variant="outline"
              onClick={handleRunComplianceCheck}
              className="mr-2"
            >
              Jalankan Pemeriksaan Kepatuhan
            </Button>
            <Button variant="outline" onClick={handleRunLegalValidation}>
              Jalankan Validasi Hukum
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="mr-2"
            >
              Ekspor CSV
            </Button>
            <Button variant="default" onClick={handleSaveMetadata}>
              <Save className="h-4 w-4 mr-2" /> Simpan Metadata
            </Button>
          </div>
        </div>

        {(complianceResults.status || legalResults.status) && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hasil Validasi</CardTitle>
            </CardHeader>
            <CardContent>
              {complianceResults.status && (
                <div className="mb-4">
                  <h3 className="font-medium flex items-center">
                    <AlertCircle
                      className={`h-4 w-4 mr-2 ${
                        complianceResults.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    />
                    Masalah Kepatuhan
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {complianceResults.issues.map((issue, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <Badge
                          variant="outline"
                          className={`mr-2 ${
                            issue.severity === "high"
                              ? "border-red-500 text-red-500"
                              : issue.severity === "medium"
                                ? "border-amber-500 text-amber-500"
                                : "border-blue-500 text-blue-500"
                          }`}
                        >
                          {issue.severity === "high"
                            ? "tinggi"
                            : issue.severity === "medium"
                              ? "sedang"
                              : "rendah"}
                        </Badge>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {legalResults.status && (
                <div>
                  <h3 className="font-medium flex items-center">
                    <AlertCircle
                      className={`h-4 w-4 mr-2 ${
                        legalResults.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    />
                    Masalah Hukum
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {legalResults.issues.map((issue, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <Badge
                          variant="outline"
                          className={`mr-2 ${
                            issue.severity === "high"
                              ? "border-red-500 text-red-500"
                              : issue.severity === "medium"
                                ? "border-amber-500 text-amber-500"
                                : "border-blue-500 text-blue-500"
                          }`}
                        >
                          {issue.severity === "high"
                            ? "tinggi"
                            : issue.severity === "medium"
                              ? "sedang"
                              : "rendah"}
                        </Badge>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderBatchEditor = () => {
    return (
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">
            Edit Batch {selectedFiles.length} Berkas
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Perubahan akan diterapkan ke semua berkas yang dipilih. Pilih bidang
            yang akan diperbarui.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-title"
                  checked={batchMetadata.applyTitle}
                  onCheckedChange={(checked) =>
                    handleBatchChange("applyTitle", checked)
                  }
                />
                <Label htmlFor="apply-title">Terapkan Judul</Label>
              </div>
              <Input
                value={batchMetadata.title}
                onChange={(e) => handleBatchChange("title", e.target.value)}
                placeholder="Judul umum untuk semua berkas"
                disabled={!batchMetadata.applyTitle}
                className="w-2/3"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-description"
                  checked={batchMetadata.applyDescription}
                  onCheckedChange={(checked) =>
                    handleBatchChange("applyDescription", checked)
                  }
                />
                <Label htmlFor="apply-description">Terapkan Deskripsi</Label>
              </div>
              <Textarea
                value={batchMetadata.description}
                onChange={(e) =>
                  handleBatchChange("description", e.target.value)
                }
                placeholder="Deskripsi umum untuk semua berkas"
                disabled={!batchMetadata.applyDescription}
                className="w-2/3 h-20"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-keywords"
                  checked={batchMetadata.applyKeywords}
                  onCheckedChange={(checked) =>
                    handleBatchChange("applyKeywords", checked)
                  }
                />
                <Label htmlFor="apply-keywords">Terapkan Kata Kunci</Label>
              </div>
              <div className="w-2/3">
                <Input
                  placeholder="Tambahkan kata kunci umum (dipisahkan koma)"
                  disabled={!batchMetadata.applyKeywords}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const keywords = (e.target as HTMLInputElement).value
                        .split(",")
                        .map((k) => k.trim())
                        .filter((k) => k);
                      handleBatchChange("keywords", [
                        ...batchMetadata.keywords,
                        ...keywords,
                      ]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {batchMetadata.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center"
                    >
                      {keyword}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => {
                          const newKeywords = [...batchMetadata.keywords];
                          newKeywords.splice(index, 1);
                          handleBatchChange("keywords", newKeywords);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleBatchApply}>Terapkan ke Semua Berkas</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Batch</CardTitle>
            <CardDescription>
              Simpan dan muat template metadata umum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Fotografi Alam</span>
                <Button variant="outline" size="sm">
                  Muat
                </Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Gaya Hidup Urban</span>
                <Button variant="outline" size="sm">
                  Muat
                </Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Bisnis & Keuangan</span>
                <Button variant="outline" size="sm">
                  Muat
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Simpan Saat Ini sebagai Template
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="bg-background border rounded-lg shadow-sm">
      <Tabs
        defaultValue="individual"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Edit Individual</TabsTrigger>
            <TabsTrigger value="batch">Edit Batch</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="individual" className="mt-0">
            {renderIndividualEditor()}
          </TabsContent>

          <TabsContent value="batch" className="mt-0">
            {renderBatchEditor()}
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kelola Bahasa</DialogTitle>
            <DialogDescription>
              Tambah dan edit deskripsi dalam beberapa bahasa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <div className="font-medium">Inggris</div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 bg-green-50">
                  <Check className="h-3 w-3 mr-1" /> Utama
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {metadata.description.length > 0 ? "Selesai" : "Belum diatur"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <div className="font-medium">Spanyol</div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                  {metadata.languages.es?.description?.length > 0
                    ? "Selesai"
                    : "Belum diatur"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <div className="font-medium">Prancis</div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                  {metadata.languages.fr?.description?.length > 0
                    ? "Selesai"
                    : "Belum diatur"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLanguageDialog(false)}
            >
              Tutup
            </Button>
            <Button onClick={() => setShowLanguageDialog(false)}>
              <Globe className="h-4 w-4 mr-2" /> Terjemahan Otomatis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MetadataEditor;
