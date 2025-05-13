// frontend/src/pages/Testimonials.jsx
import React, { useState, useEffect, useRef } from 'react';

const Testimonials = ({ isDark }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Updated with 6 testimonials using the names you provided
  const testimonials = [
    {
      rating: 5,
      text: "HealthAI has revolutionized our diagnostic workflow. The accuracy of the diabetes prediction model is outstanding, helping us identify high-risk patients earlier and provide more timely interventions.",
      name: "Dr. Hassane Skikri",
      role: "Endocrinologist at Metro Medical Center",
      image: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      rating: 5,
      text: "I've been using HealthAI for six months now, and it has significantly improved our diagnostic accuracy. The brain tumor detection model saved us valuable time in critical cases.",
      name: "Dr. Ali Alfihri",
      role: "Neurologist at University Hospital",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      rating: 4,
      text: "The platform's intuitive interface makes it easy to input patient data and receive comprehensive diagnostic insights. HealthAI has become an essential tool in our clinical practice.",
      name: "Dr. Taha Rachdi",
      role: "Radiologist at City Hospital",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      rating: 5,
      text: "What impresses me most about HealthAI is how it combines multiple diagnostic models in one platform. It's like having a team of specialists providing second opinions on complex cases.",
      name: "Dr. Anas Aloui",
      role: "Cardiologist at Heart Institute",
      image: "https://randomuser.me/api/portraits/men/68.jpg"
    },
    {
      rating: 4,
      text: "The Alzheimer's detection model has been invaluable in our practice. We can now detect early signs that might have been missed before, enabling more effective treatment plans.",
      name: "Dr. Mohamed Rahiwi",
      role: "Geriatrician at Senior Care Center",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      rating: 5,
      text: "HealthAI provides detailed explanations for its diagnostic suggestions, which helps us understand the reasoning behind each recommendation. It's more than just a black box algorithm.",
      name: "Dr. Sarah jinani",
      role: "Primary Care Physician at Community Health",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 2));
      }, 6000);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Move to a specific slide
  const goToSlide = (index) => {
    setActiveSlide(index);
    
    // Reset interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 2));
      }, 6000);
    }
  };

  // Generate star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div id="testimonials" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
            TESTIMONIALS
          </div>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
            See what healthcare professionals say about HealthAI
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Our platform is trusted by healthcare professionals worldwide. Here's what they have to say.
          </p>
        </div>

        {/* Testimonial Slider - Modified to show two at once */}
        <div className="relative">
          <div 
            className="overflow-hidden"
            ref={sliderRef}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 50}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-[50%] px-4"
                >
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-8 flex flex-col h-full`}>
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="h-16 w-16 rounded-full object-cover border-4 border-sky-500 shadow-lg"
                      />
                      <div className="ml-4">
                        <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {testimonial.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {testimonial.role}
                        </p>
                        <div className="flex mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-lg italic ${isDark ? 'text-slate-300' : 'text-slate-600'} flex-grow`}>
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * 2)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 
                  ${activeSlide === index * 2
                    ? 'bg-sky-500' 
                    : isDark 
                      ? 'bg-slate-600 hover:bg-slate-500' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              ></button>
            ))}
          </div>
          
          {/* Custom Navigation Arrows - Centered vertically */}
          <button 
            onClick={() => {
              const newIndex = activeSlide === 0 ? testimonials.length - 2 : activeSlide - 2;
              goToSlide(newIndex < 0 ? 0 : newIndex);
            }}
            className={`absolute top-1/2 left-0 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
            } transition-colors`}
            aria-label="Previous testimonials"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              const newIndex = activeSlide + 2 >= testimonials.length ? 0 : activeSlide + 2;
              goToSlide(newIndex);
            }}
            className={`absolute top-1/2 right-0 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
            } transition-colors`}
            aria-label="Next testimonials"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;