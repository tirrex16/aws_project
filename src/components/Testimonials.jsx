import { useState, useCallback, useEffect } from 'react';

const testimonials = [
  { quote: "Working with this studio was a transformative experience. They didn't just design our brand — they understood our vision and elevated it beyond what we imagined possible.", name: 'Sarah Chen', role: 'CEO, Meridian Architecture' },
  { quote: 'The attention to detail and strategic thinking behind every design decision was remarkable. Our digital presence has never been stronger.', name: 'James Hartwell', role: 'Founder, Lumière Beauty' },
  { quote: 'They bring a rare combination of artistic vision and technical precision. The final product exceeded all expectations and truly captures the spirit of our brand.', name: 'Yuki Tanaka', role: 'Creative Director, Aether Studio' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="max-w-[1560px] mx-auto px-10 py-[120px]" id="testimonials">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-[0.8125rem] text-[#999999]">(04)</span>
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/ Testimonials</span>
        <div className="flex-1 h-px bg-[#e8e8e8]" />
      </div>

      <blockquote className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-semibold leading-[1.5] tracking-[-0.025em] text-[#0f0f0f] mb-8 max-w-[780px]" style={{ margin: '0 0 32px 0' }}>
        "{testimonials[current].quote}"
      </blockquote>
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{testimonials[current].name}</span>
        <span className="text-[0.8125rem] text-[#999999]">{testimonials[current].role}</span>
      </div>
      <div className="flex gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={`h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
              index === current ? 'w-6 bg-[#0f0f0f]' : 'w-2 bg-[#cccccc]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
