export default function ReturnsPage() {
  return (
    <div className="bg-[#111111] min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Policies</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-12">Return & Exchange Policy</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-400 leading-relaxed">
          <p>At Jersey World B, we take pride in providing high-quality jerseys and ensuring customer satisfaction. Please review our return policy below.</p>
          <p>Due to the nature of our products, all sales are considered final. We do not offer returns or exchanges unless the item received meets one of the following conditions:</p>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-3">
            {['The jersey has a manufacturing defect','There was an error in the customization or printing made by our team','The incorrect size or item was sent'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                </div>
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <p>If your order falls into one of the situations listed above, please contact us within <span className="text-white font-semibold">7 days</span> of receiving your order with the following information:</p>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-3">
            {['Your order number','A description of the issue','Clear photos showing the problem'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#c9a84c] font-black">{i + 1}.</span>
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <p>Once reviewed and approved, we will arrange for a replacement or appropriate resolution.</p>

          <div className="border-l-2 border-[#c9a84c] pl-6 space-y-3">
            <p className="text-white font-semibold">Please note:</p>
            <p>Items must be unused, unworn, and in their original condition.</p>
            <p>Returns or exchanges will not be accepted for sizing mistakes made when ordering, as customers are responsible for reviewing sizing before purchasing.</p>
          </div>

          <p>If you have any questions or concerns regarding your order, please <a href="/contact" className="text-[#c9a84c] hover:underline">contact our support team</a> and we will be happy to assist you.</p>
        </div>
      </div>
    </div>
  )
}
