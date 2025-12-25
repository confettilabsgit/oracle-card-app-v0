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

    const { verse, cardName, cardPersianName, language } = await req.json();

    const systemMessage = language === 'persian' 
      ? `شما یک محقق و عارف متخصص در دیوان حافظ هستید با دانش عمیق از عرفان صوفیانه و سنت‌های فرهنگی ایرانی. شما در تفسیر اشعار حافظ با توجه به:
- معانی عرفانی صوفیانه (شراب به عنوان عشق الهی، میخانه به عنوان آزادی معنوی، معشوق به عنوان حضور الهی)
- بافت فرهنگی و تاریخی سنتی ایرانی
- روش‌های تفسیر سنتی و علمی
- کاربرد شخصی و راهنمایی معنوی
تخصص دارید. تفسیرهای شما باید برای خوانندگان ایرانی اصیل و قابل درک باشد.`
      : `You are a scholar and mystic specializing in Hafez's Divan with deep knowledge of Sufi mysticism and Persian cultural traditions. You are an expert in interpreting Hafez's poetry, considering:
- Sufi mystical meanings (wine as divine love, tavern as spiritual freedom, beloved as divine presence, cupbearer as bringer of wisdom)
- Traditional Persian cultural and historical context
- Traditional and scholarly interpretation methodologies
- Personal application and spiritual guidance
Your interpretations should be authentic and resonate with Persian/Iranian readers.`;

    const userPrompt = language === 'persian'
      ? `این شعر حافظ را تفسیر کنید. مهم: تفسیر باید کاملاً بر شعر حافظ متمرکز باشد و کارت فقط در پایان به عنوان مکمل ذکر شود.

"${verse}"

لطفاً تفسیر خود را به این صورت ارائه دهید:

بخش اول - تفسیر سطح بالا حافظ (شروع کنید با این، بدون ذکر کارت):
   - تفسیر کلی و سطح بالا از شعر حافظ
   - معانی اصلی و پیام کلیدی شعر
   - راهنمایی اولیه بر اساس شعر
   - هیچ اشاره‌ای به کارت نکنید در این بخش

بخش دوم - حکمت عرفانی عمیق‌تر (بعد از [READMORE_SPLIT]):
   - معانی عرفانی صوفیانه عمیق‌تر (نمادهای شراب، معشوق، میخانه، ساقی)
   - بافت فرهنگی و تاریخی سنتی ایرانی
   - راهنمایی شخصی و کاربرد در زندگی
   - اهمیت تاریخی و معنوی
   - هنوز هیچ اشاره‌ای به کارت نکنید

بخش سوم - اهمیت کارت ${cardPersianName} (فقط در پایان، بعد از [CARD_CONNECTION]):
   - در پایان، به طور خلاصه (1-2 جمله) اشاره کنید که این کارت چگونه به عنوان مکمل این تفسیر عمل می‌کند
   - کارت باید مکمل باشد، نه بخش اصلی

فرمت دقیق: [تفسیر سطح بالا حافظ - بدون ذکر کارت][READMORE_SPLIT][حکمت عرفانی عمیق‌تر - بدون ذکر کارت][CARD_CONNECTION][اهمیت کارت به عنوان مکمل]`
      : `Interpret this Hafez verse. IMPORTANT: The interpretation must focus entirely on the Hafez verse, and the card should only be mentioned at the very end as a supplement.

"${verse}"

Please structure your interpretation as follows:

FIRST SECTION - High-level Hafez Interpretation (START HERE, do NOT mention the card):
   - High-level, general interpretation of the Hafez verse
   - Main meanings and key message of the verse
   - Initial guidance based on the verse
   - DO NOT mention the card in this section

SECOND SECTION - Deeper Mystical Wisdom (after [READMORE_SPLIT]):
   - Deeper Sufi mystical meanings (wine as divine love, beloved as divine presence, tavern as spiritual freedom, cupbearer as bringer of wisdom)
   - Traditional Persian cultural and historical context
   - Personal guidance and life application
   - Historical and spiritual significance
   - STILL do NOT mention the card in this section

THIRD SECTION - Card Significance (ONLY at the end, after [CARD_CONNECTION]):
   - At the very end, briefly (1-2 sentences) mention how the ${cardName} card serves as a supplement to this interpretation
   - The card should complement, not be the main focus

EXACT FORMAT: [High-level Hafez interpretation - NO card mention][READMORE_SPLIT][Deeper mystical wisdom - NO card mention][CARD_CONNECTION][Card significance as supplement]`;

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

