import React, { useState, useEffect, useRef } from 'react';

const Testimonials = ({ isDark }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      rating: 5,
      text: "HealthAI is the ultimate time saver for healthcare professionals like me. The diabetes prediction model has helped me identify high-risk patients earlier.",
      name: "Dr. Sarah Johnson",
      role: "Endocrinologist at Metro Medical Center",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      rating: 4,
      text: "We can't understand how we've been practicing medicine without HealthAI. The accuracy of the diagnostic tools has improved our patient outcomes significantly.",
      name: "Dr. John Smith",
      role: "Radiologist at City Hospital",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      rating: 5,
      text: "With HealthAI, communication between all departments is far more efficient. The interface is intuitive and the diagnostic insights are incredibly valuable.",
      name: "Dr. Emily Chen",
      role: "Neurologist at University Medical Center",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      rating: 4,
      text: "We don't need to spend hours analyzing scans now that we have HealthAI. The brain tumor detection model has been a game-changer for our department.",
      name: "Dr. Michael Adams",
      role: "Neurosurgeon at Regional Hospital",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
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
        setActiveSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
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
            See some customer <span className="text-sky-500">feedback</span> about HealthAI
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Our platform is trusted by healthcare professionals worldwide. Here's what they have to say.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          <div 
            className="overflow-hidden"
            ref={sliderRef}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full px-4"
                >
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-8 flex flex-col md:flex-row items-center md:items-start gap-6`}>
                    <div className="md:w-1/4 flex flex-col items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="h-24 w-24 rounded-full object-cover border-4 border-sky-500 shadow-lg"
                      />
                      <div className="flex mt-4">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    
                    <div className="md:w-3/4">
                      <p className={`text-lg italic ${isDark ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                        "{testimonial.text}"
                      </p>
                      <div>
                        <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {testimonial.name}
                        </h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 
                  ${activeSlide === index 
                    ? 'bg-sky-500' 
                    : isDark 
                      ? 'bg-slate-600 hover:bg-slate-500' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
          
          {/* Custom Navigation Arrows */}
          <button 
            onClick={() => goToSlide((activeSlide - 1 + testimonials.length) % testimonials.length)}
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
            } transition-colors`}
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => goToSlide((activeSlide + 1) % testimonials.length)}
            className={`absolute top-1/2 right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
            } transition-colors`}
            aria-label="Next testimonial"
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