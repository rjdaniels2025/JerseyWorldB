export default function DisclaimerPage() {
  return (
    <div className="bg-[#111111] min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-12">Product Disclaimer</h1>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <p>At Jersey World B, we are committed to offering high-quality jerseys inspired by the designs worn by professional teams and players.</p>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <p className="text-gray-300">Our products are <span className="text-white font-semibold">fan versions</span> of team jerseys designed for supporters who want to represent their favorite clubs and national teams. Jerseys may vary slightly from retail or stadium editions in terms of materials, tags, or minor design details.</p>
          </div>

          <div className="border-l-2 border-[#c9a84c] pl-6">
            <p className="text-white font-semibold mb-2">Affiliation Notice</p>
            <p>Jersey World B is not affiliated with, endorsed by, or officially connected to any professional sports teams, leagues, brands, or organizations. All team names, logos, and trademarks remain the property of their respective owners and are used for identification purposes only.</p>
          </div>

          <p>Product images displayed on our website and social media are intended to represent the design and style of the jersey as accurately as possible. However, minor differences in stitching, patches, or placement may occur due to manufacturing variations.</p>

          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-6">
            <p className="text-[#c9a84c] font-semibold">By purchasing from Jersey World B, customers acknowledge and accept this product disclaimer.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
