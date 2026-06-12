import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../../services/api';
import type { FileResponse } from '../../types/notebook';

interface SourcesSidebarProps {
  notebookId?: string;
  files: FileResponse[];
  onRefresh: () => void;
  onFileAdded?: (file: FileResponse) => void;
}

export default function SourcesSidebar({ notebookId, files, onRefresh, onFileAdded }: SourcesSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewText, setPreviewText] = useState<{ title: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !notebookId) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size cannot exceed 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await api.post(`/notebooks/${notebookId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onFileAdded && response.data) {
        onFileAdded(response.data);
      } else {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    if (!notebookId) return;
    try {
      const response = await api.get(`/notebooks/${notebookId}/files/${fileId}?download=true`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file', error);
      alert('Failed to download file');
    }
  };

  const handleFileClick = async (file: FileResponse) => {
    if (!notebookId) return;
    try {
      const response = await api.get(`/notebooks/${notebookId}/files/${file.id}`, {
        responseType: 'blob',
      });
      const blob = response.data;
      const fileNameLower = file.fileName.toLowerCase();

      if (file.contentType.includes('pdf') || fileNameLower.endsWith('.pdf')) {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        window.open(url, '_blank');
      } else if (fileNameLower.endsWith('.txt')) {
        const text = await blob.text();
        setPreviewText({ title: file.fileName, content: text });
      } else {
        downloadFile(file.id, file.fileName);
      }
    } catch (error: any) {
      console.error('Failed to open file:', error);
      if (error.response?.data && error.response.data instanceof Blob) {
        error.response.data.text().then((text: string) => {
          alert(`Failed to open file. Details: ${text}`);
        }).catch(() => {
          alert(`Failed to open file. Status: ${error.response?.status}`);
        });
      } else {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
        alert(`Failed to open file. Details: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
      }
    }
  };

  const handleDeleteFile = async (e: React.MouseEvent, fileId: number) => {
    e.stopPropagation();
    if (!notebookId) return;
    try {
      await api.delete(`/notebooks/${notebookId}/files/${fileId}`);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete file', error);
      alert('Failed to delete file');
    }
  };

  const handleDownloadClick = (e: React.MouseEvent, file: FileResponse) => {
    e.stopPropagation();
    downloadFile(file.id, file.fileName);
  };

  const getFileIcon = (contentType: string, fileName: string) => {
    const lowerName = fileName?.toLowerCase() || '';
    if (contentType?.includes('pdf') || lowerName.endsWith('.pdf')) return 'picture_as_pdf';
    if (contentType?.includes('word') || contentType?.includes('document') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) return 'description';
    if (contentType?.includes('csv') || contentType?.includes('excel') || contentType?.includes('spreadsheet') || lowerName.endsWith('.csv')) return 'table';
    if (contentType?.includes('text') || lowerName.endsWith('.txt')) return 'article';
    return 'insert_drive_file';
  };

  const getTypeLabel = (contentType: string, fileName: string): string => {
    const lowerName = fileName?.toLowerCase() || '';
    if (contentType?.includes('pdf') || lowerName.endsWith('.pdf')) return 'PDF';
    if (contentType?.includes('word') || contentType?.includes('document') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) return 'DOCX';
    if (contentType?.includes('csv') || lowerName.endsWith('.csv')) return 'CSV';
    if (contentType?.includes('text') || lowerName.endsWith('.txt')) return 'TXT';
    return 'FILE';
  };

  return (
    <>
      <aside className="w-full bg-surface-container-lowest flex flex-col h-full border-r border-outline-variant">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-outline-variant shrink-0">
          <h3 className="font-sans font-bold uppercase tracking-widest text-[11px] text-outline">Sources</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="material-symbols-outlined text-primary hover:rotate-90 transition-transform text-[20px]"
          >
            add_circle
          </button>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {files.length === 0 ? (
            <div className="mt-8 flex flex-col items-center gap-2 opacity-40 px-2">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-center font-sans">No sources yet</p>
            </div>
          ) : (
            files.map(file => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="p-4 etched-border bg-white shadow-hard-sm hover:shadow-hard transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-outline text-xl">
                    {getFileIcon(file.contentType, file.fileName)}
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => handleDownloadClick(e, file)}
                      className="p-1 hover:text-primary transition-colors"
                      title="Download"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteFile(e, file.id)}
                      className="p-1 hover:text-error transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <h4 className="mt-2 font-serif text-sm font-semibold leading-tight line-clamp-2 text-on-surface">
                  {file.fileName}
                </h4>
                <p className="text-xs text-outline-variant mt-1 font-sans">
                  {getTypeLabel(file.contentType, file.fileName)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Source CTA */}
        <div className="p-4 border-t border-outline-variant shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2.5 etched-border bg-primary-container text-on-primary-container font-sans font-bold shadow-hard btn-press uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Uploading...
              </>
            ) : (
              'Add Source'
            )}
          </button>
        </div>
      </aside>

      {/* Text Preview Modal */}
      {previewText && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/60 p-4 lg:p-8"
          onClick={() => setPreviewText(null)}
        >
          <div
            className="bg-surface w-full max-w-4xl max-h-[80vh] etched-border shadow-hard-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-white shrink-0">
              <h3 className="font-serif font-bold text-on-surface truncate pr-4">{previewText.title}</h3>
              <button
                onClick={() => setPreviewText(null)}
                className="w-8 h-8 etched-border hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <pre className="whitespace-pre-wrap font-sans text-sm text-on-surface leading-relaxed">
                {previewText.content}
              </pre>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
