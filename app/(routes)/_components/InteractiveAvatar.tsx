import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";
import { Button } from "@/components/ui/button";
import { CloseIcon, LoadingIcon } from "@/components/ui/Icons";
import {
  StreamingAvatarSessionState,
  StreamingAvatarProvider,
} from "@/context/HeyGenContext";
import { useStreamingAvatarSession } from "@/hooks/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarControls";
import { AvatarVideo } from "./AvatarVideo";
import { MessageHistory } from "./MessageHistory";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { InterviewData } from "@/types";
import { useRouter } from "next/navigation";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: "Elenora_IT_Sitting_public",
  knowledgeId: "e32918d0ede34c3781eb982c8ecb513e",
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar({
  interviewData,
}: {
  interviewData: InterviewData;
}) {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  async function createKnowledgeBase() {
    try {
      const formattedQuestions = interviewData.interviewQuestions.map(
        (item) => `Question: ${item.question}\nAnswer: ${item.answer}`
      );
      const bodyData = JSON.stringify({
        name: `Technical Interviewer for ${interviewData.jobTitle}`,
        opening: `Welcome to the interview for ${interviewData.jobTitle}. Let\'s get started!`,
        prompt: formattedQuestions.join("\n"),
      });
      const response = await fetch("/api/create-knowledge-base", {
        method: "POST",
        body: bodyData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      throw error;
    }
  }

  async function fetchLatestKnowledgeBase() {
    try {
      const response = await fetch("/api/get-latest-knowledge-base", {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching latest knowledge base:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const knowledgeBase = await createKnowledgeBase();

      const knowledgeBases = await fetchLatestKnowledgeBase();
      const latestKnowledgeBase = knowledgeBases.data.list[0];
      const avatar = initAvatar(newToken);

      const customConfig = {
        ...DEFAULT_CONFIG,
        knowledgeId: latestKnowledgeBase.id,
      };

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(customConfig);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className=" relative w-full h-full flex gap-4">
      <div className="relative w-full h-full flex flex-col rounded-xl bg-zinc-900 overflow-hidden">
        <Button
          className="absolute top-3 right-3 !p-2 bg-zinc-700 bg-opacity-50 z-10"
          onClick={handleClose}
        >
          <CloseIcon />
        </Button>
        <div className="relative h-full w-full aspect-video overflow-hidden flex flex-col items-center justify-center">
          <AvatarVideo ref={mediaStream} />
        </div>
        <div className="relative flex w-full flex-col gap-3 items-center justify-center p-4 border-t border-zinc-700">
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <AvatarControls />
          ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
              <div className=" flex flex-row gap-4">
              <Button onClick={() => startSessionV2(true)}>
                Start Voice Chat
              </Button>
              <Button onClick={() => startSessionV2(false)}>
                Start Text Chat
              </Button>
            </div>
          ) : (
            <LoadingIcon />
          )}
        </div>
      </div>
      {sessionState === StreamingAvatarSessionState.CONNECTED && (
        <MessageHistory />
      )}
    </div>
  );
}

export default function InteractiveAvatarWrapper({
  interviewData,
}: {
  interviewData: InterviewData;
}) {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar interviewData={interviewData} />
    </StreamingAvatarProvider>
  );
}
