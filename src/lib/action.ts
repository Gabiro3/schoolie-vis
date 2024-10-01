"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { createNewUser, getUserByEmail } from "./action.api";
import { v4 as uuidv4 } from 'uuid'; 
import { UserType } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleRegister = async (prevState: any, form: FormData) => {
  try {
    const { email, name, password, adminCode, agree }: any =
      Object.fromEntries(form);
    const avatar = generateRandomAvatar();

    if (agree === undefined) return { error: "Please agree terms & policy" };

    const res = await getUserByEmail(email);
    const { user } = res;

    if (user !== null) return { error: "Email is already exist" };

    if (adminCode !== "" && adminCode !== process.env.NEXT_ADMIN_CODE)
      return { error: "Admin code incorrect" };

    const newUser: UserType = {
      name: name,
      email: email,
      password: password,
      avatar: avatar,
      provider: "email",
      isAdmin: adminCode === process.env.NEXT_ADMIN_CODE ? true : false,
    };

    const res2 = await createNewUser(newUser);
    const { message } = res2;

    if (message !== "Create user successfully") {
      return { error: message };
    }

    return { message: "Register account successfully" };
  } catch (err: any) {
    console.log(err);

    throw err;
  }
};

export const handleEmailLogin = async (prevState: any, form: FormData) => {
  try {
    const { email, password } = Object.fromEntries(form);
    await signIn("credentials", { email, password });
    return redirect("/dashboard/friends");
  } catch (err: any) {
    if (err.message.includes("CredentialsSignin")) {
      return { error: "Invalid username or password" };
    }

    throw err;
  }
};

export const handleGithubLogin = async () => {
  await signIn("github");
};

export const getUserSession = async () => {
  const session = await auth();
  return session;
};

export const handleSignOut = async () => {
  await signOut();
};

export const handleLeaveServerAction = async () => {
  revalidatePath("/dashboard/friends");
  redirect("/dashboard/friends");
};
 // Import UUID for unique seed generation

// Random avatar generator function
export function generateRandomAvatar(): string {
  const seed = uuidv4();  // Generate a random unique seed
  const style = "adventurer-neutral"; // You can change the style, e.g., "micah", "pixel-art", etc.

  // Construct the DiceBear avatar URL
  const avatarUrl = `https://avatars.dicebear.com/api/${style}/${seed}.svg`;
  
  return avatarUrl;
}

