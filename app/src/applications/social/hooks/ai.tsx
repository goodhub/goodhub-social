import { useApplication } from '@/applications/utils';
import { useMutation } from '@tanstack/react-query';
import dedent from 'dedent';
import { z } from 'zod';

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}

const currentDate: Date = new Date();
const formattedDate: string = formatDate(currentDate);

const PROMPT = dedent`
  Today's date is ${formattedDate}. The user provide you with some text for their charity's Twitter handle. Please analyze the text to determine if it's about a good news, bad news, a request for help, a position we want to recruit, or an upcoming event. Based on the text type, generate the following:
   - a fun social media post of no less than 20 words, ensuring ALL information provided in the original text is included, but within 280 characters. Please DO NOT include hashtags, but you can include emojis.
   - In addition to the tweet text, if the original text is about some good news, a request for help, or a recruitment position, provide a catchy title (less than 6 words) and a brief subtitle (less than 18 words). 
   - In addition to the tweet text, if the original text is about an upcoming event, provide a catchy title (less than 6 words, including 'free' if applicable) and a brief subtitle of less than 18 words (including day and month, time and location if available). Please DO NOT include any date, time, or location if not provided in the original text.
   - In addition, if the original text is about an upcoming event, please set the "missing" field in the JSON output to "event". 
   - In addition to the tweet text, title, subtitle and missing data, provide one word in english language to use in an image search.
    Output a valid JSON object with the "tweet", "title", "subtitle", "image_search_word", and "missing" fields.
`;

const PARAMETERS = {
  max_tokens: 500
};

function debugLog(message: string): void {
  const debugMode: boolean = false; // Set to true to enable logging, false to disable
  if (debugMode) {
    console.log(message);
  }
}

const AIProcessedPost = z.object({
  tweet: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  image_search_word: z.string().optional(),
  missing: z.string().optional()
});

export type AIProcessedPost = z.infer<typeof AIProcessedPost>;

export const useSummarizePost = () => {
  const { client } = useApplication('ai');
  const getCompletion = client.ai.request.useMutation();

  return useMutation({
    mutationFn: async ({ input }: { input: string }) => {
      const data = await getCompletion.mutateAsync({
        prompt: PROMPT,
        input,
        ...PARAMETERS
      });

      const text = data.choices[0].message.content;
      debugLog('Raw text from the response\n\n' + text);

      const json = JSON.parse(text);
      return AIProcessedPost.parse(json);
    }
  });
};
