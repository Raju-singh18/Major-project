import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaTicketAlt, FaCalendarPlus, FaUsers, FaCalendar,
  FaMapMarkerAlt, FaShieldAlt, FaBolt, FaStar,
  FaArrowRight, FaCheckCircle, FaRocket, FaFire, FaGem,
} from "react-icons/fa";
import api from "../config/api";

const FALLBACK_SLIDES = [
  {
    _id: 'f1',
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    tag: "Music & Concerts",
    heading: "Discover Amazing",
    highlight: "Events Near You",
    sub: "From intimate workshops to sold-out concerts — find experiences that inspire, entertain, and connect.",
  },
  {
    _id: 'f2',
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    tag: "Conferences",
    heading: "Grow Your Network",
    highlight: "At Top Conferences",
    sub: "Connect with industry leaders, learn from experts, and take your career to the next level.",
  },
  {
    _id: 'f3',
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    tag: "Festivals",
    heading: "Celebrate Life",
    highlight: "With Thousands",
    sub: "Join vibrant festivals and cultural events that bring communities together in unforgettable ways.",
  },
];

// ── Reusable section header ───────────────────────────────────────────────────
const SectionHeader = ({ badge, badgeIcon: BadgeIcon, title, highlight, subtitle }) => (
  <div className="text-center mb-10 sm:mb-14">
    {badge && (
      <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-4 shadow-sm">
        {BadgeIcon && <BadgeIcon className="text-yellow-500 text-sm" />}
        <span className="text-gray-700 font-semibold text-xs sm:text-sm">{badge}</span>
      </div>
    )}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
      {title}
      {highlight && <span className="text-purple-600 block">{highlight}</span>}
    </h2>
    {subtitle && (
      <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
    )}
  </div>
);

// ── Hero Slider ───────────────────────────────────────────────────────────────
const HeroSlider = ({ user }) => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/hero-slides')
      .then(({ data }) => setSlides(data.length ? data : FALLBACK_SLIDES))
      .catch(() => setSlides(FALLBACK_SLIDES));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return (
    <section className="h-[88vh] min-h-[500px] bg-gray-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </section>
  );

  const slide = slides[current];

  return (
    <section className="relative h-[88vh] min-h-[500px] overflow-hidden pt-16">
      {slides.map((s, i) => (
        <div key={s._id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={s.image} alt={s.heading} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent z-[1]" />

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6">
              {slide.tag}
            </span>
            <h1 className="font-bold text-white leading-tight mb-3 sm:mb-4" style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)", fontFamily: "Poppins, sans-serif" }}>
              {slide.heading}
              <span className="block text-purple-400">{slide.highlight}</span>
            </h1>
            <p className="text-white/75 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed max-w-lg">{slide.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/events" className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                <FaRocket className="text-sm" /> Explore Events <FaArrowRight className="text-xs" />
              </Link>
              {(!user || user.role !== 'user') && (
                <Link to="/create-event" className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                  <FaCalendarPlus className="text-sm" /> Create Event
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-colors ${i === current ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/30 border border-white/20 rounded-full flex items-center justify-center text-white text-lg hover:bg-black/50 transition-colors">
        ‹
      </button>
      <button onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/30 border border-white/20 rounded-full flex items-center justify-center text-white text-lg hover:bg-black/50 transition-colors">
        ›
      </button>
    </section>
  );
};

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, gradient, features }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 hover:border-purple-300 transition-colors">
    <div className={`w-14 h-14 ${gradient} rounded-xl flex items-center justify-center mb-5`}>
      <Icon className="text-white text-2xl" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>
    <ul className="space-y-2.5">
      {features.map((item, i) => (
        <li key={i} className="flex items-center gap-2.5 text-gray-700">
          <div className={`w-5 h-5 ${gradient} rounded-md flex items-center justify-center flex-shrink-0`}>
            <FaCheckCircle className="text-white text-[10px]" />
          </div>
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ── Step Card ─────────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, icon: Icon, gradient }) => (
  <div className="relative text-center bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:border-purple-300 transition-colors">
    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 bg-gray-100 rounded-2xl flex items-center justify-center relative">
      <div className={`absolute inset-2 ${gradient} rounded-xl flex items-center justify-center`}>
        <Icon className="text-white text-xl sm:text-2xl" />
      </div>
    </div>
    <div className="absolute -top-3 right-1/2 translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm border-4 border-white">
      {num}
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
  </div>
);

// ── Testimonial Card ──────────────────────────────────────────────────────────
const TestimonialCard = ({ name, role, text, rating, avatar }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 hover:border-purple-300 transition-colors flex flex-col">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400 text-base" />
      ))}
    </div>
    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 flex-1">"{text}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
        {avatar}
      </div>
      <div>
        <div className="font-bold text-gray-900 text-sm">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  </div>
);

// ── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <HeroSlider user={user} />

      {/* STATS BAR */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10K+", label: "Active Events", Icon: FaFire, color: "bg-orange-500" },
              { value: "50K+", label: "Happy Users", Icon: FaUsers, color: "bg-blue-600" },
              { value: "100+", label: "Cities", Icon: FaMapMarkerAlt, color: "bg-purple-600" },
              { value: "4.9★", label: "User Rating", Icon: FaGem, color: "bg-yellow-500" },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5
                ${i % 2 === 1 ? 'border-l border-gray-100' : ''}
                ${i >= 2 ? 'border-t border-gray-100 lg:border-t-0' : ''}
                ${i >= 1 && i < 4 ? 'lg:border-l border-gray-100' : ''}`}>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <s.Icon className="text-white text-sm sm:text-base" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Why Choose EventMe"
            badgeIcon={FaBolt}
            title="Everything You Need for"
            highlight="Amazing Experiences"
            subtitle="Powerful features designed to make event discovery and management effortless."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={FaBolt}
              title="Lightning-Fast Booking"
              description="Book tickets in under 60 seconds with our streamlined checkout. Instant confirmation and digital tickets delivered immediately."
              gradient="bg-purple-600"
              features={["One-click checkout", "Instant confirmation", "Digital tickets", "Secure payments"]}
            />
            <FeatureCard
              icon={FaCalendarPlus}
              title="Powerful Event Tools"
              description="Create and manage events with professional-grade tools. Real-time analytics, attendee management, and automated notifications."
              gradient="bg-blue-600"
              features={["Easy event setup", "Real-time analytics", "Attendee management", "Auto notifications"]}
            />
            <FeatureCard
              icon={FaShieldAlt}
              title="Enterprise Security"
              description="Bank-level encryption protects your data and payments. PCI DSS compliant with 24/7 monitoring and fraud detection."
              gradient="bg-orange-600"
              features={["SSL encryption", "PCI compliant", "Fraud detection", "24/7 monitoring"]}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 sm:py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Get Started in"
            highlight="4 Simple Steps"
            subtitle="From discovery to attendance, we've streamlined every step of the journey."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <StepCard num={1} title="Browse & Discover" desc="Find events by category, location, or date with smart search." icon={FaCalendar} gradient="bg-purple-600" />
            <StepCard num={2} title="Select Tickets" desc="Choose ticket type and quantity with transparent pricing." icon={FaTicketAlt} gradient="bg-blue-600" />
            <StepCard num={3} title="Secure Payment" desc="Complete purchase with encrypted checkout and instant confirmation." icon={FaShieldAlt} gradient="bg-orange-600" />
            <StepCard num={4} title="Attend & Enjoy" desc="Show your ticket at the venue and create unforgettable memories." icon={FaStar} gradient="bg-green-600" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Loved by"
            highlight="Thousands"
            subtitle="See what our community has to say about their EventMe experience."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            <TestimonialCard
              name="Sarah Johnson" role="Workshop Organizer"
              text="EventMe transformed how I organize my monthly workshops. The analytics dashboard gives me insights I never had before!"
              rating={5} avatar="S"
            />
            <TestimonialCard
              name="Michael Chen" role="Music Enthusiast"
              text="I've booked over 20 concerts through EventMe. The process is always smooth and tickets arrive instantly."
              rating={5} avatar="M"
            />
            <TestimonialCard
              name="Emily Rodriguez" role="Event Planner"
              text="Managing 500+ attendees used to be stressful, but EventMe makes it effortless. Highly recommended!"
              rating={5} avatar="E"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 px-4 py-1.5 rounded-full mb-5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-xs sm:text-sm text-green-700">Join 50,000+ Users Today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Ready to Experience<br />
              <span className="text-purple-600">the Difference?</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-7 sm:mb-9 max-w-lg mx-auto">
              Start discovering amazing events or create your own in minutes.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap mb-7 sm:mb-9">
              <Link to="/register" className="px-6 sm:px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                <FaRocket /> Sign Up Free <FaArrowRight className="text-xs" />
              </Link>
              <Link to="/contact" className="px-6 sm:px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:text-purple-600 transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                <FaMapMarkerAlt /> Contact Sales
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm flex-wrap">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
