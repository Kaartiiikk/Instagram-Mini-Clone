import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("Seeding extensive data...");

    // Create users - mix of influencers, regular users, and niche accounts
    const password = await bcrypt.hash("password", 10);

    const userConfigs = [
        { username: "john_doe", password, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
        { username: "jane_smith", password, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
        { username: "travel_addict", password, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
        { username: "foodie_gram", password, avatarUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop" },
        { username: "nature_lover", password, avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?w=150&h=150&fit=crop" },
        { username: "tech_guru", password, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" },
        { username: "fitness_freak", password, avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop" },
        { username: "art_gallery", password, avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop" },
        { username: "music_vibes", password, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
        { username: "pet_paradise", password, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" }
    ];

    const createdUsers = [];
    for (const u of userConfigs) {
        // Check if user exists first to avoid duplicates if seeded multiple times
        const existing = await storage.getUserByUsername(u.username);
        if (!existing) {
            // @ts-ignore
            const user = await storage.createUser(u);
            createdUsers.push(user);
            console.log(`Created user: ${user.username}`);
        } else {
            createdUsers.push(existing);
        }
    }

    // Extensive post data with categories
    const postsData = [
        // Travel - userIdx 2
        { userIdx: 2, url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", caption: "Switzerland mountains are breathtaking 🏔️ #travel #wanderlust" },
        { userIdx: 2, url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", caption: "Venice canals 🛶 #italy #travel" },
        { userIdx: 2, url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", caption: "Parisian streets 🥐 #france #paris" },
        { userIdx: 2, url: "https://images.unsplash.com/photo-1533105079780-92b9be482077", caption: "Santorini sunsets 🇬🇷 #greece" },

        // Food - userIdx 3
        { userIdx: 3, url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", caption: "Delicious pizza night! 🍕 #foodie #pizza" },
        { userIdx: 3, url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543", caption: "Healthy breakfast to start the day 🥑 #breakfast" },
        { userIdx: 3, url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87", caption: "Cocktails with friends 🍹 #nightout" },
        { userIdx: 3, url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e", caption: "Cake heaven 🍰 #dessert" },

        // Nature - userIdx 4
        { userIdx: 4, url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9", caption: "Beautiful sunset at the beach! 🌅 #nature #sunset" },
        { userIdx: 4, url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", caption: "Into the woods 🌲 #forest #nature" },
        { userIdx: 4, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", caption: "Morning mist 🌫️ #landscape" },
        { userIdx: 4, url: "https://images.unsplash.com/photo-1501854140884-074bf86ee91c", caption: "Mountain lake vibes ⛰️" },

        // Tech - userIdx 5
        { userIdx: 5, url: "https://images.unsplash.com/photo-1518770660439-4636190af475", caption: "New setup! 💻 #coding #setup" },
        { userIdx: 5, url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", caption: "Cyberpunk vibes 🤖 #tech" },

        // Art - userIdx 7
        { userIdx: 7, url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f", caption: "Museum day 🎨 #art" },
        { userIdx: 7, url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968", caption: "Street art in Berlin" },

        // Music - userIdx 8
        { userIdx: 8, url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d", caption: "Studio session 🎵 #music" },
        { userIdx: 8, url: "https://images.unsplash.com/photo-1514525253440-b393452e3726", caption: "Live concert energy! 🎸" },

        // Random User Posts (John & Jane)
        { userIdx: 0, url: "https://images.unsplash.com/photo-1517841905240-472988babdf9", caption: "Just me being me 😄 #selfie" },
        { userIdx: 0, url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce", caption: "Working on a new project 🚀 #hustle" },
        { userIdx: 1, url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", caption: "Feeling cute today 💖" },
        { userIdx: 1, url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937", caption: "Coffee time ☕ #coffee" },
    ];

    const createdPosts = [];
    for (const p of postsData) {
        const post = await storage.createPost(createdUsers[p.userIdx].id, { imageUrl: p.url, caption: p.caption });
        createdPosts.push(post);
    }

    // Create extensive follows (Mutual connections)
    // Everyone follows travel_addict (idx 2) and foodie_gram (idx 3)
    for (let i = 0; i < createdUsers.length; i++) {
        if (i !== 2) await storage.follow(createdUsers[i].id, createdUsers[2].id);
        if (i !== 3) await storage.follow(createdUsers[i].id, createdUsers[3].id);
    }

    // John (0) follows Jane (1), Tech (5), Nature (4)
    await storage.follow(createdUsers[0].id, createdUsers[1].id);
    await storage.follow(createdUsers[0].id, createdUsers[5].id);
    await storage.follow(createdUsers[0].id, createdUsers[4].id);

    // Jane (1) follows John (0), Art (7), Music (8)
    await storage.follow(createdUsers[1].id, createdUsers[0].id);
    await storage.follow(createdUsers[1].id, createdUsers[7].id);
    await storage.follow(createdUsers[1].id, createdUsers[8].id);

    // Random likes and comments
    for (const post of createdPosts) {
        // 3-8 random likes per post
        const numLikes = Math.floor(Math.random() * 6) + 3;
        const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());

        for (let i = 0; i < numLikes; i++) {
            if (shuffledUsers[i]) {
                await storage.likePost(shuffledUsers[i].id, post.id);
            }
        }

        // 1-3 random comments per post
        const comments = [
            "Amazing shot! 📸",
            "Love this! ❤️",
            "Where is this?",
            "So cool!",
            "Goals 😍",
            "Wow!",
            "Lookin good!",
            "I need to go there!",
            "Yummy 😋"
        ];

        const numComments = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numComments; i++) {
            if (shuffledUsers[i]) {
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                await storage.createComment(shuffledUsers[i].id, post.id, { text: randomComment });
            }
        }
    }

    console.log("Extensive seeding complete! Created " + createdUsers.length + " users and " + createdPosts.length + " posts.");
}



export { seed };
