import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ValidationIssue {
  type: "compliance" | "legal";
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  suggestions?: string[];
}

interface ValidationPanelProps {
  issues?: ValidationIssue[];
  onFixIssue?: (issueIndex: number) => void;
  onIgnoreIssue?: (issueIndex: number) => void;
  onRunValidation?: () => void;
  isValidating?: boolean;
}

const ValidationPanel = ({
  issues = [],
  onFixIssue = () => {},
  onIgnoreIssue = () => {},
  onRunValidation = () => {},
  isValidating = false,
}: ValidationPanelProps) => {
  const complianceIssues = issues.filter(
    (issue) => issue.type === "compliance",
  );
  const legalIssues = issues.filter((issue) => issue.type === "legal");

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return (
          <AlertCircle
            className="h-5 w-5 text-destructive"
            aria-label="Error"
          />
        );
      case "warning":
        return (
          <AlertTriangle
            className="h-5 w-5 text-amber-500"
            aria-label="Warning"
          />
        );
      case "info":
        return (
          <Info className="h-5 w-5 text-blue-500" aria-label="Information" />
        );
      default:
        return (
          <Info className="h-5 w-5 text-blue-500" aria-label="Information" />
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="destructive">Kesalahan</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Peringatan</Badge>;
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <Card className="w-full h-full bg-background border shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Hasil Validasi
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRunValidation}
            disabled={isValidating}
          >
            {isValidating ? "Memvalidasi..." : "Jalankan Validasi"}
          </Button>
        </div>
        <CardDescription>Hasil validasi kepatuhan dan hukum</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-muted-foreground">
              Tidak ditemukan masalah. Konten Anda siap untuk dikirimkan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complianceIssues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Masalah Kepatuhan</h3>
                <Accordion type="single" collapsible className="w-full">
                  {complianceIssues.map((issue, index) => (
                    <AccordionItem
                      key={`compliance-${index}`}
                      value={`compliance-${index}`}
                    >
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span>{issue.title}</span>
                          {getSeverityBadge(issue.severity)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-7 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {issue.description}
                          </p>
                          {issue.suggestions &&
                            issue.suggestions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium">Saran:</p>
                                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                                  {issue.suggestions.map((suggestion, i) => (
                                    <li key={i}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => onFixIssue(index)}
                            >
                              Perbaiki Masalah
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onIgnoreIssue(index)}
                            >
                              Abaikan
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {complianceIssues.length > 0 && legalIssues.length > 0 && (
              <Separator className="my-4" />
            )}

            {legalIssues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Masalah Hukum</h3>
                <Accordion type="single" collapsible className="w-full">
                  {legalIssues.map((issue, index) => (
                    <AccordionItem
                      key={`legal-${index}`}
                      value={`legal-${index}`}
                    >
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span>{issue.title}</span>
                          {getSeverityBadge(issue.severity)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-7 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {issue.description}
                          </p>
                          {issue.suggestions &&
                            issue.suggestions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium">Saran:</p>
                                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                                  {issue.suggestions.map((suggestion, i) => (
                                    <li key={i}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                onFixIssue(complianceIssues.length + index)
                              }
                            >
                              Perbaiki Masalah
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onIgnoreIssue(complianceIssues.length + index)
                              }
                            >
                              Abaikan
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValidationPanel;
