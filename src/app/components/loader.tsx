import React from 'react';

const text = 'Get it Done!';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative">
        {/* Text */}
        <div className="flex space-x-1 text-8xl font-rancho text-primary-default drop-shadow-lg z-10">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="animate-bounce"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Shadow bar */}
        <div className="absolute -bottom-2 left-0 w-full h-4 bg-black/20 rounded-full blur-md z-0" />
      </div>

      {/* Subtitle */}
      <span className="font-lato text-2xl text-primary-default text-center mt-6">
        Stay organized, boost productivity, and achieve your goals.
      </span>
    </div>
  );
}
