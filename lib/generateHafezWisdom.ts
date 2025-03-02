import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateHafezWisdom = async () => {
  const prompt = `Select an authentic Hafez poem (2-3 lines) that speaks to universal wisdom, love, or spiritual transformation. 
  Return only the poem itself, followed by "- Hafez". Do not create new content or interpret the poem.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a scholar of Hafez poetry. Only return authentic Hafez poems, never generate new content."
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