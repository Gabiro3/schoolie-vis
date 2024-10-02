import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IoSend } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { MdClear } from "react-icons/md";
import { BiSend } from "react-icons/bi";

import { FormDataState } from "./MainChat";
import { UploadFile } from "./fileUpload"; // Assuming it's in the same directory
import { FileUploadModal } from "../uploadModal";

interface PropType {
  friendName: string;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  file: any;
  fileName: string;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleResetImage: () => void;
  handleFileSelection: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSendFileMessage: () => void;
  loading: boolean;
}

const ChatInput = (props: PropType) => {
  const {
    friendName,
    handleSendMessage,
    formData,
    setFormData,
    file,
    fileName,
    fileInputRef,
    handleResetImage,
    handleFileSelection,
    handleSendFileMessage,
    loading,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>(""); // Handle uploaded file URL

  return (
    <div className="relative">
      <form onSubmit={handleSendMessage}>
        <Input
          className="h-[50px] pr-[100px]"
          type="text"
          placeholder={`Message @${friendName}`}
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
          }}
        />
        <div className="absolute top-[15px] right-[100px] flex items-center gap-4">
          <button
            type="submit"
            className="text-primary-purple hover:text-secondary-purple hover:cursor-pointer"
          >
            <IoSend size={20} />
          </button>
        </div>
      </form>

      <div className="absolute top-[13px] right-[20px] flex items-center gap-4">
        <div className="relative top-[3px]">
          {file !== null && !loading && (
            <div
              className="absolute top-[-60px] right-[-60px] p-2 rounded-md text-[13px]
                          bg-secondary-white dark:bg-primary-black"
            >
              <form
                className="flex items-center gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendFileMessage();
                }}
              >
                <p className="max-w-[300px] truncate">{fileName}</p>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="text-primary-purple hover:text-secondary-purple"
                  >
                    <BiSend size={20} />
                  </button>
                  <button
                    className="text-primary-purple hover:text-secondary-purple"
                    onClick={handleResetImage}
                  >
                    <MdClear size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}
          {loading && (
            <div
              className="absolute top-[-60px] right-[-60px] p-2 rounded-md text-[13px]
                          bg-secondary-white dark:bg-primary-black"
            >
              Loading...
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="realtive text-primary-purple hover:text-secondary-purple"
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                >
                  <FaFile size={20} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="text-primary-purple hover:text-secondary-purple hover:cursor-pointer">
                    <MdEmojiEmotions size={25} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div>Hello</div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get emoji</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* UploadFile Modal */}
      {isModalOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <button
              className="text-red-500 float-right"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <FileUploadModal
              onChange={(url) => {
                setUploadedFileUrl(url || "");
                setIsModalOpen(false); // Close modal after upload
              }}
              value={uploadedFileUrl}
              endpoint="chatAttachment"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
