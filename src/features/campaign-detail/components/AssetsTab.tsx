import React, { useState, useCallback } from 'react';
import { Upload, Trash2, FileText, Image, Video } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../hooks/useToast';
import { useJob } from '../../../hooks/useJob';
import { jobEngine } from '../../../services/jobEngine';
import { cn } from '../../../lib/utils';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
}

interface AssetsTabProps {
  campaignId: string;
}

const assetIcons = {
  image: Image,
  video: Video,
  document: FileText,
};

export const AssetsTab: React.FC<AssetsTabProps> = ({ campaignId }) => {
  const toast = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploadingJobId, setUploadingJobId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { job: uploadJob } = useJob(uploadingJobId);

  const simulateUpload = useCallback(
    async (file: File) => {
      const job = jobEngine.createJob('upload', {
        fileName: file.name,
        fileSize: file.size,
      });

      setUploadingJobId(job.id);

      try {
        await jobEngine.startJob(job.id, {
          duration: 3000,
          failRate: 0.2,
          steps: 20,
        });

        const finalJob = jobEngine.getJob(job.id);

        if (finalJob?.status === 'completed') {
          const newAsset: Asset = {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type.startsWith('image/')
              ? 'image'
              : file.type.startsWith('video/')
              ? 'video'
              : 'document',
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };

          setAssets((prev) => [...prev, newAsset]);
          toast.success(`Successfully uploaded ${file.name}`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUploadingJobId(null);
        jobEngine.cleanup(job.id);
      }
    },
    [toast]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        simulateUpload(files[0]);
      }
    },
    [simulateUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        simulateUpload(files[0]);
      }
    },
    [simulateUpload]
  );

  const handleDeleteClick = useCallback((asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (assetToDelete) {
      setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id));
      toast.success(`Successfully deleted ${assetToDelete.name}`);
      setDeleteModalOpen(false);
      setAssetToDelete(null);
    }
  }, [assetToDelete, toast]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Asset
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your files here, or click to browse
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploadingJobId !== null}
        />
        <Button
          as="label"
          htmlFor="file-upload"
          disabled={uploadingJobId !== null}
        >
          Select File
        </Button>
      </div>

      {uploadJob && uploadJob.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Uploading {uploadJob.metadata?.fileName as string}...
            </span>
            <span className="text-sm text-blue-700">
              {Math.round(uploadJob.progress)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadJob.progress}%` }}
            />
          </div>
        </div>
      )}

      {assets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const Icon = assetIcons[asset.type];
            return (
              <div
                key={asset.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(asset.size)} •{' '}
                      {new Date(asset.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(asset)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {assets.length === 0 && !uploadingJobId && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No assets uploaded yet</p>
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Asset"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{assetToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
