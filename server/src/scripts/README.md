# Database Seeding Script

This script populates the database with sample data for development and testing purposes.

## What It Creates

- **12 Users**: All with the same password for easy testing
- **Direct Messages**: Conversations between user pairs over the past month
- **5 Channels**: Group channels with multiple members and messages
- **File Messages**: Some messages converted to file type for variety

## Usage

### Prerequisites

1. Make sure your `.env` file is configured with:
   - `MONGODB_URI` - Your MongoDB connection string
   - Other required environment variables

2. Ensure MongoDB is running and accessible

### Run the Seed Script

```bash
npm run seed
```

Or directly:

```bash
node -r dotenv/config src/scripts/seed.js
```

## What Gets Created

### Users (12 total)
All users have the password: `Password123`

Sample users (Indian names):
- rahul.sharma@example.com
- priya.patel@example.com
- arjun.kumar@example.com
- ananya.singh@example.com
- vikram.reddy@example.com
- kavya.nair@example.com
- aditya.gupta@example.com
- meera.desai@example.com
- rohan.jain@example.com
- sneha.mishra@example.com
- aman.tiwari@example.com
- divya.iyer@example.com

### Direct Messages
- Multiple conversations between different user pairs
- Messages spread over the past month with realistic timestamps
- 3-8 messages per conversation pair
- Mix of conversation starters, follow-ups, and longer messages

### Channels
- 5 different channels with descriptive names
- Each channel has 4-7 members
- 10-20 messages per channel
- Messages spread over time since channel creation

### File Messages
- Approximately 10% of messages are file type
- Uses sample Cloudinary URLs

## Important Notes

⚠️ **Warning**: This script will **DELETE ALL EXISTING DATA** in the database before seeding!

- All existing users will be deleted
- All existing messages will be deleted
- All existing channels will be deleted

Use only in development or when you want to reset your database.

## Login Credentials

After running the seed script, you can login with any of the created user emails using the password:

```
Password: Password123
```

Example:
- Email: `alice.johnson@example.com`
- Password: `Password123`

## Customization

You can modify the seed script (`src/scripts/seed.js`) to:
- Change the number of users
- Adjust message counts
- Modify channel names
- Change the common password
- Add more realistic data

## Troubleshooting

### "Cannot connect to database"
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Verify network connectivity

### "Validation error"
- Check that all required fields are provided
- Ensure email format is valid
- Verify age is between 10-99

### "Duplicate key error"
- The script clears existing data first, so this shouldn't happen
- If it does, manually clear the database and try again
