# 🌱 Quick Start: Seed Mock Data

## One Command to Generate 20+ Test Data!

### Step 1: Seed the Database

```bash
cd api
npm run seed
```

This creates:
- ✅ **10 Users** (5 agents + 5 regular users)
- ✅ **25 Properties** with proper `agentId` references
- ✅ **30 Reviews** with `userId` references
- ✅ **40 Favorites**

### Step 2: Login and Test!

**All passwords:** `password123`

#### 👨‍💼 Agent Accounts:
```
john@agent.com
sarah@realtor.com
mike@properties.com
emma@homes.com
david@estates.com
```

#### 👤 Regular Users:
```
alice@buyer.com
bob@renter.com
charlie@investor.com
diana@seeker.com
evan@client.com
```

---

## 🧹 Clear All Data

```bash
npm run clear
```

---

## 🔄 Reset and Reseed

```bash
npm run clear && npm run seed
```

---

## 📊 What Gets Created

### For Each Agent (e.g., John):
- 5 Property Listings
- Each listing has `agentId = John's _id`
- Reviews on those properties
- Professional profile info

### For Each User (e.g., Alice):
- User account
- Multiple favorites (8 per user)
- Reviews on various properties
- Each review has `userId = Alice's _id`

---

## 🧪 Test Scenarios

### Scenario 1: Agent Views Their Properties
```
1. Login: john@agent.com / password123
2. Go to: My Properties
3. Result: Should see 5 listings (only John's)
```

### Scenario 2: User Becomes Agent
```
1. Login: alice@buyer.com / password123
2. Click: "Make Me Agent"
3. Add a new property
4. Go to: My Properties
5. Result: Should see the new listing
```

### Scenario 3: Filter Reviews by User
```
1. Login: alice@buyer.com / password123
2. Go to: My Reviews
3. Result: Should see 6 reviews written by Alice
```

---

## 🎯 Expected Results

| Endpoint | Expected Count |
|----------|---------------|
| `GET /api/listing/agent/:agentId` | 5 per agent |
| `GET /api/review/user/:userId` | 6 per user |
| `GET /api/favorites/user/:userId` | 8 per user |

---

## 💡 Pro Tip

After seeding, you can:
1. Login as an agent to see their listings
2. Add more properties as that agent
3. Login as another agent - won't see the first agent's properties!
4. This proves your filtering works! ✅

---

## ❓ Troubleshooting

**Error: MongoDB not connected**
```bash
# Make sure MongoDB is running
# Check your .env file has MONGO_URI
```

**Error: Port already in use**
```bash
# Stop your server first
# Then run npm run seed
```

**Want fresh data?**
```bash
# Clear and reseed
npm run clear && npm run seed
```

---

## 📚 Full Documentation

For detailed info, see: `MOCK_DATA_GUIDE.md`

**Ready to test? Run `npm run seed` now! 🚀**

