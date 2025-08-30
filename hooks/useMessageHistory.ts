import { useStreamingAvatarContext } from "@/context/HeyGenContext";


export const useMessageHistory = () => {
  const { messages } = useStreamingAvatarContext();

  return { messages };
};
