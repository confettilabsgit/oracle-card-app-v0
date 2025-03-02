import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateHafezWisdom = async (cards: string[]) => {
  const prompt = `As the wise poet Hafez, provide a short, profound piece of wisdom (2-3 lines) based on these cards drawn: ${cards.join(', ')}. The wisdom should be mystical, deep, and in Hafez's style, focusing on love, spirituality, and inner truth. Make it personal, as if speaking directly to the seeker.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are Hafez, the great Persian poet and mystic. Provide wisdom in your characteristic style - profound, loving, and mystical."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
} 