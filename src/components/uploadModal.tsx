import { useState } from "react";
import { UploadFile } from "@/components/chat/fileUpload"; // Import your UploadFile component
import { X } from "lucide-react";
interface FileUploadModalProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "chatVideo" | "serverImage" | "chatAttachment";
}

export const FileUploadModal = ({
  onChange,
  value,
  endpoint,
}: FileUploadModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <button onClick={handleOpen} className="btn btn-primary">
        Upload File
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
            <UploadFile onChange={onChange} value={value} endpoint={endpoint} />
          </div>
        </div>
      )}
    </>
  );
};
