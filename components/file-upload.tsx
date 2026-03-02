"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onGenerate: () => void
  isLoading: boolean
  isFileUploaded: boolean
}

export function FileUpload({ file, onFileChange, onGenerate, isLoading, isFileUploaded   }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile?.type === "application/pdf") {
        onFileChange(droppedFile)
      }
    },
    [onFileChange],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) {
        onFileChange(selected)
      }
    },
    [onFileChange],
  )

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
          Generate Quiz from PDF
        </h1>
        <p className="text-muted-foreground text-base">
          Upload a document and we will create 10 multiple-choice questions for you.
        </p>
      </div>

      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : file
              ? "border-primary/40 bg-primary/5"
              : "border-border bg-card hover:border-primary/40",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("file-input")?.click()
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={handleFileInput}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10">
              <FileText className="size-7 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onFileChange(null)
              }}
              className="absolute top-3 right-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center size-14 rounded-xl bg-muted">
              <Upload className="size-7 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Drop your PDF here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">PDF files only</p>
            </div>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="px-8"
        onClick={onGenerate}
        disabled={!file || isLoading || !isFileUploaded}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Generating Questions...
          </span>
        ) : (
          "Generate Questions"
        )}
      </Button>
    </div>
  )
}
