export type ExportFormat = "json" | "midi" | "pdf";

export function getSupportedExportFormats(): ExportFormat[] {
  return ["json", "midi", "pdf"];
}
