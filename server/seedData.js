import mongoose from 'mongoose';
import User from './models/User.js';
import Event from './models/Event.js';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventme');
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@eventme.com',
        password: 'password123',
        role: 'admin',
        phone: '+1234567890'
      },
      {
        name: 'John Organizer',
        email: 'organizer@eventme.com',
        password: 'password123',
        role: 'organizer',
        phone: '+1234567891'
      },
      {
        name: 'Sarah Smith',
        email: 'user@eventme.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567892'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567893'
      }
    ]);

    console.log('✅ Created users');

    // Create Events
    const events = await Event.create([
      {
        title: 'Summer Music Festival 2026',
        description: 'Experience the ultimate summer celebration with world-class artists, multiple stages, and unforgettable performances. Join thousands of music lovers for three days of non-stop entertainment.',
        category: 'Music',
        date: new Date('2026-07-15'),
        time: '18:00',
        location: {
          venue: 'Central Park Amphitheater',
          address: '123 Park Avenue',
          city: 'New York',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'General Admission',
            price: 89,
            quantity: 500,
            sold: 120
          },
          {
            name: 'VIP Pass',
            price: 199,
            quantity: 100,
            sold: 45
          }
        ],
        totalSeats: 600,
        availableSeats: 435,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'Global Tech Summit 2026',
        description: 'Connect with industry pioneers and explore breakthrough technologies shaping our future. Features keynote speakers, hands-on workshops, and exclusive networking sessions.',
        category: 'Conference',
        date: new Date('2026-08-20'),
        time: '09:00',
        location: {
          venue: 'Silicon Valley Convention Center',
          address: '456 Tech Boulevard',
          city: 'San Francisco',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Early Bird',
            price: 299,
            quantity: 200,
            sold: 85
          },
          {
            name: 'Standard Pass',
            price: 399,
            quantity: 300,
            sold: 120
          }
        ],
        totalSeats: 500,
        availableSeats: 295,
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'International Food & Wine Festival',
        description: 'Savor exquisite cuisines from Michelin-starred chefs and discover rare wines from prestigious vineyards. An unforgettable gastronomic journey awaits.',
        category: 'Festival',
        date: new Date('2026-06-25'),
        time: '12:00',
        location: {
          venue: 'Waterfront Plaza',
          address: '789 Harbor Drive',
          city: 'Miami',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Tasting Pass',
            price: 95,
            quantity: 400,
            sold: 180
          },
          {
            name: 'Chef\'s Table',
            price: 275,
            quantity: 50,
            sold: 30
          }
        ],
        totalSeats: 450,
        availableSeats: 240,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'City Marathon Championship',
        description: 'Join the most prestigious marathon event of the year. Challenge yourself on a scenic route through the city while supporting local charities. Professional timing and medical support provided.',
        category: 'Sports',
        date: new Date('2026-05-10'),
        time: '07:00',
        location: {
          venue: 'City Marathon Route',
          address: 'Starting at City Hall',
          city: 'Boston',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Full Marathon',
            price: 65,
            quantity: 1000,
            sold: 450
          },
          {
            name: 'Half Marathon',
            price: 45,
            quantity: 1500,
            sold: 680
          }
        ],
        totalSeats: 2500,
        availableSeats: 1370,
        image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Digital Marketing Workshop',
        description: 'Master the latest digital marketing strategies from industry experts. Learn SEO, social media marketing, content creation, and analytics in this intensive hands-on workshop.',
        category: 'Workshop',
        date: new Date('2026-06-15'),
        time: '10:00',
        location: {
          venue: 'Business Innovation Hub',
          address: '321 Marketing Street',
          city: 'Chicago',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Standard Ticket',
            price: 149,
            quantity: 100,
            sold: 55
          },
          {
            name: 'Premium Package',
            price: 249,
            quantity: 30,
            sold: 18
          }
        ],
        totalSeats: 130,
        availableSeats: 57,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Electronic Dance Music Festival',
        description: 'The biggest EDM festival of the year featuring world-renowned DJs, stunning light shows, and multiple stages. Dance the night away under the stars with thousands of music lovers.',
        category: 'Music',
        date: new Date('2026-08-28'),
        time: '19:00',
        location: {
          venue: 'Desert Festival Grounds',
          address: '555 Festival Way',
          city: 'Las Vegas',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'General Admission',
            price: 129,
            quantity: 800,
            sold: 520
          },
          {
            name: 'VIP Experience',
            price: 299,
            quantity: 200,
            sold: 145
          }
        ],
        totalSeats: 1000,
        availableSeats: 335,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Broadway Musical Spectacular',
        description: 'Experience the magic of Broadway with this spectacular musical performance. Featuring award-winning actors, stunning choreography, and unforgettable songs that will leave you mesmerized.',
        category: 'Theater',
        date: new Date('2026-09-12'),
        time: '20:00',
        location: {
          venue: 'Grand Theater',
          address: '555 Broadway Avenue',
          city: 'New York',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Standard Seating',
            price: 89,
            quantity: 150,
            sold: 95
          },
          {
            name: 'Premium Seating',
            price: 149,
            quantity: 50,
            sold: 38
          }
        ],
        totalSeats: 200,
        availableSeats: 67,
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'International Film Festival',
        description: 'Celebrate cinema from around the globe. Featuring award-winning films, exclusive premieres, Q&A sessions with directors, and red carpet events. A must-attend for film enthusiasts.',
        category: 'Festival',
        date: new Date('2026-10-15'),
        time: '18:00',
        location: {
          venue: 'Cinema Palace',
          address: '456 Film Street',
          city: 'Los Angeles',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Day Pass',
            price: 45,
            quantity: 300,
            sold: 180
          },
          {
            name: 'Festival Pass',
            price: 199,
            quantity: 100,
            sold: 65
          }
        ],
        totalSeats: 400,
        availableSeats: 155,
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Jazz Night Under the Stars',
        description: 'An intimate evening of smooth jazz featuring renowned musicians. Enjoy cocktails and gourmet appetizers while listening to timeless classics and contemporary jazz fusion.',
        category: 'Music',
        date: new Date('2026-07-22'),
        time: '20:00',
        location: {
          venue: 'Rooftop Jazz Lounge',
          address: '789 Skyline Avenue',
          city: 'Seattle',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Standard Seating',
            price: 55,
            quantity: 120,
            sold: 75
          },
          {
            name: 'VIP Table',
            price: 150,
            quantity: 20,
            sold: 12
          }
        ],
        totalSeats: 140,
        availableSeats: 53,
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups pitch their groundbreaking ideas to top investors. Network with entrepreneurs, VCs, and industry leaders. Witness the future of business unfold.',
        category: 'Conference',
        date: new Date('2026-09-05'),
        time: '14:00',
        location: {
          venue: 'Innovation Center',
          address: '234 Startup Boulevard',
          city: 'Austin',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Attendee Pass',
            price: 75,
            quantity: 200,
            sold: 145
          },
          {
            name: 'Investor Pass',
            price: 199,
            quantity: 50,
            sold: 38
          }
        ],
        totalSeats: 250,
        availableSeats: 67,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Photography Masterclass',
        description: 'Learn from award-winning photographers in this comprehensive workshop. Cover portrait, landscape, and street photography techniques. Includes hands-on practice and portfolio review.',
        category: 'Workshop',
        date: new Date('2026-08-10'),
        time: '09:00',
        location: {
          venue: 'Creative Arts Studio',
          address: '567 Gallery Lane',
          city: 'Portland',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Basic Workshop',
            price: 129,
            quantity: 30,
            sold: 22
          },
          {
            name: 'Advanced Package',
            price: 249,
            quantity: 15,
            sold: 11
          }
        ],
        totalSeats: 45,
        availableSeats: 12,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Championship Basketball Finals',
        description: 'Experience the intensity of professional basketball at its finest. Watch elite athletes compete for the championship title in this thrilling season finale.',
        category: 'Sports',
        date: new Date('2026-06-30'),
        time: '19:30',
        location: {
          venue: 'Sports Arena',
          address: '890 Stadium Drive',
          city: 'Denver',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Upper Deck',
            price: 45,
            quantity: 500,
            sold: 380
          },
          {
            name: 'Lower Bowl',
            price: 95,
            quantity: 300,
            sold: 245
          },
          {
            name: 'Courtside',
            price: 299,
            quantity: 50,
            sold: 48
          }
        ],
        totalSeats: 850,
        availableSeats: 177,
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Classical Symphony Orchestra',
        description: 'A magnificent evening of classical music performed by a world-class symphony orchestra. Featuring works by Beethoven, Mozart, and Tchaikovsky in a stunning concert hall.',
        category: 'Music',
        date: new Date('2026-09-18'),
        time: '19:00',
        location: {
          venue: 'Grand Concert Hall',
          address: '123 Symphony Street',
          city: 'Philadelphia',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Balcony',
            price: 39,
            quantity: 200,
            sold: 145
          },
          {
            name: 'Orchestra',
            price: 79,
            quantity: 150,
            sold: 98
          }
        ],
        totalSeats: 350,
        availableSeats: 107,
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Comedy Night Extravaganza',
        description: 'Laugh until your sides hurt with top comedians from around the country. An unforgettable night of stand-up comedy featuring both established stars and rising talents.',
        category: 'Theater',
        date: new Date('2026-07-08'),
        time: '20:30',
        location: {
          venue: 'Comedy Club Downtown',
          address: '456 Laugh Lane',
          city: 'Nashville',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'General Admission',
            price: 35,
            quantity: 150,
            sold: 98
          },
          {
            name: 'VIP Front Row',
            price: 65,
            quantity: 30,
            sold: 24
          }
        ],
        totalSeats: 180,
        availableSeats: 58,
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Craft Beer & BBQ Festival',
        description: 'Sample over 100 craft beers from local and international breweries paired with mouth-watering BBQ from award-winning pitmasters. Live music and games included.',
        category: 'Festival',
        date: new Date('2026-08-15'),
        time: '12:00',
        location: {
          venue: 'Riverside Park',
          address: '789 River Road',
          city: 'Portland',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Tasting Pass',
            price: 45,
            quantity: 600,
            sold: 420
          },
          {
            name: 'VIP Unlimited',
            price: 95,
            quantity: 100,
            sold: 78
          }
        ],
        totalSeats: 700,
        availableSeats: 202,
        image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Yoga & Wellness Retreat',
        description: 'Rejuvenate your mind, body, and soul in this transformative weekend retreat. Includes yoga sessions, meditation workshops, healthy meals, and spa treatments.',
        category: 'Workshop',
        date: new Date('2026-09-25'),
        time: '08:00',
        location: {
          venue: 'Mountain Wellness Center',
          address: '321 Zen Path',
          city: 'Boulder',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Day Pass',
            price: 89,
            quantity: 80,
            sold: 55
          },
          {
            name: 'Weekend Package',
            price: 299,
            quantity: 40,
            sold: 32
          }
        ],
        totalSeats: 120,
        availableSeats: 33,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Rock Concert: Legends Tour',
        description: 'Legendary rock bands reunite for an epic concert tour. Experience classic hits and new material in this high-energy show with spectacular stage production.',
        category: 'Music',
        date: new Date('2026-10-05'),
        time: '19:00',
        location: {
          venue: 'Stadium Arena',
          address: '555 Rock Avenue',
          city: 'Detroit',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'General Admission',
            price: 79,
            quantity: 1000,
            sold: 750
          },
          {
            name: 'Premium Seating',
            price: 149,
            quantity: 300,
            sold: 245
          }
        ],
        totalSeats: 1300,
        availableSeats: 305,
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'AI & Machine Learning Conference',
        description: 'Explore the cutting edge of artificial intelligence and machine learning. Featuring keynotes from tech giants, hands-on workshops, and networking opportunities.',
        category: 'Conference',
        date: new Date('2026-11-12'),
        time: '09:00',
        location: {
          venue: 'Tech Convention Center',
          address: '888 Innovation Drive',
          city: 'San Jose',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          {
            name: 'Standard Pass',
            price: 399,
            quantity: 400,
            sold: 285
          },
          {
            name: 'Premium Pass',
            price: 699,
            quantity: 100,
            sold: 72
          }
        ],
        totalSeats: 500,
        availableSeats: 143,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      }
    ]);

    console.log('✅ Created events');

    // Create Sample Bookings
    const bookings = await Booking.create([
      {
        user: users[2]._id,
        event: events[0]._id,
        tickets: [
          {
            ticketType: 'General Admission',
            quantity: 2,
            price: 75
          }
        ],
        totalAmount: 150,
        status: 'confirmed',
        bookingReference: 'BK' + Date.now() + '001'
      },
      {
        user: users[3]._id,
        event: events[1]._id,
        tickets: [
          {
            ticketType: 'Early Bird',
            quantity: 1,
            price: 299
          }
        ],
        totalAmount: 299,
        status: 'confirmed',
        bookingReference: 'BK' + Date.now() + '002'
      }
    ]);

    console.log('✅ Created bookings');

    // Create More Events for Better Coverage
    const additionalEvents = await Event.create([
      {
        title: 'Indie Music Showcase',
        description: 'Discover emerging indie artists in an intimate venue setting. Support local talent and enjoy unique performances you won\'t find anywhere else.',
        category: 'Music',
        date: new Date('2026-07-18'),
        time: '21:00',
        location: {
          venue: 'Underground Music Hall',
          address: '234 Indie Street',
          city: 'Austin',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Admission', price: 25, quantity: 200, sold: 145 },
          { name: 'Meet & Greet', price: 55, quantity: 30, sold: 28 }
        ],
        totalSeats: 230,
        availableSeats: 57,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Blockchain & Crypto Summit',
        description: 'Explore the future of finance with blockchain experts, crypto investors, and Web3 innovators. Learn about DeFi, NFTs, and emerging technologies.',
        category: 'Conference',
        date: new Date('2026-10-20'),
        time: '09:00',
        location: {
          venue: 'Crypto Convention Center',
          address: '567 Blockchain Blvd',
          city: 'Miami',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Standard Pass', price: 299, quantity: 300, sold: 215 },
          { name: 'VIP Access', price: 599, quantity: 50, sold: 42 }
        ],
        totalSeats: 350,
        availableSeats: 93,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Cooking Masterclass with Celebrity Chef',
        description: 'Learn professional cooking techniques from a Michelin-starred chef. Hands-on experience creating gourmet dishes with premium ingredients.',
        category: 'Workshop',
        date: new Date('2026-08-25'),
        time: '15:00',
        location: {
          venue: 'Culinary Institute',
          address: '890 Chef Avenue',
          city: 'San Francisco',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Participant', price: 189, quantity: 20, sold: 18 },
          { name: 'Observer', price: 49, quantity: 30, sold: 22 }
        ],
        totalSeats: 50,
        availableSeats: 10,
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Tennis Grand Slam Finals',
        description: 'Witness world-class tennis at its finest. The season\'s most anticipated match featuring top-ranked players competing for the championship.',
        category: 'Sports',
        date: new Date('2026-09-08'),
        time: '14:00',
        location: {
          venue: 'National Tennis Stadium',
          address: '456 Court Drive',
          city: 'New York',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Upper Level', price: 85, quantity: 400, sold: 320 },
          { name: 'Lower Level', price: 165, quantity: 200, sold: 178 },
          { name: 'Courtside', price: 450, quantity: 40, sold: 40 }
        ],
        totalSeats: 640,
        availableSeats: 102,
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Halloween Horror Festival',
        description: 'Experience the ultimate Halloween celebration with haunted houses, costume contests, live performances, and spine-chilling entertainment.',
        category: 'Festival',
        date: new Date('2026-10-31'),
        time: '18:00',
        location: {
          venue: 'Spooky Fairgrounds',
          address: '666 Halloween Lane',
          city: 'Salem',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Entry', price: 35, quantity: 800, sold: 620 },
          { name: 'Fast Pass', price: 65, quantity: 200, sold: 165 }
        ],
        totalSeats: 1000,
        availableSeats: 215,
        image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'Opera Night: La Traviata',
        description: 'Experience Verdi\'s masterpiece performed by internationally acclaimed opera singers. A night of passion, drama, and breathtaking vocals.',
        category: 'Theater',
        date: new Date('2026-11-15'),
        time: '19:30',
        location: {
          venue: 'Metropolitan Opera House',
          address: '789 Opera Plaza',
          city: 'New York',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Balcony', price: 65, quantity: 150, sold: 98 },
          { name: 'Orchestra', price: 145, quantity: 100, sold: 82 },
          { name: 'Box Seats', price: 295, quantity: 20, sold: 18 }
        ],
        totalSeats: 270,
        availableSeats: 72,
        image: 'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Hip Hop Festival 2026',
        description: 'The biggest hip hop event of the year featuring legendary rappers, up-and-coming artists, DJ battles, and breakdancing competitions.',
        category: 'Music',
        date: new Date('2026-08-05'),
        time: '16:00',
        location: {
          venue: 'Urban Festival Grounds',
          address: '321 Hip Hop Avenue',
          city: 'Atlanta',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Admission', price: 95, quantity: 1000, sold: 780 },
          { name: 'VIP Lounge', price: 225, quantity: 150, sold: 132 }
        ],
        totalSeats: 1150,
        availableSeats: 238,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'Sustainable Living Expo',
        description: 'Discover eco-friendly products, renewable energy solutions, and sustainable lifestyle practices. Meet green innovators and environmental activists.',
        category: 'Conference',
        date: new Date('2026-06-12'),
        time: '10:00',
        location: {
          venue: 'Green Convention Center',
          address: '555 Eco Drive',
          city: 'Seattle',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Day Pass', price: 25, quantity: 500, sold: 385 },
          { name: 'Weekend Pass', price: 45, quantity: 200, sold: 156 }
        ],
        totalSeats: 700,
        availableSeats: 159,
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Fitness Bootcamp Weekend',
        description: 'Transform your fitness with intensive training sessions led by professional coaches. Includes nutrition workshops and wellness seminars.',
        category: 'Workshop',
        date: new Date('2026-07-11'),
        time: '07:00',
        location: {
          venue: 'Fitness Complex',
          address: '234 Health Street',
          city: 'Los Angeles',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Weekend Pass', price: 149, quantity: 100, sold: 78 },
          { name: 'Premium Package', price: 249, quantity: 30, sold: 25 }
        ],
        totalSeats: 130,
        availableSeats: 27,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Soccer Championship Final',
        description: 'The ultimate showdown for the championship trophy. Watch elite soccer teams battle it out in this thrilling season finale.',
        category: 'Sports',
        date: new Date('2026-11-28'),
        time: '15:00',
        location: {
          venue: 'National Soccer Stadium',
          address: '777 Goal Avenue',
          city: 'Chicago',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Seating', price: 55, quantity: 1500, sold: 1245 },
          { name: 'Premium Seats', price: 125, quantity: 500, sold: 445 },
          { name: 'VIP Box', price: 350, quantity: 50, sold: 48 }
        ],
        totalSeats: 2050,
        availableSeats: 312,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Christmas Market Festival',
        description: 'Celebrate the holiday season with festive markets, artisan crafts, seasonal treats, live carolers, and Santa\'s workshop for kids.',
        category: 'Festival',
        date: new Date('2026-12-15'),
        time: '10:00',
        location: {
          venue: 'Town Square',
          address: '123 Holiday Lane',
          city: 'Boston',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Entry Pass', price: 15, quantity: 2000, sold: 1456 },
          { name: 'Family Package', price: 45, quantity: 300, sold: 245 }
        ],
        totalSeats: 2300,
        availableSeats: 599,
        image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: true
      },
      {
        title: 'Stand-Up Comedy Special',
        description: 'An evening of non-stop laughter with renowned comedians performing their latest material. Adults only, mature content.',
        category: 'Theater',
        date: new Date('2026-09-22'),
        time: '20:00',
        location: {
          venue: 'Laugh Factory',
          address: '456 Comedy Street',
          city: 'Las Vegas',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Standard Seating', price: 45, quantity: 200, sold: 165 },
          { name: 'Premium Front Row', price: 85, quantity: 40, sold: 38 }
        ],
        totalSeats: 240,
        availableSeats: 37,
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Country Music Jamboree',
        description: 'Experience authentic country music with top Nashville artists. Featuring line dancing, BBQ, and a honky-tonk atmosphere.',
        category: 'Music',
        date: new Date('2026-08-18'),
        time: '18:00',
        location: {
          venue: 'Country Music Hall',
          address: '789 Nashville Pike',
          city: 'Nashville',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Admission', price: 55, quantity: 400, sold: 285 },
          { name: 'VIP Backstage', price: 125, quantity: 50, sold: 42 }
        ],
        totalSeats: 450,
        availableSeats: 123,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Virtual Reality Gaming Expo',
        description: 'Step into the future of gaming with cutting-edge VR experiences, esports tournaments, and exclusive game previews.',
        category: 'Conference',
        date: new Date('2026-10-08'),
        time: '10:00',
        location: {
          venue: 'Gaming Convention Center',
          address: '456 Gamer Avenue',
          city: 'Los Angeles',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Day Pass', price: 45, quantity: 600, sold: 445 },
          { name: 'Weekend Pass', price: 95, quantity: 200, sold: 165 }
        ],
        totalSeats: 800,
        availableSeats: 190,
        image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Pottery & Ceramics Workshop',
        description: 'Learn the ancient art of pottery making. Create your own ceramic pieces with guidance from master potters.',
        category: 'Workshop',
        date: new Date('2026-07-28'),
        time: '13:00',
        location: {
          venue: 'Artisan Studio',
          address: '123 Clay Street',
          city: 'Portland',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Single Session', price: 75, quantity: 25, sold: 19 },
          { name: 'Full Course', price: 199, quantity: 15, sold: 13 }
        ],
        totalSeats: 40,
        availableSeats: 8,
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Extreme Sports Championship',
        description: 'Watch daredevils compete in skateboarding, BMX, and parkour competitions. Adrenaline-pumping action guaranteed.',
        category: 'Sports',
        date: new Date('2026-09-15'),
        time: '12:00',
        location: {
          venue: 'Extreme Sports Arena',
          address: '789 Action Boulevard',
          city: 'San Diego',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'General Admission', price: 35, quantity: 800, sold: 620 },
          { name: 'Premium Viewing', price: 75, quantity: 150, sold: 128 }
        ],
        totalSeats: 950,
        availableSeats: 202,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Cherry Blossom Festival',
        description: 'Celebrate spring with traditional performances, Japanese cuisine, and stunning cherry blossom displays.',
        category: 'Festival',
        date: new Date('2026-04-15'),
        time: '10:00',
        location: {
          venue: 'Botanical Gardens',
          address: '456 Blossom Lane',
          city: 'Washington DC',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Entry Pass', price: 20, quantity: 1000, sold: 785 },
          { name: 'VIP Experience', price: 55, quantity: 100, sold: 88 }
        ],
        totalSeats: 1100,
        availableSeats: 227,
        image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Shakespeare in the Park',
        description: 'Classic Shakespearean drama performed under the stars. Bring a blanket and enjoy timeless theater in a beautiful outdoor setting.',
        category: 'Theater',
        date: new Date('2026-07-25'),
        time: '19:30',
        location: {
          venue: 'Central Park Amphitheater',
          address: '123 Park Avenue',
          city: 'New York',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Lawn Seating', price: 25, quantity: 300, sold: 245 },
          { name: 'Reserved Seating', price: 55, quantity: 100, sold: 82 }
        ],
        totalSeats: 400,
        availableSeats: 73,
        image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Electronic Music Production Workshop',
        description: 'Master the art of electronic music production with industry professionals. Learn mixing, mastering, and sound design.',
        category: 'Workshop',
        date: new Date('2026-09-30'),
        time: '10:00',
        location: {
          venue: 'Sound Studio Complex',
          address: '567 Beat Street',
          city: 'Los Angeles',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Basic Workshop', price: 149, quantity: 40, sold: 32 },
          { name: 'Pro Package', price: 299, quantity: 20, sold: 18 }
        ],
        totalSeats: 60,
        availableSeats: 10,
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Wine Tasting & Vineyard Tour',
        description: 'Explore premium vineyards and taste exquisite wines. Includes guided tours, cheese pairings, and sommelier insights.',
        category: 'Festival',
        date: new Date('2026-10-22'),
        time: '11:00',
        location: {
          venue: 'Napa Valley Vineyards',
          address: '789 Wine Country Road',
          city: 'Napa',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Standard Tour', price: 65, quantity: 150, sold: 118 },
          { name: 'Premium Experience', price: 145, quantity: 50, sold: 42 }
        ],
        totalSeats: 200,
        availableSeats: 40,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Salsa Dancing Night',
        description: 'Learn salsa dancing from professional instructors followed by a social dance party. All skill levels welcome.',
        category: 'Music',
        date: new Date('2026-08-08'),
        time: '20:00',
        location: {
          venue: 'Latin Dance Club',
          address: '234 Rhythm Avenue',
          city: 'Miami',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Lesson + Dance', price: 35, quantity: 200, sold: 165 },
          { name: 'Dance Only', price: 20, quantity: 100, sold: 78 }
        ],
        totalSeats: 300,
        availableSeats: 57,
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Cybersecurity Summit 2026',
        description: 'Learn about the latest cybersecurity threats and defense strategies from industry experts. Essential for IT professionals.',
        category: 'Conference',
        date: new Date('2026-11-05'),
        time: '09:00',
        location: {
          venue: 'Tech Security Center',
          address: '890 Firewall Drive',
          city: 'San Francisco',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Standard Pass', price: 349, quantity: 250, sold: 195 },
          { name: 'Premium Access', price: 599, quantity: 75, sold: 62 }
        ],
        totalSeats: 325,
        availableSeats: 68,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      },
      {
        title: 'Ice Skating Spectacular',
        description: 'World-champion figure skaters perform breathtaking routines on ice. A magical winter experience for the whole family.',
        category: 'Sports',
        date: new Date('2026-12-20'),
        time: '18:00',
        location: {
          venue: 'Ice Arena',
          address: '456 Frozen Lane',
          city: 'Boston',
          country: 'USA'
        },
        organizer: users[1]._id,
        ticketTypes: [
          { name: 'Standard Seating', price: 45, quantity: 400, sold: 325 },
          { name: 'Rinkside Seats', price: 95, quantity: 100, sold: 88 }
        ],
        totalSeats: 500,
        availableSeats: 87,
        image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1200&h=800&fit=crop&q=80',
        status: 'published',
        featured: false
      }
    ]);

    console.log('✅ Created additional events');

    console.log('\n🎉 Seed data created successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@eventme.com');
    console.log('   Password: password123');
    console.log('\n👤 Organizer:');
    console.log('   Email: organizer@eventme.com');
    console.log('   Password: password123');
    console.log('\n👤 User:');
    console.log('   Email: user@eventme.com');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📊 Created ${users.length} users`);
    console.log(`🎫 Created ${events.length + additionalEvents.length} events`);
    console.log(`📝 Created ${bookings.length} bookings\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
