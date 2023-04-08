// pages/index.tsx

import LoadingDots from "@/components/loadingDots";
import MetaTags from "@/components/metaTags";
import ResizablePanel from "@/components/resizablePanel";
import { PageMeta } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { NextPage } from "next";
import { ReactNode, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MarkdownRenderer from "@/components/markdownRenderer";

interface Props {
    children: ReactNode;
    meta?: PageMeta;
  }
const DocsPage: NextPage<Props> = ({ children, meta: pageMeta }: Props) => {
  const [loading, setLoading] = useState(false);
  const [userQ, setUserQ] = useState("");
  const [answer, setAanswer] = useState<String>("");

  console.log("Streamed response: ", answer);

  const question = userQ;

  const generateAnswer = async (e: any) => {
    e.preventDefault();
    if (!userQ) {
      return toast.error("Please enter a question!");
    }

    setAanswer("");
    setLoading(true);
    const response = await fetch("/api/docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question
      })
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      toast.error(response.statusText);
      setLoading(false);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAanswer((prev) => prev + chunkValue);
    }

    setLoading(false);
  };


  return (
    <>
      <MetaTags
        title="Answerbot"
        description="Web Development answer-bot trained on Supabase, Nextjs, React, TailwindCSS."
        cardImage="/bot/docs-og.png"
        url=""
      />

      <div className="flex flex-col items-center justify-center min-h-screen mx-auto bg-base-200 text-white">
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mx-auto mt-12 text-center sm:mt-20">
          <h1 className="max-w-xl text-2xl font-bold sm:text-4xl mb-6">
            Ask me about web development!
          </h1>
          <div className="w-full max-w-xl">
            <textarea
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              rows={4}
              className="w-full p-2 my-5 border rounded-md shadow-md bg-neutral border-neutral-focus "
              placeholder={"e.g. What are edge functions?"}
            />

            {!loading && (
              <button
                className="w-full px-4 py-2 mt-2 font-mediu btn btn-primary"
                onClick={(e) => generateAnswer(e)}
              >
                Ask your question &rarr;
              </button>
            )}
            {loading && (
              <button
                className="w-full px-4 py-2 mt-2 font-mediu btn btn-primary"
                disabled
              >
                <LoadingDots color="white" style="xl" />
              </button>
            )}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                {answer && (
                  <>
                    <div>
                      <h2 className="mx-auto text-3xl font-bold sm:text-4xl">
                        Here is your answer:{" "}
                      </h2>
                    </div>
                      {answer.split("SOURCES:").map((splitanswer, index) => {
                        return (
                          <div
                            className={`p-4 transition bg-neutral border border-neutral-focus shadow-md rounded-xl overflow-x-auto max-w-xl ${
                              index === 0
                                ? "hover:border-accent-focus cursor-copy text-left"
                                : ""
                            }`}
                            onClick={() => {
                              if (index === 0) {
                                navigator.clipboard.writeText(splitanswer);
                                toast("Copied to clipboard!", {
                                  icon: "✂️"
                                });
                              }
                            }}
                            key={index}
                          >
                            {index === 0 ? (
                            <MarkdownRenderer content={splitanswer.trim()} />
                            
                            ) : (
                              <>
                                <p>SOURCES:</p>
                                <ul>
                                  {splitanswer
                                    .trim()
                                    .split("\n")
                                    .filter((url) => url.trim().length > 0)
                                    .map((url) =>
                                      url.includes("http") ? (
                                        <li key={uuidv4()}>
                                        <a
                                            className="underline text-accent"
                                            target="_blank" 
                                            href={url.replace(/^-+/g, '')} // Remove leading hyphens
                                            >
                                            {url.replace(/^-+/g, '')}
                                          </a>
                                        </li>
                                      ) : (
                                        <li key={uuidv4()}>{url}</li>
                                      )
                                    )}
                                </ul>
                              </>
                            )}
                            <style>
                              {`
                              p {
                                margin-bottom: 20px;
                              }
                            `}
                            </style>
                          </div>
                        );
                      })}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
          </div>
        </main>
      </div>
    </>
  );
};

export default DocsPage;
