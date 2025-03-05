export default function Feedback() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center p-8">
      <h1 className="text-3xl md:text-4xl text-center mb-8 font-serif font-light text-amber-100">
        Share Your Feedback
      </h1>
      <div className="max-w-2xl text-lg space-y-6 text-amber-100/80">
        <p>
          We value your insights and experiences with the Oracle.
          Please share your thoughts, suggestions, or report any issues:
        </p>
        <a 
          href="https://github.com/yourusername/oracle-card-app/issues"
          className="block text-center mt-8 px-6 py-3 bg-purple-900/30 hover:bg-purple-800/40 
                   text-amber-100 rounded-lg border border-purple-500/30 hover:border-purple-400/40
                   transition-all duration-300"
        >
          ✨ Submit Feedback on GitHub ✨
        </a>
      </div>
    </main>
  )
} 