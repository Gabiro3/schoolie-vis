import { ChangeEvent, useState } from "react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { useFriendStore } from "@/lib/store";

const All = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  const friends = useFriendStore((state) => {
    return state.friends;
  });

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="mt-5">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => {
            handleSearchInput(e);
          }}
        />
        {searchInput === "" ? (
          <div className="absolute right-[20px] top-[8px] hover:cursor-pointer">
            <IoSearch size={25} />
          </div>
        ) : (
          <div
            className="absolute right-[20px] top-[8px] hover:cursor-pointer"
            onClick={() => {
              setSearchInput("");
            }}
          >
            <MdClear size={25} />
          </div>
        )}
      </div>
      <div className="mt-6">
        <p className="text-[13px] font-bold dark:text-gray-400">
          ALL FRIENDS-{friends?.length ? friends?.length : "0"}
        </p>
        <div className="mt-6 flex flex-col">
          {friends?.length === 0 && (
            <div className="flex flex-col mt-[80px] items-center gap-5">
              <p className="text-[15px] dark:text-gray-400">
                No one is around to play with Wumpus.
              </p>
            </div>
          )}
          {friends?.map((friend) => {
            return (
              <div
                key={friend.id}
                className="w-[100%] border border-gray-400 border-t-[1px] border-l-0 border-r-0 border-b-0
                        px-2 py-4 flex items-center justify-between
                        hover:bg-secondary-white hover:dark:bg-primary-gray hover:cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <Avatar>
                    <AvatarImage
                      src={`${friend?.avatar ? friend?.avatar : ""}`}
                      alt="avatar"
                    />
                    <AvatarFallback>user</AvatarFallback>
                  </Avatar>
                  <div className="text-[13px]">
                    <p className="font-black">{friend?.name}</p>
                    <p>{friend?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center items-center rounded-full bg-primary-white dark:bg-primary-gray p-3">
                          <AiOutlineMessage size={25} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center items-center rounded-full bg-primary-white dark:bg-primary-gray p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <div>
                                <IoMdMore size={25} />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-[5px]">
                              <div className="text-[13px] flex flex-col">
                                <div className="p-2 rounded-sm hover:text-white hover:cursor-pointer hover:bg-primary-purple">
                                  Start call
                                </div>
                                <div className="p-2 rounded-sm hover:text-white hover:cursor-pointer hover:bg-red-500">
                                  Remove friend
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default All;
