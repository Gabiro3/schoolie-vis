"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createNewServer } from "@/lib/action.api";
import { UploadDropzone } from "@/lib/utils"; // Import UploadButton from UploadThing
import { ServerType } from "@/types";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { toast } from "react-hot-toast";

interface PropType {
  session: Session | null;
}

const CreateServerDialog = (props: PropType) => {
  const { session } = props;
  const user: any = session?.user;

  const pathName = usePathname();

  const [open, setOpen] = useState(false);
  const [serverName, setServerName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(""); // Store uploaded image URL
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateNewServer = async () => {
    if (!serverName) {
      toast.error("Please type server name");
      return;
    }

    let avatar = imageUrl || null; // Use the uploaded image URL

    const newServer: ServerType = {
      name: serverName,
      owner: user.id,
      avatar: avatar,
    };

    setLoading(true);

    const res2 = await createNewServer(newServer, pathName);
    const { message } = res2;

    if (message === "Create server successfully") {
      toast.success("Study room created successfully!");
      setOpen(false);
      setServerName(""); // Reset the server name
      setImageUrl(""); // Reset the image URL
    } else {
      toast.error("Failed to create server");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="w-[50px] h-[50px] rounded-full bg-primary-purple text-white flex justify-center items-center
                            hover:cursor-pointer hover:bg-secondary-purple"
                >
                  <IoAdd size={35} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Add new server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[350px] sm:w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Server</DialogTitle>
          <DialogDescription>
            Your server is where you and your friends hang out. Make yours and
            start talking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="mt-3">
            <UploadDropzone
              endpoint="serverImage"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImageUrl(res[0]?.url); // Get the uploaded image URL
                  toast.success("Image uploaded successfully!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Image upload failed: ${error.message}`);
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-5">
            <p className="text-[14px] text-white">
              {imageUrl !== ""
                ? "Image uploaded successfully!"
                : "No image selected"}
            </p>
            {imageUrl !== "" && (
              <button
                className="text-primary-purple hover:text-secondary-purple"
                onClick={() => setImageUrl("")} // Reset the image URL
              >
                <MdClear size={20} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Server name
            </Label>
            <Input
              id="serverName"
              className="col-span-3"
              value={serverName}
              onChange={(e) => {
                setServerName(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="purple"
            disabled={loading}
            onClick={handleCreateNewServer}
          >
            {loading ? "Please wait..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerDialog;
