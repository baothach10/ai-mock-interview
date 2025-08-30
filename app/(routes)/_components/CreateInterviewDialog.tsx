import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CvUpload from "./CvUpload";
import JobDescription from "./JobDescription";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/app/Provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialog() {
  const [formData, setFormData] = React.useState<any>({});
  const [file, setFile] = useState<File>(null);
  const { userDetail, setUserDetail } = useUserDetail();
  const saveInterviewQuestion = useMutation(
    api.interviews.SaveInterviewQuestion
  );
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const formData_ = new FormData();
    formData_.append("file", file ?? null);
    formData_.append("jobTitle", formData.jobTitle);
    formData_.append("jobDescription", formData.jobDescription);

    try {
      const res = await axios.post(
        "api/generate-interview-questions",
        formData_
      );

      if (res.data.status == 429) {
        toast.warning("Too Many Requests, please try again after 24 hours!");
        setLoading(false);
        return;
      }

      console.log("Final: ", {
        questions: res.data.questions,
        resumeUrl: res.data.resumeUrl,
        uid: userDetail._id,
        jobDescription: formData.jobDescription,
        jobTitle: formData.jobTitle,
      });

      // router.push("/interview/" + userDetail._id);
      // Save to db
      const resp = await saveInterviewQuestion({
        questions: res.data.questions,
        resumeUrl: res.data.resumeUrl,
        uid: userDetail._id,
        jobDescription: formData.jobDescription,
        jobTitle: formData.jobTitle,
      });

      router.push('/interview/'+resp)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>+ Create Interview</Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Please submit following details.</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="cv-upload" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="cv-upload">CV Upload</TabsTrigger>
                <TabsTrigger value="job-description">
                  Job Description
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cv-upload">
                <CvUpload setFiles={(file: File) => setFile(file)} />
              </TabsContent>
              <TabsContent value="job-description">
                <JobDescription onHandleInputChange={onHandleInputChange}  />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6">
          <DialogClose>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={
              loading ||
              (!file && !formData?.jobTitle && !formData?.jobDescription)
            }
          >
            {loading && <Loader2Icon className="animate-spin" />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
