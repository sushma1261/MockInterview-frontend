import { useCallback, useEffect, useRef, useState } from "react";
import { getBaseUrl } from "../utils/utils";

interface UseStreamingChatOptions {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  wordDelayMs?: number;
}

export function useStreamingChat(options?: UseStreamingChatOptions) {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isPageVisibleRef = useRef(true);
  const accumulatedTextRef = useRef("");

  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasHidden = !isPageVisibleRef.current;
      isPageVisibleRef.current = !document.hidden;

      // When page becomes visible, show all accumulated text
      if (wasHidden && !document.hidden && accumulatedTextRef.current) {
        setResponse(accumulatedTextRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const streamChat = useCallback(
    async (
      question: string,
      image?: { base64data: string; mimeType: string }
    ) => {
      setIsStreaming(true);
      setResponse("");
      setError(null);

      accumulatedTextRef.current = "";
      const wordDelayMs = options?.wordDelayMs ?? 30;

      try {
        const res = await fetch(`${getBaseUrl()}/voice/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            ...(image && {
              base64data: image.base64data,
              mimeType: image.mimeType,
            }),
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let wordBuffer: string[] = [];
        let isProcessing = false;

        const processBuffer = async () => {
          if (isProcessing) return;
          isProcessing = true;

          while (wordBuffer.length > 0) {
            // If page is hidden, dump everything immediately
            if (!isPageVisibleRef.current) {
              const allText = wordBuffer.join("");
              accumulatedTextRef.current += allText;
              wordBuffer = [];
              break;
            }

            const word = wordBuffer.shift()!;
            accumulatedTextRef.current += word;
            setResponse(accumulatedTextRef.current);
            options?.onChunk?.(word);

            if (wordBuffer.length > 0) {
              await new Promise((resolve) => setTimeout(resolve, wordDelayMs));
            }
          }

          isProcessing = false;
        };

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            await processBuffer();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              if (data === "[DONE]") {
                await processBuffer();
                setIsStreaming(false);
                options?.onComplete?.(accumulatedTextRef.current);
                return accumulatedTextRef.current;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  throw new Error(parsed.error);
                }

                if (parsed.text) {
                  if (!isPageVisibleRef.current) {
                    // Page hidden - accumulate without delay
                    accumulatedTextRef.current += parsed.text;
                  } else {
                    // Page visible - add to buffer for word-by-word streaming
                    const words = parsed.text.split(/(\s+)/);
                    wordBuffer.push(...words);
                    processBuffer(); // Non-blocking
                  }
                }
              } catch (e) {
                console.warn("Failed to parse chunk:", data, e);
              }
            }
          }
        }

        setIsStreaming(false);
        return accumulatedTextRef.current;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        setIsStreaming(false);
        options?.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
    setIsStreaming(false);
    accumulatedTextRef.current = "";
  }, []);

  return {
    response,
    isStreaming,
    error,
    streamChat,
    reset,
  };
}
