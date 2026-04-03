 

import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaTicketAlt,
  FaCalendarPlus,
  FaUsers,
  FaCalendar,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBolt,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
  FaFire,
  FaGem,
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
    <section className="h-[92vh] min-h-[560px] bg-gray-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </section>
  );

  const slide = slides[current];

  return (
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden pt-16">
      {slides.map((s, i) => (
        <div key={s._id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={s.image} alt={s.heading} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Single overlay — sits above all slides, below content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              {slide.tag}
            </span>
            <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontFamily: "Poppins, sans-serif" }}>
              {slide.heading}
              <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-xl">{slide.sub}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="px-7 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 inline-flex items-center gap-2">
                <FaRocket /> Explore Events <FaArrowRight className="text-sm" />
              </Link>
              {(!user || user.role !== 'user') && (
                <Link to="/create-event" className="px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 inline-flex items-center gap-2">
                  <FaCalendarPlus /> Create Event
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 border border-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-black/50">
        ‹
      </button>
      <button onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 border border-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-black/50">
        ›
      </button>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient, features }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:scale-105 transition-all duration-300">
    <div
      className={`w-20 h-20 ${gradient} rounded-2xl flex items-center justify-center mb-6`}
    >
      <Icon className="text-white text-3xl" />
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

    <ul className="space-y-3">
      {features.map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-gray-700">
          <div
            className={`w-6 h-6 ${gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <FaCheckCircle className="text-white text-xs" />
          </div>
          <span className="text-sm font-medium">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const StepCard = ({ num, title, desc, icon: Icon, gradient }) => (
  <div className="relative text-center bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:scale-105 transition-all duration-300">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center relative">
      <div
        className={`absolute inset-2 ${gradient} rounded-2xl flex items-center justify-center`}
      >
        <Icon className="text-white text-3xl" />
      </div>
    </div>

    <div className="absolute -top-3 right-1/2 translate-x-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white border-4 border-white">
      {num}
    </div>

    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, role, text, rating, avatar }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:scale-105 transition-all duration-300">
    <div className="flex gap-2 mb-6">
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400 text-xl" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 leading-relaxed italic text-lg">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
        {avatar}
      </div>
      <div>
        <div className="font-bold text-gray-900 text-lg">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HERO SLIDER */}
      <HeroSlider user={user} />

      {/* STATS BAR */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {[
              { value: "10K+", label: "Active Events", Icon: FaFire, gradient: "bg-gradient-to-br from-orange-500 to-red-500" },
              { value: "50K+", label: "Happy Users", Icon: FaUsers, gradient: "bg-gradient-to-br from-blue-500 to-cyan-600" },
              { value: "100+", label: "Cities", Icon: FaMapMarkerAlt, gradient: "bg-gradient-to-br from-purple-600 to-indigo-600" },
              { value: "4.9★", label: "User Rating", Icon: FaGem, gradient: "bg-gradient-to-br from-yellow-500 to-orange-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-6">
                <div className={`w-11 h-11 ${s.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <s.Icon className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 px-5 py-2 rounded-full mb-5">
              <FaBolt className="text-yellow-500" />
              <span className="text-gray-900 font-semibold text-sm">Why Choose EventMe</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-5 text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Everything You Need for
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">Amazing Experiences</span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make event discovery and management effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={FaBolt}
              title="Lightning-Fast Booking"
              description="Book tickets in under 60 seconds with our streamlined checkout. One-click purchase, instant confirmation, and digital tickets delivered immediately."
              gradient="bg-gradient-to-br from-purple-600 to-indigo-600"
              features={[
                "One-click checkout",
                "Instant confirmation",
                "Digital tickets",
                "Secure payments",
              ]}
            />

            <FeatureCard
              icon={FaCalendarPlus}
              title="Powerful Event Tools"
              description="Create and manage events with professional-grade tools. Real-time analytics, attendee management, and automated notifications included."
              gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
              features={[
                "Easy event setup",
                "Real-time analytics",
                "Attendee management",
                "Auto notifications",
              ]}
            />

            <FeatureCard
              icon={FaShieldAlt}
              title="Enterprise Security"
              description="Bank-level encryption protects your data and payments. PCI DSS compliant with 24/7 monitoring and fraud detection."
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
              features={[
                "SSL encryption",
                "PCI compliant",
                "Fraud detection",
                "24/7 monitoring",
              ]}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-5 text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Get Started in
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">4 Simple Steps</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From discovery to attendance, we've streamlined every step.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <StepCard
              num={1}
              title="Browse & Discover"
              desc="Find events by category, location, or date with smart search."
              icon={FaCalendar}
              gradient="bg-gradient-to-br from-purple-600 to-indigo-600"
            />

            <StepCard
              num={2}
              title="Select Tickets"
              desc="Choose ticket type and quantity with transparent pricing."
              icon={FaTicketAlt}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
            />

            <StepCard
              num={3}
              title="Secure Payment"
              desc="Complete purchase with encrypted checkout and instant confirmation."
              icon={FaShieldAlt}
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />

            <StepCard
              num={4}
              title="Attend & Enjoy"
              desc="Show QR code at venue and create unforgettable memories."
              icon={FaStar}
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-5 text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Loved by
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">Thousands</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community has to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <TestimonialCard
              name="Sarah Johnson"
              role="Workshop Organizer"
              text="EventMe transformed how I organize my monthly workshops. The analytics dashboard gives me insights I never had before!"
              rating={5}
              avatar="S"
            />

            <TestimonialCard
              name="Michael Chen"
              role="Music Enthusiast"
              text="I've booked over 20 concerts through EventMe. The process is always smooth and tickets arrive instantly."
              rating={5}
              avatar="M"
            />

            <TestimonialCard
              name="Emily Rodriguez"
              role="Event Planner"
              text="Managing 500+ attendees used to be stressful, but EventMe makes it effortless. Highly recommended!"
              rating={5}
              avatar="E"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-white border border-gray-200 rounded-3xl p-12">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 px-5 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm text-green-700">Join 50,000+ Users Today</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-5 text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ready to Experience
              <span className="block mt-2">the Difference?</span>
            </h2>

            <p className="text-lg md:text-xl mb-10 text-gray-600">
              Start discovering amazing events or create your own in minutes.
            </p>

            <div className="flex gap-5 justify-center flex-wrap mb-10">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
              >
                <FaRocket className="text-lg" />
                Sign Up Free
                <FaArrowRight className="text-sm" />
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:text-purple-600 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
              >
                <FaMapMarkerAlt className="text-lg" />
                Contact Sales
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-gray-600 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
