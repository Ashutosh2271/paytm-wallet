import React from 'react';
import { ArrowRight, Wallet, Shield, Zap, Award } from 'lucide-react';
import image from '../assets/photo.avif'
import { Link } from 'react-router-dom';
const LandingPage = () => {

  const Features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Instant Transfers",
      desc: "Send money instantly to anyone, anywhere. Zero waiting time."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure Payments",
      desc: "Bank-grade security with end-to-end encryption."
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Cashback Rewards",
      desc: "Earn rewards on every transaction. More spend, more rewards."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-bold bg-[#00baf2] bg-clip-text text-transparent mb-2">
              <span className='text-[#002970]'>
              Your Money,</span> Simplified
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience lightning-fast payments, seamless transfers, and exclusive rewards all in one place.
            </p>
            <div className="flex gap-4">
             <Link to="/login">
             <button className="bg-[#002970] text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-all">
                Get Started <ArrowRight />
              </button>
             </Link>
              <button className="border-2 text-white bg-[#00baf2] px-8 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
            
              <img src={image} alt="" className='h-full w-full object-cover' />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {Features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all">
                {feature.icon}
                <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

  
      <div className="bg-gradient-to-r from-[#002970] to-[#00baf2] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Sign up and start your journey towards smarter payments.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;