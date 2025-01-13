import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { cards } = await req.json()

  const prompt = `Generate a mystical oracle reading based on the following three cards: ${cards.join(', ')}. 
  The reading should include:
  1. An introduction about the cosmic energies aligning.
  2. A brief interpretation of each card's meaning in the context of the reading.
  3. An overall message about what these cards mean for the querent's future.
  4. A piece of advice or guidance based on the reading.
  
  Please format the response in HTML with appropriate tags for headings and paragraphs.`

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      { role: 'system', content: 'You are a mystical oracle reader, providing insightful and poetic readings.' },
      { role: 'user', content: prompt }
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

