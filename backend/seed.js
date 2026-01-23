import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.model.js';
import Item from './models/Item.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const demoUsers = [
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'Password1!',
        phone: '+12345678901',
        location: 'New York, NY',
        bio: 'Always looking out for lost items in the city.',
        isEmailVerified: true,
        isActive: true,
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'Password1!',
        phone: '+19876543210',
        location: 'Brooklyn, NY',
        bio: 'Community helper and avid jogger.',
        isEmailVerified: true,
        isActive: true,
    },
    {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: 'Password1!',
        phone: '+12125559876',
        location: 'Manhattan, NY',
        bio: 'University student who frequently loses things.',
        isEmailVerified: true,
        isActive: true,
    },
    {
        username: 'sarah_jones',
        email: 'sarah@example.com',
        password: 'Password1!',
        location: 'Queens, NY',
        bio: 'Dog walker, often find lost items in parks.',
        isEmailVerified: false,
        isActive: true,
    },
];

const createDemoItems = (userIds) => [
    // Lost items
    {
        title: 'Lost iPhone 15 Pro - Black',
        description: 'Lost my iPhone 15 Pro near Central Park entrance on 5th Ave. It has a black leather case and a cracked screen protector. Lock screen wallpaper is a sunset photo. Reward offered for safe return.',
        type: 'lost',
        category: 'Electronics',
        location: 'Central Park, 5th Avenue Entrance',
        date: new Date('2026-01-20'),
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
        status: 'active',
        contactInfo: { name: 'John Doe', phone: '+1234567890', email: 'john@example.com' },
        owner: userIds[0],
        tags: ['iphone', 'phone', 'electronics', 'black'],
    },
    {
        title: 'Missing Golden Retriever - "Buddy"',
        description: 'Our golden retriever Buddy went missing from our backyard in Brooklyn. He is 3 years old, wearing a blue collar with a bone-shaped tag. Very friendly. Please call if seen.',
        type: 'lost',
        category: 'Pets',
        location: 'Park Slope, Brooklyn',
        date: new Date('2026-01-18'),
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'],
        status: 'active',
        contactInfo: { name: 'Jane Smith', phone: '+1987654321', email: 'jane@example.com' },
        owner: userIds[1],
        tags: ['dog', 'golden retriever', 'pet', 'buddy'],
    },
    {
        title: 'Lost Wallet - Brown Leather',
        description: 'Lost my brown leather wallet somewhere between Times Square and Penn Station. Contains ID, credit cards, and some cash. Please return, no questions asked.',
        type: 'lost',
        category: 'Personal Items',
        location: 'Times Square to Penn Station area',
        date: new Date('2026-01-22'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Mike Wilson', phone: '+1555123456', email: 'mike@example.com' },
        owner: userIds[2],
        tags: ['wallet', 'leather', 'brown', 'id'],
    },
    {
        title: 'Lost Car Keys - Toyota Camry',
        description: 'Lost my Toyota Camry car keys with a red keychain near the parking lot at Grand Central Terminal. Has 3 keys on the ring plus a small flashlight.',
        type: 'lost',
        category: 'Keys',
        location: 'Grand Central Terminal Parking',
        date: new Date('2026-01-21'),
        images: [],
        status: 'active',
        contactInfo: { name: 'John Doe', email: 'john@example.com' },
        owner: userIds[0],
        tags: ['keys', 'car', 'toyota'],
    },
    {
        title: 'Lost Prescription Glasses',
        description: 'Lost my prescription glasses in a black hard case. They are rectangular frames with silver metal. Possibly left at a coffee shop on Broadway.',
        type: 'lost',
        category: 'Personal Items',
        location: 'Broadway, near 42nd Street',
        date: new Date('2026-01-19'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Sarah Jones', email: 'sarah@example.com' },
        owner: userIds[3],
        tags: ['glasses', 'prescription', 'case'],
    },
    {
        title: 'Lost Backpack - Navy Blue North Face',
        description: 'Left my navy blue North Face backpack on the subway (A train). Contains a laptop, notebooks, and a water bottle. The laptop has important university work on it.',
        type: 'lost',
        category: 'Bags',
        location: 'A Train Subway, between 59th St and 125th St',
        date: new Date('2026-01-17'),
        status: 'active',
        contactInfo: { name: 'Mike Wilson', phone: '+1555123456', email: 'mike@example.com' },
        owner: userIds[2],
        tags: ['backpack', 'north face', 'laptop', 'subway'],
    },

    // Found items
    {
        title: 'Found Silver Watch at Coffee Shop',
        description: 'Found a silver analog watch on the counter at Starbucks on Lexington Ave. It looks expensive - maybe a Tag Heuer or similar. Left it with the barista but posting here too.',
        type: 'found',
        category: 'Accessories',
        location: 'Starbucks, Lexington Avenue & 53rd St',
        date: new Date('2026-01-21'),
        images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'],
        status: 'active',
        contactInfo: { name: 'Jane Smith', email: 'jane@example.com' },
        owner: userIds[1],
        tags: ['watch', 'silver', 'starbucks'],
    },
    {
        title: 'Found Set of Keys near Dog Park',
        description: 'Found a set of 4 keys on a keyring with a small stuffed animal charm near the Prospect Park dog run. Has what looks like apartment and mailbox keys.',
        type: 'found',
        category: 'Keys',
        location: 'Prospect Park Dog Run, Brooklyn',
        date: new Date('2026-01-20'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Sarah Jones', email: 'sarah@example.com' },
        owner: userIds[3],
        tags: ['keys', 'keyring', 'park'],
    },
    {
        title: 'Found Child\'s Stuffed Bear in Park',
        description: 'Found a well-loved brown teddy bear on a bench in Washington Square Park. It has a red bow tie and one button eye. Looks like it belongs to a young child.',
        type: 'found',
        category: 'Toys',
        location: 'Washington Square Park, near fountain',
        date: new Date('2026-01-22'),
        images: ['https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400'],
        status: 'active',
        contactInfo: { name: 'John Doe', phone: '+1234567890', email: 'john@example.com' },
        owner: userIds[0],
        tags: ['teddy bear', 'toy', 'child', 'stuffed animal'],
    },
    {
        title: 'Found Laptop Charger at Library',
        description: 'Found a MacBook charger (USB-C, 67W) left plugged into an outlet at the New York Public Library reading room, 2nd floor.',
        type: 'found',
        category: 'Electronics',
        location: 'New York Public Library, 2nd Floor',
        date: new Date('2026-01-19'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Mike Wilson', email: 'mike@example.com' },
        owner: userIds[2],
        tags: ['charger', 'macbook', 'apple', 'library'],
    },
    {
        title: 'Found Prescription Sunglasses',
        description: 'Found a pair of prescription sunglasses (Ray-Ban style) in a brown leather case on the bench at Union Square. They have progressive lenses.',
        type: 'found',
        category: 'Personal Items',
        location: 'Union Square Park, south side bench',
        date: new Date('2026-01-23'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Jane Smith', email: 'jane@example.com' },
        owner: userIds[1],
        tags: ['sunglasses', 'prescription', 'ray-ban'],
    },
    {
        title: 'Found Student ID Card',
        description: 'Found an NYU student ID card on the sidewalk near Washington Place. Name on the card is partially visible. Contact me to identify and claim.',
        type: 'found',
        category: 'Documents',
        location: 'Washington Place, near NYU campus',
        date: new Date('2026-01-22'),
        images: [],
        status: 'active',
        contactInfo: { name: 'Sarah Jones', email: 'sarah@example.com' },
        owner: userIds[3],
        tags: ['id card', 'student', 'nyu', 'document'],
    },

    // Claimed items (success stories)
    {
        title: 'Lost Cat - Orange Tabby "Whiskers"',
        description: 'Our indoor cat Whiskers escaped through an open window. Orange tabby with white paws and a green collar. FOUND AND RETURNED! Thank you to everyone who helped!',
        type: 'lost',
        category: 'Pets',
        location: 'East Village, 2nd Avenue',
        date: new Date('2026-01-10'),
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
        status: 'claimed',
        contactInfo: { name: 'Jane Smith', email: 'jane@example.com' },
        owner: userIds[1],
        claimedBy: userIds[3],
        claimedAt: new Date('2026-01-14'),
        tags: ['cat', 'orange tabby', 'pet'],
    },
    {
        title: 'Found AirPods Pro Case',
        description: 'Found an AirPods Pro case (white) on the subway platform at 14th Street Union Square. Successfully returned to owner!',
        type: 'found',
        category: 'Electronics',
        location: '14th Street Union Square Station',
        date: new Date('2026-01-12'),
        images: [],
        status: 'claimed',
        contactInfo: { name: 'Mike Wilson', email: 'mike@example.com' },
        owner: userIds[2],
        claimedBy: userIds[0],
        claimedAt: new Date('2026-01-13'),
        tags: ['airpods', 'apple', 'earbuds'],
    },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear all collections
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Item.deleteMany({});
        console.log('All data cleared');

        // Create users
        console.log('Creating demo users...');
        const createdUsers = [];
        for (const userData of demoUsers) {
            const user = await User.create(userData);
            createdUsers.push(user);
            console.log(`  Created user: ${user.username} (${user.email})`);
        }

        // Create items
        console.log('Creating demo items...');
        const userIds = createdUsers.map((u) => u._id);
        const itemsData = createDemoItems(userIds);
        const createdItems = await Item.insertMany(itemsData);
        console.log(`  Created ${createdItems.length} items`);

        // Summary
        console.log('\n--- Seed Complete ---');
        console.log(`Users: ${createdUsers.length}`);
        console.log(`Items: ${createdItems.length}`);
        console.log(`  Lost: ${createdItems.filter((i) => i.type === 'lost').length}`);
        console.log(`  Found: ${createdItems.filter((i) => i.type === 'found').length}`);
        console.log(`  Active: ${createdItems.filter((i) => i.status === 'active').length}`);
        console.log(`  Claimed: ${createdItems.filter((i) => i.status === 'claimed').length}`);
        console.log('\nDemo credentials:');
        console.log('  Email: john@example.com / Password: Password1!');
        console.log('  Email: jane@example.com / Password: Password1!');
        console.log('  Email: mike@example.com / Password: Password1!');
        console.log('  Email: sarah@example.com / Password: Password1!');

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
