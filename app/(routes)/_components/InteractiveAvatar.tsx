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
import { useParams, useRouter } from "next/navigation";
import { useUserDetail } from "@/app/Provider";
import { useFeedback } from "@/context/FeedbackContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

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

  const params = useParams()

  const mediaStream = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  const conversationData = useRef<string[]>([])

  const userMessage = useRef<string>('')

  const agentMessage = useRef<string>('');

  const isStartedCall = useRef<boolean>(false)


  const { setFeedback } = useFeedback()
  const { userDetail } = useUserDetail();
  const saveFeedback = useMutation(
    api.feedbacks.SaveFeedback
  );

  const addContentToUserMessage = (content: string) => {
    userMessage.current += (userMessage.current ? " " : "") + content;
  };

  const addContentToAgentMessage = (content: string) => {
    agentMessage.current += (agentMessage.current ? " " : "") + content;
  };

  const clearUserMessage = () => {
    userMessage.current = "";
  };

  const clearAgentMessage = () => {
    agentMessage.current = "";
  };

  const clearAllMessages = () => {
    userMessage.current = "";
    agentMessage.current = "";
  };

  const addUserMessage = (content: string) => {
    conversationData.current.push(`Interviewee: ${content}`);
  };

  const addAgentMessage = (content: string) => {
    conversationData.current.push(`Interviewer: ${content}`);
  };

  const clearConversation = () => {
    conversationData.current = [];
  };

  const handleClose = () => {
    router.replace('/interview/' + params.interviewId)
  };


  const handleCloseCall = async () => {
    await stopAvatar();
    if (conversationData.current.length > 0) {
      // Get the feedbacks
      const feedbackData = await fetchFeedback(conversationData.current);

      // Save this data to context
      setFeedback(feedbackData)

      const interviewId =
        params.interviewId && typeof params.interviewId === "string"
          ? (params.interviewId as Id<"InterviewSessionTable">)
          : (Array.isArray(params.interviewId) ? (params.interviewId[0] as Id<"InterviewSessionTable">) : undefined);

      if (!interviewId) {
        console.error("Interview ID is missing or invalid.");
        return;
      }

      saveFeedback({
        feedback: feedbackData.feedback,
        interviewId,
        rating: feedbackData.rating,
        suggestions: feedbackData.suggestions,
        userId: userDetail._id
      })
    }
    router.replace(`/interview/${params.interviewId}/detailed`);
  };

  async function fetchFeedback(conversationData: string[]) {
    try {
      const bodyData = JSON.stringify({
        conversation: conversationData
      });
      const response = await fetch("/api/generate-feedback", {
        method: "POST",
        body: bodyData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }


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
        addUserMessage(userMessage.current)
        clearUserMessage()
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
        addContentToUserMessage(event.detail.message)
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
        addContentToAgentMessage(event.detail.message)
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
        addAgentMessage(agentMessage.current)
        clearAgentMessage()
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
          <AvatarVideo handleCloseAvatar={handleCloseCall} ref={mediaStream} />
        </div>
        <div className="relative flex w-full flex-col gap-3 items-center justify-center p-4 border-t border-zinc-700">
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <AvatarControls />
          ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
            <div className=" flex flex-row gap-4">
              <Button className="cursor-pointer" onClick={() => {
                isStartedCall.current = true
                startSessionV2(true)
              }}>
                Start Voice Chat
              </Button>
              <Button className="cursor-pointer" onClick={() => {
                isStartedCall.current = true
                startSessionV2(false)
              }}>
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
      {/* Fullscreen Overlay */}
      {isStartedCall.current && sessionState !== StreamingAvatarSessionState.CONNECTED && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg">
          <LoadingIcon size={48} className="text-white" />
          <p className="mt-4 text-white text-lg font-medium">
            {sessionState === StreamingAvatarSessionState.INACTIVE
              ? "Generating feedbacks..."
              : "Connecting..."}
          </p>
        </div>
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
