import React, {
  useState,
  useEffect,
  ReactNode,
  useRef,
  MutableRefObject,
} from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import { updateServer, deleteServer, leaveServer } from "@/lib/action.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { getSummaryName } from "@/lib/helper";
import { ServerType, UserType } from "@/types";

type ServerSettingsDialogProps = {
  serverId: string | number | null | undefined;
  serverName: string | undefined;
  members?: number;
  userId: string | undefined; // Add userId for leaveServer
  children?: ReactNode;
  ref?: MutableRefObject<any>;
};

const ServerSettingsDialog: React.FC<ServerSettingsDialogProps> = ({
  serverId,
  serverName,
  members,
  userId,
}) => {
  const [formData, setFormData] = useState({
    name: serverName,
    members: members,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control dialog open/close
  const [serverMembers, setServerMembers] = useState<
    { role: string; members: UserType[] }[]
  >([]);

  const socket = useSocketStore((state) => state.socket);

  // Fetch members when dialog is opened
  useEffect(() => {
    if (isOpen && socket) {
      socket.emit(
        "get_server_members",
        { serverId },
        (res: {
          message: string;
          members: { role: string; members: UserType[] }[];
        }) => {
          if (res?.message === "Get server members successfully") {
            setServerMembers(res?.members);
          }
        }
      );
    }
  }, [isOpen, socket, serverId]);

  const handleEditServerSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        name: formData.name,
      };
      await updateServer(serverId, updatedData);

      toast.success("Server settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update server settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServer = async () => {
    setLoading(true);

    try {
      await deleteServer(serverId);
      toast.success("Server deleted successfully");
      setIsOpen(false); // Close the dialog when the server is deleted
    } catch (error) {
      toast.error("Failed to delete the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveServer = async () => {
    setLoading(true);

    try {
      await leaveServer(userId, serverId);
      toast.success("You have left the server.");
      setIsOpen(false); // Close the dialog after leaving the server
    } catch (error) {
      toast.error("Failed to leave the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Open Server Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary-white dark:bg-primary-gray max-w-[100vw] h-[100vh]">
        <Tabs>
          <TabList>
            <Tab>Server Settings</Tab>
            <Tab>Members</Tab>
          </TabList>

          {/* Server Settings Tab */}
          <TabPanel>
            <div className="mt-10 flex justify-center max-h-[100vh] overflow-y-auto">
              <div className="flex flex-col gap-5 bg-white dark:bg-primary-black w-[100%] lg:w-[600px] p-4 rounded-md">
                <h2 className="text-2xl font-bold">Server Settings</h2>

                <form
                  className="p-4 rounded-md flex flex-col gap-5 bg-zinc-100 dark:bg-primary-gray"
                  onSubmit={handleEditServerSettings}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2 text-[15px]">
                      <p className="font-black dark:text-zinc-400">SERVER ID</p>
                      <p>{serverId}</p>
                    </div>
                    <Button variant="purple" disabled>
                      Edit
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2 text-[15px]">
                      <p className="font-black dark:text-zinc-400">
                        SERVER NAME
                      </p>
                      <Input
                        className="w-[200px] md:w-[400px]"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      variant="purple"
                      type="submit"
                      disabled={loading ? true : false}
                    >
                      {loading ? "Loading..." : "Save"}
                    </Button>
                  </div>
                </form>

                <Button
                  variant="destructive"
                  onClick={handleDeleteServer}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Server"}
                </Button>
              </div>
            </div>
          </TabPanel>

          {/* Members Tab */}
          <TabPanel>
            <div className="mt-10 flex justify-center max-h-[100vh] overflow-y-auto">
              <div className="flex flex-col gap-5 bg-white dark:bg-primary-black w-[100%] lg:w-[600px] p-4 rounded-md">
                <h2 className="text-2xl font-bold">Members</h2>

                {serverMembers.length > 0 ? (
                  serverMembers.map((group) => (
                    <div key={uuidv4()} className="flex flex-col gap-3">
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-bold">
                        {group.role.toUpperCase()} - {group.members.length}
                      </p>
                      {group.members.map((user) => (
                        <div key={uuidv4()} className="flex items-center gap-3">
                          <Avatar className="w-[35px] h-[35px]">
                            <AvatarImage src={user.avatar || ""} alt="avatar" />
                            <AvatarFallback>
                              {user.name && getSummaryName(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">
                            {user.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No members found</p>
                )}

                <Button
                  variant="purple"
                  onClick={handleLeaveServer}
                  disabled={loading}
                >
                  {loading ? "Leaving..." : "Leave Server"}
                </Button>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ServerSettingsDialog;
