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
      ? `شما یک محقق و عارف متخصص در دیوان حافظ هستید با دانش عمیق از عرفان صوفیانه و سنت‌های فرهنگی ایرانی. شما در تفسیر اشعار حافظ با توجه به:
- معانی عرفانی صوفیانه (شراب به عنوان عشق الهی، میخانه به عنوان آزادی معنوی، معشوق به عنوان حضور الهی)
- بافت فرهنگی و تاریخی سنتی ایرانی
- روش‌های تفسیر سنتی و علمی
- کاربرد شخصی و راهنمایی معنوی
- تفسیرهای معتبر از منابع سنتی و علمی
تخصص دارید. تفسیرهای شما باید برای خوانندگان ایرانی اصیل و قابل درک باشد.`
      : `You are a scholar and mystic specializing in Hafez's Divan with deep knowledge of Sufi mysticism and Persian cultural traditions. You have access to traditional scholarly interpretations and authentic sources. You are an expert in interpreting Hafez's poetry, considering:
- Sufi mystical meanings (wine as divine love, tavern as spiritual freedom, beloved as divine presence, cupbearer as bringer of wisdom)
- Traditional Persian cultural and historical context
- Traditional and scholarly interpretation methodologies from authentic sources
- Personal application and spiritual guidance
- Authentic interpretations from traditional and scholarly sources
Your interpretations should be authentic and resonate with Persian/Iranian readers.`;

    const intentionContext = intention && intention.trim() 
      ? `\n\nسوال یا نیت کاربر: "${intention.trim()}"\nلطفاً تفسیر خود را با توجه به این سوال یا نیت ارائه دهید و راهنمایی مرتبط با آن ارائه کنید.`
      : '';

    const userPrompt = language === 'persian'
      ? `این شعر حافظ را تفسیر کنید:

"${verse}"${intentionContext}

لطفاً تفسیر خود را به این صورت ارائه دهید:

بخش اول - تفسیر ساده و قابل فهم (برای عموم):
   ${intention && intention.trim() ? `- در ابتدای تفسیر، به طور مستقیم و طبیعی به سوال یا نیت کاربر اشاره کنید (مثلاً: "در مورد سوال شما درباره..." یا "با توجه به نیت شما...")` : ''}
   - تفسیر ساده و قابل فهم از شعر حافظ
   - معانی اصلی و پیام کلیدی به زبان ساده
   - راهنمایی اولیه و کاربردی مرتبط با سوال کاربر
   - بدون استفاده از اصطلاحات پیچیده عرفانی
   - فقط یک پاراگراف (حدود 3-4 جمله، حداکثر 150-200 کلمه)
   - بدون تکرار عنوان یا استفاده از فرمت‌های نشانه‌گذاری
   - فقط محتوای تفسیر را بنویسید

بخش دوم - تفسیر عمیق و علمی (بعد از [READMORE_SPLIT]):
   - تفسیر عمیق بر اساس منابع معتبر و سنتی
   - معانی عرفانی صوفیانه (نمادهای شراب، معشوق، میخانه، ساقی)
   - بافت فرهنگی و تاریخی سنتی ایرانی
   - تفسیرهای معتبر از منابع سنتی و علمی
   - راهنمایی شخصی و کاربرد در زندگی
   - اهمیت تاریخی و معنوی
   - ارائه تحلیل خاص و دقیق - از عبارات کلی یا تکرار خودداری کنید
   - هر تفسیر باید منحصر به فرد و متناسب با شعر خاص باشد

فرمت دقیق: [تفسیر ساده و قابل فهم - فقط محتوا، بدون عنوان یا نشانه‌گذاری][READMORE_SPLIT][تفسیر عمیق و علمی - خاص و دقیق، نه کلی]`
      : `Interpret this Hafez verse:

"${verse}"${intention && intention.trim() 
      ? `\n\nUser's question or intention: "${intention.trim()}"\nPlease provide your interpretation with consideration to this question or intention, offering relevant guidance.`
      : ''}

Please structure your interpretation as follows:

FIRST SECTION - Brief Insight:
   ${intention && intention.trim() ? `- BEGIN the interpretation by directly and naturally referencing the user's question or intention (e.g., "Regarding your question about..." or "In light of your intention to..."). Make it feel personal and tailored from the very start.` : ''}
   - Simple, accessible interpretation of the Hafez verse
   - Main meanings and key message in plain language
   - Initial guidance that anyone can understand, specifically related to the user's question
   - Avoid complex mystical terminology
   - Focus on what the verse means in everyday terms and how it relates to their specific situation
   - KEEP IT TO ONE PARAGRAPH (approximately 3-4 sentences, 150-200 words maximum)
   - DO NOT repeat the title "Brief Insight" or "Layman's Interpretation" in the text
   - DO NOT use markdown formatting like asterisks or bold
   - Write only the interpretation content, nothing else

SECOND SECTION - Deeper Insight (after [READMORE_SPLIT]):
   - Deep scholarly interpretation drawing from authentic traditional sources
   - Sufi mystical meanings (wine as divine love, beloved as divine presence, tavern as spiritual freedom, cupbearer as bringer of wisdom)
   - Traditional Persian cultural and historical context
   - Authentic interpretations from traditional and scholarly sources
   - Personal guidance and life application
   - Historical and spiritual significance
   - Provide specific, detailed analysis - avoid generic phrases or repetition
   - Each interpretation should be unique and tailored to the specific verse

EXACT FORMAT: [Interpretation content only - no title, no markdown][READMORE_SPLIT][Deep scholarly interpretation from authentic sources - specific and detailed, not generic]`;

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
      max_tokens: language === 'persian' ? 800 : 900,
      temperature: 0.7,
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

