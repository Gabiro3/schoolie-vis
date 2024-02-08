"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFriendStore, useSocketStore } from "@/lib/store";

import { DirectMessageChatType, UserType } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { toast } from "react-toastify";
import TextChat from "./TextChat";

import { IoSend } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";

import { getAllChatsByUserId, getUserById } from "@/lib/action.api";
import { getSummaryName } from "@/lib/helper";

// import { DirectMessageChatData } from "@/lib/utils";

const MainChat = () => {
  const params = useParams();
  const { data: session }: any = useSession();

  const [friend, setFriend] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<any>({
    message: "",
  });
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isOverFlow, setIsOverFlow] = useState<boolean>(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const socket = useSocketStore((state) => {
    return state.socket;
  });

  const chats = useFriendStore((state) => {
    return state.chats;
  });

  const setChats = useFriendStore((state) => {
    return state.setChats;
  });

  const updateChats = useFriendStore((state) => {
    return state.updateChats;
  });

  const handleGetFriendProfile = async () => {
    const friendId = params?.id[0];

    if (friendId !== undefined) {
      const res = await getUserById(friendId);
      if (res?.message === "Find user sucessfully") setFriend(res?.user);
    }
  };

  const handleGetAllChats = async () => {
    const friendId = params?.id[0];

    if (session?.user?.id && friendId !== undefined) {
      const res = await getAllChatsByUserId(session?.user?.id, friendId);

      if (res?.message === "Get all direct messages successfully") {
        updateChats(res?.chats);
      }
    }
  };

  useEffect(() => {
    handleGetFriendProfile();
    handleGetAllChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check screen height
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    if (typeof window !== "undefined") {
      setScreenHeight(window.innerHeight);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Check chat box overflow
  useEffect(() => {
    if (
      chatBoxRef?.current?.clientHeight &&
      chatBoxRef?.current?.clientHeight > screenHeight - 210
    )
      setIsOverFlow(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatBoxRef?.current?.clientHeight]);

  // Chat auto scroll effect
  useEffect(() => {
    if (chats !== undefined) {
      if (chats?.length) {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        mainRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats?.length]);

  // Receive direct message
  useEffect(() => {
    if (socket) {
      socket.on(
        "receive_direct_message",
        (rs: {
          message: string;
          user: UserType;
          friend: UserType;
          chat: DirectMessageChatType;
        }) => {
          // console.log("Receive direct message request:", rs);
          if (
            rs?.message === "You have new direct message" &&
            rs?.chat &&
            rs?.user
          ) {
            const newChats = chats;
            newChats.push(rs?.chat);

            const uniqueObjects = newChats.filter(
              (object, index, self) =>
                index === self.findIndex((o) => o.id === object.id)
            );

            console.log(uniqueObjects);

            updateChats(uniqueObjects);
          }
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData?.message === "") {
      toast.error("Message can not be empty");
      return;
    }

    if (!friend) {
      toast.error("Friend not found");
      return;
    }

    if (socket && session?.user?.id && formData?.message !== "") {
      socket.emit(
        "send_direct_message",
        {
          userId: session?.user?.id,
          friendId: friend?.id,
          text: formData.message,
        },
        (res: {
          message: string;
          user: UserType;
          friend: UserType;
          chat: DirectMessageChatType;
        }) => {
          console.log("Check send direct message:", res);
          if (res?.chat) {
            setChats(res?.chat);
          }
        }
      );
    }

    setFormData({
      message: "",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[100%] h-screen flex flex-col"
    >
      <div
        className="w-[100%] h-[56px] px-6 border border-l-0 border-r-0 border-t-0 border-b-primary-black
                        flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-[35px] h-[35px]">
            <AvatarImage src={`${friend?.avatar}`} alt="avatar" />
            <AvatarFallback>
              {friend?.name && getSummaryName(friend?.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-[13px] font-bold dark:text-gray-400">
            {friend?.name}
          </p>
        </div>
        <div></div>
      </div>
      <div
        className={`w-[100%] max-h-[calc(100vh-156px)] h-[calc(100vh-156px)] overflow-y-auto flex px-6 py-4 ${
          !isOverFlow && "items-end"
        }`}
      >
        <div ref={chatBoxRef} className="w-[100%] flex flex-col gap-8">
          {chats?.map((chat: DirectMessageChatType, index) => {
            if (chat?.userId === session?.user?.id)
              return (
                <TextChat
                  key={chat.id}
                  userIdSession={session?.user?.id}
                  chat={chat}
                  user={session?.user}
                  mainRef={mainRef}
                />
              );

            if (chat?.userId === friend?.id && friend !== null)
              return (
                <TextChat
                  key={chat.id}
                  userIdSession={session?.user?.id}
                  chat={chat}
                  user={friend}
                  mainRef={mainRef}
                />
              );
          })}
        </div>
      </div>
      <div className="absolute w-[100%] h-[100px] bottom-0 px-6 py-4">
        <form className="relative" onSubmit={handleSendMessage}>
          <Input
            className="h-[50px] pr-[100px]"
            type="text"
            placeholder={`Message @${friend?.name}`}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
            }}
          />
          <div className="absolute top-[15px] right-[20px] flex items-center gap-3">
            <button
              type="submit"
              className="text-primary-purple hover:text-secondary-purple hover:cursor-pointer"
            >
              <IoSend size={20} />
            </button>
            <div className="text-primary-purple hover:text-secondary-purple hover:cursor-pointer">
              <FaFile size={20} />
            </div>
            <div className="text-primary-purple hover:text-secondary-purple hover:cursor-pointer">
              <MdEmojiEmotions size={25} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainChat;
