import OpenAI from 'openai'

export const generateHafezWisdom = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: false
  })

  const prompt = `Select a random, authentic Hafez poem (2-3 lines) about love, wisdom, or spiritual transformation. 
    Choose from the entire Divan of Hafez, and return a different poem each time.
    Return only the English translation of the poem, followed by "- Hafez".
    Do not create new content or modify the poems.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a wise Persian oracle channeling Hafez's poetry. Select authentic poems, never create new ones."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 200
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('OpenAI Error:', error)
    throw error
  }
} 