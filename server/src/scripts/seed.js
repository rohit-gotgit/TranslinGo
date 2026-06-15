import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/auth.models.js";
import Message from "../models/messages.models.js";
import Channel from "../models/channel.models.js";
import { DB_NAME } from "../constants.js";

dotenv.config();

// Common password for all users
const COMMON_PASSWORD = "Password123";

// Sample users data (Indian names)
const usersData = [
    { email: "rahul.sharma@example.com", firstName: "Rahul", lastName: "Sharma", age: 28 },
    { email: "priya.patel@example.com", firstName: "Priya", lastName: "Patel", age: 26 },
    { email: "arjun.kumar@example.com", firstName: "Arjun", lastName: "Kumar", age: 32 },
    { email: "ananya.singh@example.com", firstName: "Ananya", lastName: "Singh", age: 24 },
    { email: "vikram.reddy@example.com", firstName: "Vikram", lastName: "Reddy", age: 30 },
    { email: "kavya.nair@example.com", firstName: "Kavya", lastName: "Nair", age: 27 },
    { email: "aditya.gupta@example.com", firstName: "Aditya", lastName: "Gupta", age: 29 },
    { email: "meera.desai@example.com", firstName: "Meera", lastName: "Desai", age: 25 },
    { email: "rohan.jain@example.com", firstName: "Rohan", lastName: "Jain", age: 31 },
    { email: "sneha.mishra@example.com", firstName: "Sneha", lastName: "Mishra", age: 23 },
    { email: "aman.tiwari@example.com", firstName: "Aman", lastName: "Tiwari", age: 33 },
    { email: "divya.iyer@example.com", firstName: "Divya", lastName: "Iyer", age: 26 }
];

// Sample conversation starters
const conversationStarters = [
    "Hey! How are you doing?",
    "Hi there! What's up?",
    "Hello! Long time no see!",
    "Hey! How's everything going?",
    "Hi! Hope you're doing well!",
    "Hey there! How have you been?",
    "Hello! Nice to hear from you!",
    "Hi! What's new with you?",
    "Hey! How's your day going?",
    "Hello! Hope you're having a great day!"
];

// Sample follow-up messages
const followUpMessages = [
    "That sounds great!",
    "I totally agree with you.",
    "That's interesting! Tell me more.",
    "I see what you mean.",
    "That makes sense.",
    "I'm glad to hear that!",
    "That's awesome!",
    "I understand how you feel.",
    "That's really cool!",
    "I'm happy for you!",
    "That's a good point.",
    "I think so too!",
    "That's exactly what I was thinking.",
    "I couldn't agree more!",
    "That's wonderful news!",
    "I'm so excited about that!",
    "That sounds like a plan!",
    "I'm looking forward to it!",
    "That's fantastic!",
    "I'm really happy about that!"
];

// Sample longer messages
const longerMessages = [
    "I've been working on this new project and it's been really exciting! The team is great and we're making good progress.",
    "Just finished watching an amazing movie last night. The plot was incredible and the acting was top-notch!",
    "Planning a trip next month. Still deciding between the mountains or the beach. What do you think?",
    "Had a great weekend! Went hiking with some friends. The weather was perfect for it.",
    "Working on learning a new programming language. It's challenging but really rewarding!",
    "Just tried this new restaurant downtown. The food was absolutely delicious! You should check it out.",
    "Been reading this really interesting book lately. It's about technology and its impact on society.",
    "Attended a virtual conference yesterday. Learned a lot of new things about web development.",
    "Working on a side project in my free time. It's coming along nicely!",
    "Just got back from a vacation. It was so relaxing and exactly what I needed!"
];

// Sample channel names
const channelNames = [
    "General Discussion",
    "Tech Talk",
    "Random Chat",
    "Project Team",
    "Book Club",
    "Movie Night",
    "Food Lovers",
    "Travel Enthusiasts",
    "Music Share",
    "Gaming Zone"
];

// Sample channel messages
const channelMessages = [
    "Hey everyone! How's it going?",
    "Good morning team! Hope everyone has a great day!",
    "Anyone up for a quick chat?",
    "Just wanted to share something interesting I found today.",
    "Thanks for all the help with the project!",
    "Great work everyone on the latest update!",
    "Does anyone have any questions about the new feature?",
    "Let's schedule a meeting for next week.",
    "I think we should discuss this in more detail.",
    "That's a great idea! Let's implement it.",
    "Can someone help me with this?",
    "I'll take care of that task.",
    "Thanks for the update!",
    "Looking forward to the next meeting!",
    "Great job on the presentation!"
];

// Function to get random date within the past month
function getRandomDateInPastMonth() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
    return new Date(randomTime);
}

// Function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to get random items from array
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Main seed function
async function seedDatabase() {
    try {
        // Connect to database
        console.log("Connecting to database...");
        
        // Clean the connection string - remove database name if present
        let connectionString = process.env.MONGODB_URI.trim();
        
        // Remove trailing slash
        if (connectionString.endsWith('/')) {
            connectionString = connectionString.slice(0, -1);
        }
        
        // Remove database name from URI if it exists (we'll specify it in options)
        // Pattern: mongodb://host:port/dbname or mongodb+srv://user:pass@host/dbname?options
        const lastSlashIndex = connectionString.lastIndexOf('/');
        const protocolIndex = connectionString.indexOf('://');
        const queryIndex = connectionString.indexOf('?');
        
        if (lastSlashIndex > protocolIndex + 2) {
            // Extract the part after the last slash
            const endIndex = queryIndex > lastSlashIndex ? queryIndex : connectionString.length;
            const pathAfterSlash = connectionString.substring(lastSlashIndex + 1, endIndex);
            
            // Check if it's a database name (not empty, not part of host/credentials)
            if (pathAfterSlash && !pathAfterSlash.includes('@') && pathAfterSlash.length > 0) {
                // Remove the database name from URI, keep query params if they exist
                const beforeSlash = connectionString.substring(0, lastSlashIndex);
                const afterQuery = queryIndex > lastSlashIndex ? connectionString.substring(queryIndex) : '';
                connectionString = beforeSlash + afterQuery;
            }
        }
        
        // Connect with database name in options (cleaner approach)
        await mongoose.connect(connectionString, {
            dbName: DB_NAME
        });
        console.log("Database connected successfully!");

        // Clear existing data
        console.log("\nClearing existing data...");
        await User.deleteMany({});
        await Message.deleteMany({});
        await Channel.deleteMany({});
        console.log("Existing data cleared!");

        // Create users
        console.log("\nCreating users...");
        const users = [];
        for (const userData of usersData) {
            const user = new User({
                ...userData,
                password: COMMON_PASSWORD
            });
            await user.save();
            users.push(user);
            console.log(`Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`);
        }
        console.log(`\nCreated ${users.length} users!`);

        // Create direct messages between users (over the past month)
        console.log("\nCreating direct messages...");
        let messageCount = 0;

        // Create conversations between pairs of users (not all pairs, to make it more realistic)
        // Each user will have conversations with 3-5 other users
        for (let i = 0; i < users.length; i++) {
            const user1 = users[i];
            // Select 3-5 random other users to have conversations with
            const conversationPartners = getRandomItems(
                users.filter((_, index) => index !== i),
                Math.floor(Math.random() * 3) + 3
            );

            for (const user2 of conversationPartners) {
                // Skip if we've already created this conversation pair
                if (i > users.indexOf(user2)) continue;

                // Create 4-10 messages per conversation pair
                const messageCountForPair = Math.floor(Math.random() * 7) + 4;
                const conversationStartDate = getRandomDateInPastMonth();

                for (let k = 0; k < messageCountForPair; k++) {
                    // Spread messages over time (not all on same day)
                    const daysOffset = Math.floor(k / 2); // Every 2 messages = 1 day
                    const hoursOffset = (k % 2) * 6; // Messages 6 hours apart
                    const randomMinutes = Math.floor(Math.random() * 60);
                    
                    const timestamp = new Date(
                        conversationStartDate.getTime() + 
                        daysOffset * 24 * 60 * 60 * 1000 + 
                        hoursOffset * 60 * 60 * 1000 +
                        randomMinutes * 60 * 1000
                    );
                    
                    // Alternate between users
                    const sender = k % 2 === 0 ? user1 : user2;
                    const recipient = k % 2 === 0 ? user2 : user1;

                    let content;
                    if (k === 0) {
                        // First message
                        content = getRandomItem(conversationStarters);
                    } else if (k === messageCountForPair - 1) {
                        // Last message
                        content = getRandomItem(followUpMessages);
                    } else if (Math.random() > 0.7) {
                        // 30% chance of longer message
                        content = getRandomItem(longerMessages);
                    } else {
                        // Regular follow-up
                        content = getRandomItem(followUpMessages);
                    }

                    const message = new Message({
                        sender: sender._id,
                        recipient: recipient._id,
                        messageType: "text",
                        content: content,
                        timestamp: timestamp
                    });

                    await message.save();
                    messageCount++;
                }
            }
        }
        console.log(`Created ${messageCount} direct messages!`);

        // Create channels with messages
        console.log("\nCreating channels...");
        const channels = [];
        const channelCount = 5; // Create 5 channels

        for (let i = 0; i < channelCount; i++) {
            // Select random admin
            const admin = getRandomItem(users);
            
            // Select 4-7 random members (including admin)
            const memberCount = Math.floor(Math.random() * 4) + 4;
            const members = getRandomItems(users, memberCount);
            
            // Ensure admin is in members
            if (!members.find(m => m._id.toString() === admin._id.toString())) {
                members[0] = admin;
            }

            const channel = new Channel({
                name: channelNames[i] || `Channel ${i + 1}`,
                members: members.map(m => m._id),
                admin: admin._id,
                messages: [],
                createdAt: getRandomDateInPastMonth(),
                updatedAt: new Date()
            });

            await channel.save();
            channels.push(channel);
            console.log(`Created channel: ${channel.name} with ${members.length} members`);

            // Create messages in channel (15-25 messages per channel)
            const channelMessageCount = Math.floor(Math.random() * 11) + 15;
            const channelStartDate = channel.createdAt;

            for (let j = 0; j < channelMessageCount; j++) {
                // Spread messages over time (every 1-3 days)
                const daysOffset = Math.floor(j / 3); // Every 3 messages = 1 day
                const hoursOffset = (j % 3) * 8; // Messages 8 hours apart
                const randomMinutes = Math.floor(Math.random() * 60);
                
                const timestamp = new Date(
                    channelStartDate.getTime() + 
                    daysOffset * 24 * 60 * 60 * 1000 + 
                    hoursOffset * 60 * 60 * 1000 +
                    randomMinutes * 60 * 1000
                );
                
                // Random member sends message
                const sender = getRandomItem(members);
                const content = getRandomItem(channelMessages);

                const message = new Message({
                    sender: sender._id,
                    recipient: null, // null for channel messages
                    messageType: "text",
                    content: content,
                    timestamp: timestamp
                });

                await message.save();
                channel.messages.push(message._id);
                messageCount++;
            }

            // Update channel with messages
            channel.updatedAt = new Date();
            await channel.save();
        }
        console.log(`Created ${channels.length} channels with messages!`);

        // Add some file messages (10% of total messages)
        console.log("\nAdding file messages...");
        const fileMessageCount = Math.floor(messageCount * 0.1);
        const allMessages = await Message.find({ messageType: "text" }).limit(fileMessageCount);

        for (const message of allMessages) {
            message.messageType = "file";
            message.content = undefined;
            message.fileUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
            await message.save();
        }
        console.log(`Converted ${fileMessageCount} messages to file messages!`);

        // Summary
        console.log("\n" + "=".repeat(50));
        console.log("SEEDING COMPLETE!");
        console.log("=".repeat(50));
        console.log(`Total Users: ${users.length}`);
        console.log(`Total Messages: ${messageCount}`);
        console.log(`Total Channels: ${channels.length}`);
        console.log(`Common Password: ${COMMON_PASSWORD}`);
        console.log("=".repeat(50));
        console.log("\nYou can now login with any user email and password: " + COMMON_PASSWORD);

    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log("\nDatabase connection closed.");
    }
}

// Run seed function
seedDatabase()
    .then(() => {
        console.log("\n✅ Seeding completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error during seeding:", error);
        process.exit(1);
    });
