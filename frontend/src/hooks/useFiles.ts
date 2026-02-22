import { useState, useEffect, useCallback } from "react";
import * as fileService from "../services/fileService";
import { createLogger } from "../lib/logger";
import type { FileItem } from "../lib/types";

const log = createLogger("useFiles");

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    log.info("Loading files...");
    setIsLoading(true);
    setError(null);
    try {
      const data = await fileService.listFiles();
      log.info("Files state updated", { count: data.length });
      setFiles(data);
    } catch (e: any) {
      log.error("loadFiles failed", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    log.debug("useFiles mounted - loading files");
    loadFiles();
  }, [loadFiles]);

  const uploadFiles = async (
    pickedFiles: { uri: string; name: string; type: string }[]
  ) => {
    log.info("uploadFiles called", {
      count: pickedFiles.length,
      names: pickedFiles.map((f) => f.name),
    });
    setIsUploading(true);
    setError(null);
    try {
      await fileService.uploadFiles(pickedFiles);
      log.info("Upload complete - reloading file list");
      await loadFiles();
      return true;
    } catch (e: any) {
      log.error("uploadFiles failed", e);
      setError(e.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string, fileType: string) => {
    log.info("deleteFile called", { fileId, fileType });
    setIsDeleting(true);
    setError(null);
    try {
      await fileService.deleteFile(fileId, fileType);
      log.info("Delete complete - reloading file list");
      await loadFiles();
      return true;
    } catch (e: any) {
      log.error("deleteFile failed", e);
      setError(e.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    files,
    isLoading,
    isUploading,
    isDeleting,
    error,
    uploadFiles,
    deleteFile,
    loadFiles,
  };
}
