import React from 'react';

const text = 'Get it Done!';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 pt-16 sm:pt-0 sm:justify-center sm:py-8">
      <div className="w-full max-w-4xl mx-auto flex justify-center">
        <div className="relative inline-block">
          {/* Text */}
        <div className="flex justify-center space-x-1 lg:text-8xl text-6xl font-rancho text-primary-default drop-shadow-lg z-10">
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block animate-bounce"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  lineHeight: '1.2',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Shadow bar */}
          <div className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 right-0 h-2 sm:h-3 md:h-4 bg-black/20 rounded-full blur-md z-0" />
        </div>
      </div>

      {/* Subtitle */}
      <p className="font-lato text-base sm:text-lg md:text-xl lg:text-2xl text-primary-default/90 text-center mt-4 sm:mt-5 md:mt-6 px-4 max-w-2xl mx-auto">
        Stay organized, boost productivity, and achieve your goals.
      </p>
    </div>
  );
}
