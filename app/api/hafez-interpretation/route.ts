import { OpenAI } from 'openai';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }), 
      { status: 500 }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { verse, language, intention } = await req.json();

    const systemMessage = language === 'persian' 
      ? `متخصص در دیوان حافظ و عرفان صوفیانه. تفسیرهای شما باید اصیل و قابل درک باشد.`
      : `Scholar and mystic specializing in Hafez's Divan with deep knowledge of Sufi mysticism and Persian cultural traditions. Provide authentic interpretations.`;

    const intentionContext = intention && intention.trim() 
      ? `\n\nسوال یا نیت کاربر: "${intention.trim()}"\nلطفاً تفسیر خود را با توجه به این سوال یا نیت ارائه دهید و راهنمایی مرتبط با آن ارائه کنید.`
      : '';

    const userPrompt = language === 'persian'
      ? `این شعر حافظ را تفسیر کنید:

"${verse}"${intentionContext}

لطفاً تفسیر خود را به این صورت ارائه دهید:

بخش اول - تفسیر ساده و قابل فهم (برای عموم):
   ${intention && intention.trim() ? `- در ابتدا به سوال/نیت کاربر اشاره کنید.` : ''}
   - تفسیر ساده و قابل فهم (3-4 جمله، 150-200 کلمه)
   - معانی اصلی و پیام کلیدی
   - بدون اصطلاحات پیچیده
   - فقط محتوای تفسیر

بخش دوم - تفسیر عمیق و علمی (بعد از [READMORE_SPLIT]):
   - تفسیر عمیق از منابع معتبر
   - معانی عرفانی صوفیانه (شراب=عشق الهی، معشوق=حضور الهی، میخانه=آزادی معنوی)
   - بافت فرهنگی/تاریخی ایرانی
   - راهنمایی شخصی
   - حداکثر 300-400 کلمه (2-3 پاراگراف)
   - بر بینش‌های ضروری تمرکز کنید

فرمت: [تفسیر ساده][READMORE_SPLIT][تفسیر عمیق - 300-400 کلمه، خاص به این شعر]`
      : `Interpret this Hafez verse:

"${verse}"${intention && intention.trim() 
      ? `\n\nUser's question or intention: "${intention.trim()}"\nPlease provide your interpretation with consideration to this question or intention, offering relevant guidance.`
      : ''}

Please structure your interpretation as follows:

FIRST SECTION - Brief Insight:
   ${intention && intention.trim() ? `- BEGIN by directly referencing the user's question/intention.` : ''}
   - Simple, accessible interpretation in plain language
   - Main meanings and key message (3-4 sentences, 150-200 words max)
   - Avoid complex mystical terminology
   - DO NOT repeat title or use markdown
   - Write only interpretation content

SECOND SECTION - Deeper Insight (after [READMORE_SPLIT]):
   - Deep scholarly interpretation from authentic sources
   - Sufi mystical meanings (wine=divine love, beloved=divine presence, tavern=spiritual freedom, cupbearer=wisdom)
   - Traditional Persian cultural/historical context
   - Personal guidance and life application
   - Be specific, avoid generic phrases
   - Maximum 300-400 words (2-3 paragraphs)
   - Focus on essential insights only

FORMAT: [Brief content][READMORE_SPLIT][Deep interpretation - 300-400 words, specific to this verse]`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "gpt-4-turbo",
      max_tokens: language === 'persian' ? 400 : 500,
      temperature: 0.6,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
      response_format: { type: "text" }
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No choices returned from OpenAI');
    }

    return new Response(
      JSON.stringify({ 
        text: response.choices[0].message.content
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );  

  } catch (error) {
    console.error('Hafez Interpretation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}

