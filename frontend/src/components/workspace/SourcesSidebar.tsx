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
  const [previewText, setPreviewText] = useState<{title: string, content: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !notebookId) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size cannot exceed 10MB");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await api.post(`/notebooks/${notebookId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onFileAdded && response.data) {
        onFileAdded(response.data);
      } else {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data || "Failed to upload file");
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
        // Fallback for other files like docx, csv, etc.
        downloadFile(file.id, file.fileName);
      }
    } catch (error: any) {
      console.error('Failed to open file:', error);
      // Because we requested responseType: 'blob', error.response.data might be a Blob instead of a JSON object!
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
      alert("Failed to delete file");
    }
  };

  const handleDownloadClick = (e: React.MouseEvent, file: FileResponse) => {
    e.stopPropagation();
    downloadFile(file.id, file.fileName);
  };

  const getFileIcon = (contentType: string, fileName: string) => {
    if (!contentType && !fileName) return 'insert_drive_file';
    const lowerName = fileName?.toLowerCase() || '';
    if (contentType?.includes('pdf') || lowerName.endsWith('.pdf')) return 'picture_as_pdf';
    if (contentType?.includes('word') || contentType?.includes('document') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) return 'description';
    if (contentType?.includes('csv') || contentType?.includes('excel') || contentType?.includes('spreadsheet') || lowerName.endsWith('.csv')) return 'table';
    if (contentType?.includes('text') || lowerName.endsWith('.txt')) return 'article';
    return 'insert_drive_file';
  };

  return (
    <>
      <aside className="w-full bg-surface-container-low flex flex-col h-full py-8 pb-32 lg:pb-8 overflow-y-auto hide-scrollbar">
        <div className="px-6 mb-8 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold text-blue-700 dark:text-blue-400">Sources</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer">info</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Knowledge Base</h2>
          
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
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl py-3 px-4 font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {isUploading ? (
              <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-xl">upload</span>
            )}
            {isUploading ? 'Uploading...' : 'Add New Source'}
          </button>
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          <div className="px-6 mb-2 flex justify-between items-center">
            <p className="font-manrope uppercase tracking-widest text-[10px] font-bold text-on-surface-variant opacity-60">Active Documents</p>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{files.length}</span>
          </div>
          
          {files.length === 0 ? (
            <div className="px-6 py-8 text-center opacity-60 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
              <p className="text-sm font-medium">No sources uploaded yet.</p>
            </div>
          ) : (
            files.map(file => (
              <div 
                key={file.id} 
                onClick={() => handleFileClick(file)}
                className="group flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">{getFileIcon(file.contentType, file.fileName)}</span>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate text-on-surface group-hover:text-primary transition-colors">{file.fileName}</p>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => handleDownloadClick(e, file)}
                    className="hover:text-primary transition-all p-1"
                    title="Download file"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                  <button 
                    onClick={(e) => handleDeleteFile(e, file.id)}
                    className="hover:text-error transition-all p-1"
                    title="Delete file"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </nav>


      </aside>

      {/* Text Preview Modal */}
      {previewText && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 lg:p-8 backdrop-blur-sm" onClick={() => setPreviewText(null)}>
          <div 
            className="bg-surface w-full max-w-4xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-on-surface truncate pr-4">{previewText.title}</h3>
              <button 
                onClick={() => setPreviewText(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
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
