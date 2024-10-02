import { useSession } from "next-auth/react";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Create the Uploadthing handler
const f = createUploadthing();

// Authentication handler
const handleAuth = () => {
  // Fetch the session using `useSession` hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();

  // If session or user ID is missing, throw an error
  const userId = session?.user?.name;
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to upload files.");
  }

  // Return the user ID if authenticated
  return { userId };
};

// Define your FileRouter with Uploadthing
export const ourFileRouter = {
  // Server image upload handler
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(() => {
      try {
        return handleAuth();  // Authenticate the user
      } catch (error) {
        throw new Error("Failed to authenticate user: " + error);
      }
    })
    .onUploadComplete(() => {
      console.log("Image upload completed");
    }),

  // Chat attachment upload handler
  chatAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => {
      try {
        return handleAuth();  // Authenticate the user
      } catch (error) {
        throw new Error("Failed to authenticate user: " + error);
      }
    })
    .onUploadComplete(() => {
      console.log("Chat attachment upload completed");
    }),

  // Chat video upload handler
  chatVideo: f({ video: { maxFileCount: 1, maxFileSize: "4MB" } })
    .middleware(() => {
      try {
        return handleAuth();  // Authenticate the user
      } catch (error) {
        throw new Error("Failed to authenticate user: " + error);
      }
    })
    .onUploadComplete(() => {
      console.log("Chat video upload completed");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
