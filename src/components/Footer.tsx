export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8">
        <div>
          <h3 className="text-lg text-lazada-dark font-medium mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-lazada-orange">Help Center</a></li>
            <li><a href="#" className="hover:text-lazada-orange">How to Buy</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-lazada-orange">International Product Policy</a></li>
            <li><a href="#" className="hover:text-lazada-orange">How to Return</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg text-lazada-dark font-medium mb-4">Lazada</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-lazada-orange">About Lazada</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Careers</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-lazada-orange">Press & Media</a></li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://lzd-img-global.slatic.net/g/tps/imgextra/i4/O1CN01Eo0vG428d0S5L0B4A_!!6000000007954-2-tps-150-150.png" 
              alt="Lazada App" 
              className="w-12 h-12 rounded-xl object-contain drop-shadow-sm"
            />
            <div>
              <p className="text-lazada-orange font-medium text-sm">Always Better</p>
              <p className="text-lazada-dark text-lg font-bold">Download the App</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 max-w-[200px]">
            <div className="bg-gray-800 text-white rounded p-2 text-center text-xs cursor-pointer hover:bg-gray-700">App Store</div>
            <div className="bg-gray-800 text-white rounded p-2 text-center text-xs cursor-pointer hover:bg-gray-700">Google Play</div>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-lazada-dark font-medium mb-4">Payment Methods</h3>
          <div className="flex flex-wrap gap-2 text-xl">
            <span className="text-blue-600 font-bold bg-gray-100 px-3 py-1 rounded">VISA</span>
            <span className="text-red-500 font-bold bg-gray-100 px-3 py-1 rounded">Mastercard</span>
            <span className="text-blue-400 font-bold bg-gray-100 px-3 py-1 rounded">GCash</span>
            <span className="text-green-500 font-bold bg-gray-100 px-3 py-1 rounded">PayMaya</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Lazada. All Rights Reserved.</p>
        <p className="mt-1 text-xs">Note: This is a school project created for educational purposes.</p>
      </div>
    </footer>
  );
}
