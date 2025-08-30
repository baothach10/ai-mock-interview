"use client";
import React, { forwardRef } from "react";
import { ConnectionQuality, StreamingEvents } from "@heygen/streaming-avatar";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/Icons";
import { StreamingAvatarSessionState } from "@/context/HeyGenContext";
import { useConnectionQuality } from "@/hooks/useConnectionQuality";
import { useStreamingAvatarSession } from "@/hooks/useStreamingAvatarSession";
import { useRouter } from "next/navigation";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({ }, ref) => {
  const { sessionState, stopAvatar } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();
  const router = useRouter();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

  const handleClose = () => {
    stopAvatar();
    router.replace("/dashboard");
  };

  return (
    <>
      {connectionQuality !== ConnectionQuality.UNKNOWN && (
        <div className="absolute top-3 left-3 bg-black text-white rounded-lg px-3 py-2">
          Connection Quality: {connectionQuality}
        </div>
      )}
      {isLoaded && (
        <Button
          className="absolute top-3 right-3 !p-2 bg-zinc-700 bg-opacity-50 z-10"
          onClick={handleClose}
        >
          <CloseIcon />
        </Button>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        style={{
          position: 'relative',
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <track kind="captions" />
      </video>
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 text-white">
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
