export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Policies</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-12">Shipping Policy</h1>

        <div className="space-y-8 text-gray-400 leading-relaxed">
          <p>At Jersey World B, we aim to process and ship orders as efficiently as possible.</p>
          <p>All orders are first processed and prepared in our warehouse before being shipped. Once production and preparation are complete, orders are shipped to customers and typically arrive within <span className="text-white font-semibold">7–13 business days</span>.</p>
          <p>Customers will receive a tracking number from our team once their order has been shipped and is leaving the warehouse. Tracking information may take a short time to update depending on the carrier.</p>

          <div>
            <h2 className="text-xl font-black text-white mb-4">Shipping Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { region: '🇨🇦 Canada', rate: '$5 flat rate', detail: 'All Canadian provinces' },
                { region: '🌍 International', rate: '$10 flat rate', detail: 'Worldwide shipping' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#c9a84c]/40 transition-colors">
                  <p className="text-lg font-bold text-white mb-1">{item.region}</p>
                  <p className="text-2xl font-black text-[#c9a84c] mb-1">{item.rate}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-2 border-[#c9a84c] pl-6">
            <p>Please note that delivery times are estimates and may vary depending on location, shipping carrier, customs processing (for international orders), or other unforeseen delays.</p>
          </div>

          <p>If you have any questions regarding your order or shipping status, please <a href="/contact" className="text-[#c9a84c] hover:underline">contact our support team</a> and we will be happy to assist you.</p>
        </div>
      </div>
    </div>
  )
}
