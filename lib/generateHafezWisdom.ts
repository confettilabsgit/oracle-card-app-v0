import OpenAI from 'openai'

export const generateHafezWisdom = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: false
  })

  const prompt = `Select a random ghazal from Divan-e-Hafez (حافظ دیوان).
  Choose from the authentic collection of 495 ghazals.
  Return only the English translation of 2-3 lines from the selected ghazal, followed by "- Hafez".
  Important:
  - Only use verified translations from the Divan
  - Do not create new content or modify the poems
  - Each request should return a different ghazal
  - Include the ghazal number (1-495) in your internal selection process
  - Focus on themes of love, wisdom, spirituality, or transformation`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a scholar of classical Persian poetry with deep knowledge of Divan-e-Hafez. Your role is to select authentic verses from the Divan, never creating or modifying content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1.0,  // Maximum randomization
      max_tokens: 200,
      presence_penalty: 1.0,  // Encourage different responses
      frequency_penalty: 1.0  // Discourage repetition
    })

    const response = completion.choices[0].message.content
    if (!response) throw new Error('Empty response from OpenAI')
    
    return response
  } catch (error) {
    console.error('Hafez Wisdom Generation Error:', error)
    throw error
  }
} 