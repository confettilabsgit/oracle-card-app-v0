import { Configuration, OpenAIApi } from 'openai-edge'
import { StreamingTextResponse, OpenAIStream } from 'ai'

// Export runtime config
export const runtime = 'edge'

// Create an OpenAI API client (that's edge-friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: messages,
    })

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}