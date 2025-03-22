// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import * as echarts from "echarts";
interface Shop {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  imageUrl: string;
}
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  shopId: number;
}
interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}
interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}
const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const salesChartRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Simulated users database
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: "emma.wilson@example.com",
      name: "Emma Wilson",
      avatar:
          "https://public.readdy.ai/ai/img_res/38c10ee16ca4727afa7991da297f06d6.jpg",
    },
    {
      id: 2,
      email: "james.chen@example.com",
      name: "James Chen",
      avatar:
          "https://public.readdy.ai/ai/img_res/13794d43ec8eff22a7cbe069fdc2aa22.jpg",
    },
  ]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === loginEmail);
    if (
        user &&
        (loginPassword === "password" || loginPassword === signUpPassword)
    ) {
      // Allow both demo password and signup password
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      alert("Invalid credentials");
    }
  };
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Check if email already exists
    if (users.some((user) => user.email === signUpEmail)) {
      alert("Email already exists");
      return;
    }
    // In a real application, you would make an API call to create the user
    const newUser: User = {
      id: users.length + 1,
      email: signUpEmail,
      name: signUpName,
      avatar:
          "https://public.readdy.ai/ai/img_res/9a1f37409d82e08a3355877f5c276290.jpg",
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setConfirmPassword("");
    setIsSignUp(false);
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]); // Clear cart on logout
  };
  const shops: Shop[] = [
    {
      id: 1,
      name: "Ethereal Boutique",
      description: "Curated collection of bohemian fashion and accessories",
      category: "Fashion",
      rating: 4.8,
      imageUrl:
          "https://public.readdy.ai/ai/img_res/5ed73bf8ff2f718c2fd35c7b8a57929d.jpg",
    },
    {
      id: 2,
      name: "Urban Gadgets",
      description: "Latest tech accessories and smart devices",
      category: "Electronics",
      rating: 4.7,
      imageUrl:
          "https://public.readdy.ai/ai/img_res/40f0274a0ba0c3dc49fc73b0f015789d.jpg",
    },
    {
      id: 3,
      name: "Artisan Home",
      description: "Handcrafted home decor and furniture",
      category: "Home & Living",
      rating: 4.9,
      imageUrl:
          "https://public.readdy.ai/ai/img_res/f5d1681c5ada2a2b91ec401c5e88531e.jpg",
    },
  ];
  const products: Product[] = [
    {
      id: 1,
      name: "Vintage Boho Dress",
      price: 89.99,
      description: "Floral printed maxi dress with flutter sleeves",
      imageUrl:
          "https://public.readdy.ai/ai/img_res/db908bff3c08df8f439634a5f3a93cf3.jpg",
      shopId: 1,
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      price: 129.99,
      description: "Premium wireless earbuds with noise cancellation",
      imageUrl:
          "https://public.readdy.ai/ai/img_res/ada0159cf711245d7589af2d2ba8a24b.jpg",
      shopId: 2,
    },
  ];
  useEffect(() => {
    if (salesChartRef.current) {
      const chart = echarts.init(salesChartRef.current);
      const option = {
        animation: false,
        title: {
          text: "Monthly Sales Performance",
          textStyle: {
            color: "#333",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147],
            type: "line",
            smooth: true,
          },
        ],
      };
      chart.setOption(option);
    }
  }, []);
  const addToCart = (product: Product) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);
      if (existingItem) {
        return prev.map((item) =>
            item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };
  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white shadow-md z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-indigo-600">ShopGram</div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Search shops and products..."
                    className="w-96 px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
              <button
                  className="relative cursor-pointer !rounded-button whitespace-nowrap"
                  onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <i className="fas fa-shopping-cart text-xl text-gray-700"></i>
                {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
                )}
              </button>
              {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-700">{currentUser.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-gray-800 !rounded-button whitespace-nowrap"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
              ) : (
                  <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap"
                  >
                    Login
                  </button>
              )}
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="pt-20 pb-12">
          {/* Hero Section */}
          <div className="relative h-[500px] bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="w-1/2 text-white">
                <h1 className="text-5xl font-bold mb-6">
                  Discover Unique Products from Instagram Creators
                </h1>
                <p className="text-xl mb-8">
                  Shop directly from your favorite Instagram stores, all in one
                  place.
                </p>
                <a
                    href="https://readdy.ai/home/ff830f47-3f14-4267-b556-6bde5f39b817/bdd3ba8d-0f18-4900-a3dc-06420b97d887"
                    data-readdy="true"
                >
                  <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all cursor-pointer !rounded-button whitespace-nowrap">
                    Explore Shops
                  </button>
                </a>
              </div>
              <div className="w-1/2">
                <img
                    src="https://public.readdy.ai/ai/img_res/9bcd0da4ed07fdacbbc2f924061bf307.jpg"
                    alt="Featured Products"
                    className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
          {/* Featured Shops */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8">Featured Shops</h2>
            <div className="grid grid-cols-3 gap-8">
              {shops.map((shop) => (
                  <div
                      key={shop.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  >
                    <img
                        src={shop.imageUrl}
                        alt={shop.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <a
                          href="https://readdy.ai/home/ff830f47-3f14-4267-b556-6bde5f39b817/cfdd28b2-95ca-4d77-b788-adf384c5f779"
                          data-readdy="true"
                          className="hover:text-indigo-600 transition-colors"
                      >
                        <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                      </a>
                      <p className="text-gray-600 mb-4">{shop.description}</p>
                      <div className="flex items-center justify-between">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      {shop.category}
                    </span>
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>{shop.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </section>
          {/* Latest Products */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8">Latest Arrivals</h2>
            <div className="grid grid-cols-4 gap-6">
              {products.map((product) => (
                  <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="relative h-64">
                      <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-3">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </section>
          {/* Sales Performance Chart */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div ref={salesChartRef} style={{ height: "400px" }}></div>
            </div>
          </section>
        </main>
        {/* Login Modal */}
        {isLoginModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 w-[480px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-6">
                    <button
                        className={`text-xl font-bold ${!isSignUp ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"}`}
                        onClick={() => setIsSignUp(false)}
                    >
                      Login
                    </button>
                    <button
                        className={`text-xl font-bold ${isSignUp ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"}`}
                        onClick={() => setIsSignUp(true)}
                    >
                      Sign Up
                    </button>
                  </div>
                  <button
                      onClick={() => setIsLoginModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 !rounded-button whitespace-nowrap"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                {!isSignUp ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <button
                          type="submit"
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap"
                      >
                        Login
                      </button>
                      <p className="text-sm text-gray-600 text-center mt-4">
                        Demo accounts:
                        <br />
                        emma.wilson@example.com / password
                        <br />
                        james.chen@example.com / password
                      </p>
                    </form>
                ) : (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={signUpName}
                            onChange={(e) => setSignUpName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                            required
                        />
                      </div>
                      <button
                          type="submit"
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap"
                      >
                        Sign Up
                      </button>
                    </form>
                )}
              </div>
            </div>
        )}
        {/* Shopping Cart Sidebar */}
        {isCartOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Shopping Cart</h3>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer !rounded-button whitespace-nowrap"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Your cart is empty
                      </p>
                  ) : (
                      <>
                        {cartItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center py-4 border-b"
                            >
                              <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded"
                              />
                              <div className="ml-4 flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-gray-600">
                                  ${item.price.toFixed(2)} x {item.quantity}
                                </p>
                              </div>
                            </div>
                        ))}
                        <div className="mt-6">
                          <div className="flex justify-between mb-4">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold">
                        $
                              {cartItems
                                  .reduce(
                                      (total, item) => total + item.price * item.quantity,
                                      0,
                                  )
                                  .toFixed(2)}
                      </span>
                          </div>
                          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                            Checkout
                          </button>
                        </div>
                      </>
                  )}
                </div>
              </div>
            </div>
        )}
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">ShopGram</h4>
              <p className="text-gray-400">
                Your favorite Instagram shops, all in one place.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Fashion
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home & Living
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};
export default App;
