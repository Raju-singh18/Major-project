// Script to fix wishlist field in database
// Run with: node fix-wishlist-db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';

dotenv.config({ path: './server/.env' });

const fixWishlist = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    let fixed = 0;
    let alreadyHas = 0;

    for (const user of users) {
      console.log(`Checking user: ${user.email}`);
      
      if (!user.wishlist) {
        console.log('  ❌ Missing wishlist field - Adding...');
        user.wishlist = [];
        await user.save();
        fixed++;
        console.log('  ✅ Fixed!');
      } else if (!Array.isArray(user.wishlist)) {
        console.log('  ❌ Wishlist is not an array - Fixing...');
        user.wishlist = [];
        await user.save();
        fixed++;
        console.log('  ✅ Fixed!');
      } else {
        console.log(`  ✅ Already has wishlist (${user.wishlist.length} items)`);
        alreadyHas++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  Total users: ${users.length}`);
    console.log(`  Fixed: ${fixed}`);
    console.log(`  Already had wishlist: ${alreadyHas}`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const usersAfter = await User.find({});
    const allHaveWishlist = usersAfter.every(u => Array.isArray(u.wishlist));
    
    if (allHaveWishlist) {
      console.log('✅ All users now have wishlist field!');
    } else {
      console.log('❌ Some users still missing wishlist field');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixWishlist();
