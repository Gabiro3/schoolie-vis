export interface ServerType {
  id?: number | string | null; // null is for direct messages server
  name?: string;
  owner?: number; // userId
  avatar?: string | null;
  created?: string;
}

export interface UserType {
  id?: string;
  name?: string;
  email?: string;
  password?: string | null;
  avatar?: string | null;
  provider?: string;
  created?: Date | string;
}

export interface DirectMessageChatType {
  id?: string;
  user: UserType | any;
  userId?: string;
  friendId?: string;
  text: string;
  type?: string;
  provider?: string;
  url?: string;
  fileName?: string;
  sended?: string;
}

export interface CategoryType {
  id?: string;
  serverId?: string;
  name?: string;
  channels?: ChannelType[];
  created?: string;
}

export interface ChannelType {
  id?: string;
  categoryId?: string;
  name?: string;
  created?: string;
}
