export default function Footer({ content }: { content: 'oracle' | 'hafez' }) {
  if (content === 'oracle') {
    return (
      <footer className="w-full mt-16 pb-12 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-amber-100/80 text-base md:text-lg leading-relaxed space-y-8">
            {/* Introduction */}
            <p className="text-left">
              The Persian Oracle is a quiet digital ritual inspired by Persian myth, symbolism, and poetry. Flip three cards with a question in mind. Let the pattern that appears guide your reflection. You can read in English or فارسی.
            </p>

            {/* How it works */}
            <div>
              <h3 className="text-amber-200 text-lg md:text-xl font-serif mb-4 text-center">How it works</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Take a breath and hold a question or intention. Keep it simple.</li>
                <li>Flip three cards, one at a time. Notice what you feel before you analyze.</li>
                <li>Read the interpretation, then sit with it. If it lands, write one sentence about what you will do next.</li>
              </ol>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-amber-200 text-lg md:text-xl font-serif mb-4 text-center">FAQs</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-amber-200 mb-1">What is this, exactly?</p>
                  <p>A modern, bilingual take on Persian-inspired divination. It is designed for reflection, not certainty.</p>
                </div>
                <div>
                  <p className="font-medium text-amber-200 mb-1">Do I need to believe in anything?</p>
                  <p>No. Use it like a mirror. If it helps, it helps.</p>
                </div>
                <div>
                  <p className="font-medium text-amber-200 mb-1">Is this traditional?</p>
                  <p>It is inspired by real traditions, but presented as a contemporary, respectful experience.</p>
                </div>
                <div>
                  <p className="font-medium text-amber-200 mb-1">Can I read in Persian?</p>
                  <p>Yes. Switch to فارسی anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="w-full mt-16 pb-12 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-amber-100/80 text-base md:text-lg leading-relaxed space-y-8">
          {/* Introduction */}
          <p className="text-left">
            Fal-e Hafez is a beloved Persian practice of opening the Divan of Hafez, the poet you end up quoting when life gets complicated. If you know, you know. If not, a quick search will catch you up. Think of it as bibliomancy with a poet who tells the truth sideways. This digital version keeps it simple: you arrive with a question, you open the book, and you receive a verse with a clear interpretation in English or فارسی.
          </p>

          {/* How it works */}
          <div>
            <h3 className="text-amber-200 text-lg md:text-xl font-serif mb-4 text-center">How it works</h3>
            <ol className="space-y-3 list-decimal list-inside">
              <li>Ask a question. One sentence is enough. Do not overthink it.</li>
              <li>Open the Divan to reveal your verse. Read it once, then again slowly.</li>
              <li>Read the interpretation and choose one action or mindset shift to carry forward.</li>
            </ol>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-amber-200 text-lg md:text-xl font-serif mb-4 text-center">FAQs</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-amber-200 mb-1">What should I ask?</p>
                <p>Anything you are genuinely unsure about. Love, timing, decisions, or inner clarity all work.</p>
              </div>
              <div>
                <p className="font-medium text-amber-200 mb-1">Is this "real" Fal-e Hafez?</p>
                <p>It is a modern digital version inspired by the tradition. If you want, you can compare it to your own Divan at home.</p>
              </div>
              <div>
                <p className="font-medium text-amber-200 mb-1">Do you translate the poetry?</p>
                <p>Yes. You can explore the verse and meaning in English or فارسی.</p>
              </div>
              <div>
                <p className="font-medium text-amber-200 mb-1">Is it free?</p>
                <p>Yes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

