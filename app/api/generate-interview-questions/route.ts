import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    const { has } = await auth();
    const isSubscribedUser = has({ plan: "pro" });

    const decision = await aj.protect(request, {
      userId: user?.primaryEmailAddress?.emailAddress ?? "",
      requested: 1,
    }); // Deduct 1 token from the bucket

    if (decision.reason.isRateLimit() && !isSubscribedUser) {
      return NextResponse.json(
        {
          error: "Too Many Requests, please try again after 24 hours!",
          reason: decision.reason,
        },
        { status: 429 }
      );
    }

    if (file && typeof file.arrayBuffer === "function") {
      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const uploadPdf = await imagekit.upload({
        file: buffer, //required
        fileName: `upload-${Date.now()}.pdf`, //required
        //   isPublished: true,
        useUniqueFileName: true,
        isPrivateFile: false,
      });

      // Call the Pipedream API to process the file
      const result = await axios.post(
        process.env.PIPEDREAM_API_INTERVIEW_ENDPOINT!,
        {
          pdfUrl: uploadPdf.url,
        }
      );

      const jsonResult =
        typeof result.data === "string" ? JSON.parse(result.data) : result.data;

      return NextResponse.json(
        {
          questions: jsonResult.data.interview_questions,
          resumeUrl: uploadPdf.url,
        },
        { status: 200 }
      );
    } else {
      const result = await axios.post(
        process.env.PIPEDREAM_API_INTERVIEW_ENDPOINT!,
        {
          jobTitle: jobTitle,
          jobDescription: jobDescription,
        }
      );

      const jsonResult =
        typeof result.data === "string" ? JSON.parse(result.data) : result.data;

      return NextResponse.json(
        {
          questions: jsonResult.data.interview_questions,
          resumeUrl: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return new NextResponse("Error processing file", { status: 500 });
  }
}
