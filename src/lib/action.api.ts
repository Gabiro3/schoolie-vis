"use server";

import { ServerType, UserType } from "@/types";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const getConnectServer = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/email/${email}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const createNewUser = async (user: UserType) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
      {
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
        provider: user.provider,
        isAdmin: user.isAdmin,
      }
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const loginByEmail = async (user: UserType) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      {
        email: user.email,
        password: user.password,
      }
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const createNewServer = async (server: ServerType, pathName: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/server/create`,
      {
        name: server.name,
        owner: server.owner,
        avatar: server.avatar,
      }
    );

    revalidatePath(pathName);

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getJoinServerByUserId = async (userId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/server/join/server/${userId}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};
export const deleteServer = async (serverId: string | number | null | undefined) => {
  if (typeof serverId !== 'string') {
    throw new Error('Invalid serverId: Must be a non-empty string');
  }

  try {
    const response = await axios.delete(`/server/delete/${serverId}`);
    return response.data; // Handle successful deletion
  } catch (error) {
    console.error('Error deleting the server:', error);
    throw new Error('Failed to delete the server');
  }
};

export const leaveServer = async (userId: string | null | undefined, serverId: string | number | null | undefined) => {
  if (typeof userId !== 'string' || typeof serverId !== 'string') {
    throw new Error('Invalid userId or serverId: Must be non-empty strings');
  }

  try {
    const response = await axios.post('/server/leave', {
      userId: userId,
      serverId: serverId,
    });
    return response.data; // Handle successful leave
  } catch (error) {
    console.error('Error leaving the server:', error);
    throw new Error('Failed to leave the server');
  }
};
export const updateServer = async (serverId: string | number | null | undefined, updatedData: any) => {
  if (typeof serverId !== 'string') {
    throw new Error('Invalid serverId: Must be a non-empty string');
  }

  try {
    const response = await axios.put(`/server/update/${serverId}`, updatedData);
    return response.data; // Handle successful update
  } catch (error) {
    console.error('Error updating the server:', error);
    throw new Error('Failed to update the server');
  }
};


export const editUserByUserId = async (user: UserType) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update/${user.id}`,
      {
        id: user.id,
        ...user,
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getPendingByEmail = async (email: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/pending/${email}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getAllFriendsByEmail = async (email: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/friends/${email}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getAllDirectMessagesByEmail = async (email: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/directmessages/${email}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/id/${id}`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getAllChatsByUserId = async (userId: string, friendId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/message/direct`,
      {
        data: {
          userId: userId,
          friendId: friendId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getDetailServerById = async (serverId: string, userId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/server/detail/${serverId}`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getAllChatsByChannelId = async (
  userId: string,
  channelId: string
) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/server/channel/chat/${channelId}`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getChannelById = async (userId: string, channelId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/server/channel/${channelId}`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const getServerInviteLink = async (userId: string, serverId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/server/invite/${serverId}`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const joinServerByInviteLink = async (
  userId: string,
  inviteLink: string
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/server/invite`,
      { userId: userId, inviteLink: inviteLink },
      {
        headers: {
          userId: userId,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const adminGetAllUsers = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const adminGetAllServers = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/servers`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const adminGetServersAnalysis = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/servers/analysis`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};

export const adminGetAllChats = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/chats`
    );
    return res.data;
  } catch (err: any) {
    console.log("API CALL ERROR:", err?.response?.data);
    return err?.response?.data;
  }
};
