import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ServerSettingsDialog from "../ServerSettingDialog";
import { IoMdArrowDropdown, IoMdSettings } from "react-icons/io";
import { TbDiamondFilled } from "react-icons/tb";

interface ServerDropdownMenuProps {
  serverName: string | undefined;
  serverId: string | number | null | undefined;
  userId: string | undefined;
}

const ServerDropdownMenu = ({
  serverName,
  serverId,
  userId,
}: ServerDropdownMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  
  const dropdownRef = useRef<any>();
  const dropdownButtonRef = useRef<any>();
  const dialogRef = useRef<any>();  // Add a ref for the dialog

  useEffect(() => {
    const handleClickOutsideDropdown = (event: any) => {
      // Check if click is outside the dropdown and dialog
      if (
        dropdownRef?.current &&
        !dropdownRef?.current.contains(event.target) &&
        !dropdownButtonRef?.current.contains(event.target) &&
        (!dialogRef?.current || !dialogRef.current.contains(event.target)) // Exclude dialog clicks
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, []);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <button
          ref={dropdownButtonRef}
          onClick={() => setOpen(!open)}
        >
          <IoMdArrowDropdown size={25} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent ref={dropdownRef} className="w-56">
        <DropdownMenuItem>
          <span>Server Boost</span>
          <DropdownMenuShortcut>
            <TbDiamondFilled size={20} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Server Settings Dialog inside Dropdown */}
          <DropdownMenuItem>
            <ServerSettingsDialog
              ref={dialogRef}  // Add ref for the dialog
              serverId={serverId}
              serverName={serverName}
              members={10}
              userId={userId}
            >
              <span>Server Settings</span>
              <DropdownMenuShortcut>
                <IoMdSettings size={20} />
              </DropdownMenuShortcut>
            </ServerSettingsDialog>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerDropdownMenu;
