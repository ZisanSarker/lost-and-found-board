export default function FeaturesStrip() {
  const features = [
    {
      title: "100% Free",
      description: "No hidden fees or charges. Our platform is completely free for everyone to use.",
      icon: "dollar",
    },
    {
      title: "Secure & Private",
      description: "Your personal information is protected. Connect safely with verified community members.",
      icon: "lock",
    },
    {
      title: "Quick & Easy",
      description: "Post items in minutes with our simple and intuitive interface. No complicated steps.",
      icon: "bolt",
    },
    {
      title: "Community Driven",
      description: "Powered by a caring community dedicated to helping others find their belongings.",
      icon: "users",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "dollar":
        return (<svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
      case "lock":
        return (<svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
      case "bolt":
        return (<svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
      case "users":
        return (<svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">Why Choose Us</span>
          <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">Features That Make Us Stand Out</h2>
          <p className="mx-auto max-w-2xl text-responsive-base text-gray-700 leading-relaxed">We provide a reliable and user-friendly platform to help reunite people with their belongings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-4 text-orange-500">{getIcon(feature.icon)}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
