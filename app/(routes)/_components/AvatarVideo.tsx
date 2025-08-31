"use client";
import React, { forwardRef } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/Icons";
import { StreamingAvatarSessionState } from "@/context/HeyGenContext";
import { useConnectionQuality } from "@/hooks/useConnectionQuality";
import { useStreamingAvatarSession } from "@/hooks/useStreamingAvatarSession";
import Image from "next/image";

interface AvatarVideoProps {
  handleCloseAvatar: () => void;
}


export const AvatarVideo = forwardRef<HTMLVideoElement, AvatarVideoProps>(({ handleCloseAvatar }, ref) => {
  const { sessionState } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

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
          onClick={handleCloseAvatar}
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
        <div className="w-full h-full flex flex-col gap-3 items-center justify-center absolute top-0 left-0 text-white">
          <Image
            src="/interview.svg" // 🔑 replace with your placeholder image path
            alt="Avatar placeholder"
            width={100}
            height={100}
            className="w-64 h-64"
          />
          Let&apos;s start the interview!
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
