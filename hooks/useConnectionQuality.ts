import { useStreamingAvatarContext } from "@/context/HeyGenContext";


export const useConnectionQuality = () => {
  const { connectionQuality } = useStreamingAvatarContext();

  return {
    connectionQuality,
  };
};
