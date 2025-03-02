import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateHafezWisdom = async () => {
  const prompt = `Select a random, authentic Hafez poem (2-3 lines) about love, wisdom, or spiritual transformation. 
  Choose from the entire Divan of Hafez, and return a different poem each time.
  Return only the English translation of the poem, followed by "- Hafez".
  Do not create new content or modify the poems.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a scholar of Hafez poetry with access to the complete Divan. Select authentic, varied poems, never repeat the same one."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.9,  // Higher temperature for more variety
  })

  return completion.choices[0].message.content
} 