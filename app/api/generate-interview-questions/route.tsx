import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arcjet";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    const decision = await aj.protect(request, { requested: 5 }); // Deduct 5 tokens from the bucket

    if (decision.reason.isRateLimit()) {
      console.log("Arcjet decision", decision);
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
      const result = await axios.post(process.env.PIPEDREAM_API_ENDPOINT!, {
        pdfUrl: uploadPdf.url,
      });

      console.log(result.data)

      const jsonResult =
        typeof result.data === "string" ? JSON.parse(result.data) : result.data;

      return NextResponse.json(
        {
          questions: jsonResult.data.interview_questions,
          resumeUrl: uploadPdf.url,
        },
        { status: 200 }
      );

      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // const result = {
      //   data: [
      //     {
      //       question:
      //         "Based on your resume, you've managed up to fifty bank accounts. Can you describe a situation where managing a large number of accounts presented a significant challenge, and how you overcame it?",
      //       answer:
      //         "Managing fifty bank accounts simultaneously required meticulous organization and efficient processes. One significant challenge was reconciling discrepancies across multiple accounts with varying reporting deadlines. To overcome this, I implemented a color-coded spreadsheet system categorizing accounts by urgency and type, which allowed me to prioritize tasks effectively and reduce errors. I also developed a streamlined process for data entry and reconciliation, using automated checks wherever possible.",
      //     },
      //     {
      //       question:
      //         "Your resume highlights experience formulating pro-forma budgets. Describe your approach to developing a pro-forma budget, and what factors you consider most critical for accuracy and effectiveness.",
      //       answer:
      //         "My approach to pro-forma budgeting begins with a thorough understanding of the organization's strategic goals and anticipated revenue streams. I then collaborate with relevant departments to gather detailed expense projections. I consider factors like inflation, seasonality, and potential market fluctuations. Critical to accuracy is regularly reviewing and revising the budget based on actual performance data, allowing for timely adjustments to ensure alignment with evolving business needs.",
      //     },
      //     {
      //       question:
      //         "You mention converting manual to computerized accounting systems. Describe a specific instance where you led such a conversion. What were the key steps involved, and what challenges did you encounter?",
      //       answer:
      //         "In my role at [Organization Name], I led the conversion of a manual accounts payable system to a computerized one using QuickBooks. Key steps included data migration, staff training, and system testing. The biggest challenge was ensuring data integrity during the migration process. We addressed this through rigorous data validation and reconciliation checks before and after the transition. Furthermore, thorough staff training minimized disruptions and facilitated a smooth transition.",
      //     },
      //     {
      //       question:
      //         "Your resume shows experience with various software programs including QuickBooks, MS Access, and SQL. Describe a project where you used SQL to solve a business problem. What were the results?",
      //       answer:
      //         "While my SQL skills are foundational, in a project at [Organization Name], I used basic SQL queries to extract and analyze data from a database. I identified trends in customer purchase behavior, which then informed targeted marketing strategies. The result was a 15% increase in sales within the next quarter directly attributable to data-driven insights derived from my analysis.",
      //     },
      //     {
      //       question:
      //         "You've worked in various accounting roles. Describe a time you had to deal with a significant accounting discrepancy. How did you approach the problem, and what was the outcome?",
      //       answer:
      //         "At [Organization Name], I discovered a significant discrepancy in our year-end financial statements. I systematically reviewed all relevant source documents, and through meticulous cross-checking, identified an error in the depreciation calculation of a major asset. This careful review allowed me to not only correct the error but also implement stricter procedures to prevent such issues from happening again. This demonstrated the importance of attention to detail in maintaining financial integrity.",
      //     },
      //     {
      //       question:
      //         "Your resume indicates experience with federal and state payroll reports. Explain your understanding of the complexities involved in ensuring compliance with relevant regulations.",
      //       answer:
      //         "Ensuring payroll compliance involves understanding and adhering to various federal and state regulations, including tax withholding, reporting requirements, and minimum wage laws. It's crucial to stay updated with changes in legislation and interpret them correctly in payroll processing. For instance, I am familiar with the nuances of different state unemployment tax systems and ensure all reports are filed accurately and on time.",
      //     },
      //     {
      //       question:
      //         "Describe a situation where you had to work under pressure to meet a tight deadline. What strategies did you use to manage your time and workload effectively?",
      //       answer:
      //         "During year-end closing at [Organization Name], we faced an extremely tight deadline for completing financial statements. To manage this, I prioritized tasks based on urgency and importance, delegating when possible. I also utilized efficient time-management techniques such as time blocking and utilized technology effectively to accelerate data processing. Successfully completing the audit on time validated my proactive approach.",
      //     },
      //     {
      //       question:
      //         "You have a Bachelor of Science in Accounting. How has your education prepared you for the challenges of this role?",
      //       answer:
      //         "My accounting education provided me with a solid foundation in accounting principles, financial reporting, and auditing standards. I've developed skills in analyzing financial data, interpreting financial statements, and applying these concepts to real-world business scenarios. Furthermore, the coursework has enhanced my analytical and problem-solving abilities, enabling me to approach complex financial tasks methodically and efficiently.",
      //     },
      //     {
      //       question:
      //         "Your resume mentions a minor in Computer Information Systems. How have you integrated your knowledge of CIS into your accounting work?",
      //       answer:
      //         "My CIS minor enhanced my understanding of databases, software applications, and data analysis techniques. I've leveraged this knowledge to automate many accounting tasks, improve data efficiency, and enhance reporting capabilities. The ability to interact with technology has been critical in optimizing workflows and increasing accuracy in my accounting roles.",
      //     },
      //     {
      //       question:
      //         "You've been a member of IMA, Bellevue University Student Chapter. What were your contributions to this organization?",
      //       answer:
      //         "As a member of the IMA student chapter, I actively participated in meetings, workshops, and networking events. I volunteered my skills to help the chapter's operations, focusing on event planning and communications. This further developed my collaboration, networking, and communication skills.",
      //     },
      //     {
      //       question:
      //         "Describe a situation where you had to work effectively with a team to achieve a common goal.",
      //       answer:
      //         "During the implementation of a new accounting software, I worked closely with a team consisting of IT staff, other accountants, and management. I facilitated communication between team members, ensuring everyone understood their roles and responsibilities. My collaborative approach led to the successful and timely implementation of the system with minimal disruptions.",
      //     },
      //     {
      //       question:
      //         "Your resume indicates experience as a student intern at Mutual of Omaha. What were your key responsibilities, and what did you learn from that experience?",
      //       answer:
      //         "As a student intern, I assisted with various accounting projects, including financial statement preparation, data entry, and account reconciliation. This internship provided me with invaluable real-world experience and enhanced my practical skills. I learned the importance of accuracy, attention to detail, and working within a corporate environment.",
      //     },
      //     {
      //       question:
      //         "Looking at your chronological work history, what is a significant accomplishment you are most proud of and why?",
      //       answer:
      //         "Converting manual accounting systems to computerized systems at [Organization Name] is my most significant accomplishment. It demonstrated my ability to manage complex projects, lead teams, and implement solutions that improved efficiency and accuracy. It increased data accuracy and reduced processing time by approximately 40%, resulting in significant cost savings for the company.",
      //     },
      //   ],
      //   resumeUrl: "https://example.com/resume.pdf",
      // };

      // return NextResponse.json(
      //   {
      //     questions: result.data,
      //     resumeUrl: result.resumeUrl,
      //   },
      //   { status: 200 }
      // );
    } else {
      // const result = {
      //   data: [
      //     {
      //       question:
      //         "Based on your resume, you've managed up to fifty bank accounts. Can you describe a situation where managing a large number of accounts presented a significant challenge, and how you overcame it?",
      //       answer:
      //         "Managing fifty bank accounts simultaneously required meticulous organization and efficient processes. One significant challenge was reconciling discrepancies across multiple accounts with varying reporting deadlines. To overcome this, I implemented a color-coded spreadsheet system categorizing accounts by urgency and type, which allowed me to prioritize tasks effectively and reduce errors. I also developed a streamlined process for data entry and reconciliation, using automated checks wherever possible.",
      //     },
      //     {
      //       question:
      //         "Your resume highlights experience formulating pro-forma budgets. Describe your approach to developing a pro-forma budget, and what factors you consider most critical for accuracy and effectiveness.",
      //       answer:
      //         "My approach to pro-forma budgeting begins with a thorough understanding of the organization's strategic goals and anticipated revenue streams. I then collaborate with relevant departments to gather detailed expense projections. I consider factors like inflation, seasonality, and potential market fluctuations. Critical to accuracy is regularly reviewing and revising the budget based on actual performance data, allowing for timely adjustments to ensure alignment with evolving business needs.",
      //     },
      //     {
      //       question:
      //         "You mention converting manual to computerized accounting systems. Describe a specific instance where you led such a conversion. What were the key steps involved, and what challenges did you encounter?",
      //       answer:
      //         "In my role at [Organization Name], I led the conversion of a manual accounts payable system to a computerized one using QuickBooks. Key steps included data migration, staff training, and system testing. The biggest challenge was ensuring data integrity during the migration process. We addressed this through rigorous data validation and reconciliation checks before and after the transition. Furthermore, thorough staff training minimized disruptions and facilitated a smooth transition.",
      //     },
      //     {
      //       question:
      //         "Your resume shows experience with various software programs including QuickBooks, MS Access, and SQL. Describe a project where you used SQL to solve a business problem. What were the results?",
      //       answer:
      //         "While my SQL skills are foundational, in a project at [Organization Name], I used basic SQL queries to extract and analyze data from a database. I identified trends in customer purchase behavior, which then informed targeted marketing strategies. The result was a 15% increase in sales within the next quarter directly attributable to data-driven insights derived from my analysis.",
      //     },
      //     {
      //       question:
      //         "You've worked in various accounting roles. Describe a time you had to deal with a significant accounting discrepancy. How did you approach the problem, and what was the outcome?",
      //       answer:
      //         "At [Organization Name], I discovered a significant discrepancy in our year-end financial statements. I systematically reviewed all relevant source documents, and through meticulous cross-checking, identified an error in the depreciation calculation of a major asset. This careful review allowed me to not only correct the error but also implement stricter procedures to prevent such issues from happening again. This demonstrated the importance of attention to detail in maintaining financial integrity.",
      //     },
      //     {
      //       question:
      //         "Your resume indicates experience with federal and state payroll reports. Explain your understanding of the complexities involved in ensuring compliance with relevant regulations.",
      //       answer:
      //         "Ensuring payroll compliance involves understanding and adhering to various federal and state regulations, including tax withholding, reporting requirements, and minimum wage laws. It's crucial to stay updated with changes in legislation and interpret them correctly in payroll processing. For instance, I am familiar with the nuances of different state unemployment tax systems and ensure all reports are filed accurately and on time.",
      //     },
      //     {
      //       question:
      //         "Describe a situation where you had to work under pressure to meet a tight deadline. What strategies did you use to manage your time and workload effectively?",
      //       answer:
      //         "During year-end closing at [Organization Name], we faced an extremely tight deadline for completing financial statements. To manage this, I prioritized tasks based on urgency and importance, delegating when possible. I also utilized efficient time-management techniques such as time blocking and utilized technology effectively to accelerate data processing. Successfully completing the audit on time validated my proactive approach.",
      //     },
      //     {
      //       question:
      //         "You have a Bachelor of Science in Accounting. How has your education prepared you for the challenges of this role?",
      //       answer:
      //         "My accounting education provided me with a solid foundation in accounting principles, financial reporting, and auditing standards. I've developed skills in analyzing financial data, interpreting financial statements, and applying these concepts to real-world business scenarios. Furthermore, the coursework has enhanced my analytical and problem-solving abilities, enabling me to approach complex financial tasks methodically and efficiently.",
      //     },
      //     {
      //       question:
      //         "Your resume mentions a minor in Computer Information Systems. How have you integrated your knowledge of CIS into your accounting work?",
      //       answer:
      //         "My CIS minor enhanced my understanding of databases, software applications, and data analysis techniques. I've leveraged this knowledge to automate many accounting tasks, improve data efficiency, and enhance reporting capabilities. The ability to interact with technology has been critical in optimizing workflows and increasing accuracy in my accounting roles.",
      //     },
      //     {
      //       question:
      //         "You've been a member of IMA, Bellevue University Student Chapter. What were your contributions to this organization?",
      //       answer:
      //         "As a member of the IMA student chapter, I actively participated in meetings, workshops, and networking events. I volunteered my skills to help the chapter's operations, focusing on event planning and communications. This further developed my collaboration, networking, and communication skills.",
      //     },
      //     {
      //       question:
      //         "Describe a situation where you had to work effectively with a team to achieve a common goal.",
      //       answer:
      //         "During the implementation of a new accounting software, I worked closely with a team consisting of IT staff, other accountants, and management. I facilitated communication between team members, ensuring everyone understood their roles and responsibilities. My collaborative approach led to the successful and timely implementation of the system with minimal disruptions.",
      //     },
      //     {
      //       question:
      //         "Your resume indicates experience as a student intern at Mutual of Omaha. What were your key responsibilities, and what did you learn from that experience?",
      //       answer:
      //         "As a student intern, I assisted with various accounting projects, including financial statement preparation, data entry, and account reconciliation. This internship provided me with invaluable real-world experience and enhanced my practical skills. I learned the importance of accuracy, attention to detail, and working within a corporate environment.",
      //     },
      //     {
      //       question:
      //         "Looking at your chronological work history, what is a significant accomplishment you are most proud of and why?",
      //       answer:
      //         "Converting manual accounting systems to computerized systems at [Organization Name] is my most significant accomplishment. It demonstrated my ability to manage complex projects, lead teams, and implement solutions that improved efficiency and accuracy. It increased data accuracy and reduced processing time by approximately 40%, resulting in significant cost savings for the company.",
      //     },
      //   ],
      //   resumeUrl: null,
      //   jobTitle: jobTitle,
      //   jobDescription: jobDescription,
      // };

      // console.log({
      //   questions: result.data,
      //   resumeUrl: result.resumeUrl,
      //   jobTitle: result.jobTitle,
      //   jobDescription: result.jobDescription,
      // });

      // return NextResponse.json(
      //   {
      //     questions: result.data,
      //     resumeUrl: result.resumeUrl,
      //     jobTitle: result.jobTitle,
      //     jobDescription: result.jobDescription,
      //   },
      //   { status: 200 }
      // );

      const result = await axios.post(process.env.PIPEDREAM_API_ENDPOINT!, {
        jobTitle: jobTitle,
        jobDescription: jobDescription,
      });

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
