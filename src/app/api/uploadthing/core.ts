import { useSession } from "next-auth/react";
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const handleAuth = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session }: any = useSession();
    const userId = session?.user?.id;

  if (!userId) throw new Error('Unauthorized')
  return { userId }
}

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chatAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chatVideo: f({ video: { maxFileCount: 1, maxFileSize: '4MB' } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter