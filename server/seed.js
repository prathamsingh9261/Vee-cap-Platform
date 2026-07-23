require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Course = require("./models/Course");

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

const benefits = `Course Benefits — Why Choose VeeCap:\n• 100% Practical Learning\n• Live Project Experience\n• Portfolio Building\n• Job Assistance\n• Internship & Placement Support`;

const bestFor = `Best For:\nStudents after 10th & 12th, College Students, Graduates, Working Professionals, Entrepreneurs, Housewives looking to restart careers, and Freelancers.\n\nNo prior experience required. Admission Open!`;

async function seed() {
  await connectDB();
  console.log("Seeding database...");
  await Promise.all([User.deleteMany({}), Course.deleteMany({})]);

  const admin = await User.create({
    name: "VeeCap Admin",
    email: "admin@veecapclasses.com",
    password: "Admin@123",
    role: "admin",
  });

  const instructor = await User.create({
    name: "VeeCap Classes",
    email: "instructor@veecapclasses.com",
    password: "Instructor@123",
    role: "instructor",
    bio: "VEECAP CLASSES is a leading skill development institute in Jodhpur offering industry-focused practical training.",
  });

  const courses = [
    // ─── LONG COURSES ───────────────────────────────────────────
    {
      title: "Digital Marketing with AI",
      shortDescription: "Master Digital Marketing & build a career in the digital world with AI tools.",
      description: `Master Digital Marketing & Build a Career in the Digital World.\n\nWhat You Will Learn:\n• Keywords — what, when & how to use them\n• Content writing\n• Hosting & domain\n• WordPress\n• Google Analytics, Google Search Console, Google Tag Manager, Google AdSense\n• SEO — On Page, Off Page & Technical\n• Social Media — Instagram, Facebook, Snapchat, Twitter, YouTube, Pinterest, LinkedIn, Canva\n• Local SEO\n• Shopify\n• Performance Marketing\n• Affiliate Marketing, Drop-Shipping, Email Marketing\n• Freelancing\n• E-Commerce — Amazon, Flipkart, Meesho\n• AI Tools & Automation\n\n${benefits}\n• Live Campaign Experience\n• AI Tools & Automation\n• Hands-on Projects\n\n${bestFor}`,
      category: "Career",
      level: "Beginner",
      price: 19999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Digital Marketing Fundamentals", lessons: [{ title: "Introduction to Digital Marketing", duration: 15 }, { title: "Keywords — What, When & How", duration: 20 }, { title: "Content Writing Basics", duration: 25 }] },
        { title: "Website & SEO", lessons: [{ title: "Hosting & Domain Setup", duration: 20 }, { title: "WordPress Essentials", duration: 30 }, { title: "On Page SEO", duration: 25 }, { title: "Off Page & Technical SEO", duration: 25 }, { title: "Google Analytics & Search Console", duration: 20 }] },
        { title: "Social Media Marketing", lessons: [{ title: "Instagram & Facebook Marketing", duration: 25 }, { title: "YouTube & LinkedIn Strategy", duration: 20 }, { title: "Canva for Social Media", duration: 20 }, { title: "Local SEO", duration: 15 }] },
        { title: "E-Commerce & Monetization", lessons: [{ title: "Shopify Store Setup", duration: 25 }, { title: "Amazon, Flipkart & Meesho", duration: 20 }, { title: "Affiliate Marketing & Drop-Shipping", duration: 20 }, { title: "Email Marketing", duration: 15 }, { title: "Freelancing & AI Tools", duration: 20 }] },
      ],
    },
    {
      title: "Graphic Designing",
      shortDescription: "Master Graphic Designing & turn your passion into creativity with industry tools.",
      description: `Master Graphic Designing & Turn Your Passion Into Creativity.\n\nSoftware You Will Learn:\n• Adobe Photoshop\n• Adobe Illustrator\n• Adobe InDesign\n• CorelDRAW\n\nWhat You Will Learn:\n• Social media post design\n• Branding & logo design\n• Poster & banner design\n• Packaging design\n• Creative advertising\n• YouTube thumbnails\n\n${benefits}\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 24999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Adobe Photoshop", lessons: [{ title: "Photoshop Interface & Tools", duration: 20 }, { title: "Photo Editing & Retouching", duration: 25 }, { title: "Social Media Post Design", duration: 20 }] },
        { title: "Adobe Illustrator", lessons: [{ title: "Illustrator Basics & Vector Graphics", duration: 20 }, { title: "Logo & Branding Design", duration: 30 }, { title: "Poster & Banner Design", duration: 25 }] },
        { title: "CorelDRAW & Advanced Design", lessons: [{ title: "CorelDRAW Essentials", duration: 20 }, { title: "Packaging Design", duration: 25 }, { title: "YouTube Thumbnails & Creative Advertising", duration: 20 }, { title: "Portfolio Development", duration: 15 }] },
      ],
    },
    {
      title: "Video Editing",
      shortDescription: "Master Video Editing & turn your passion into creativity with professional tools.",
      description: `Master Video Editing & Turn Your Passion Into Creativity.\n\nSoftware You Will Learn:\n• Adobe Premiere Pro\n• Adobe After Effects\n\nWhat You Will Learn:\n• Creative video editing\n• Color grading\n• Motion graphics\n• Audio editing\n• VFX / CGI\n\n${benefits}\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 34999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1574717024453-354056aafa98?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Adobe Premiere Pro", lessons: [{ title: "Premiere Pro Interface & Setup", duration: 20 }, { title: "Creative Video Editing", duration: 30 }, { title: "Color Grading", duration: 25 }, { title: "Audio Editing", duration: 20 }] },
        { title: "Adobe After Effects", lessons: [{ title: "After Effects Basics", duration: 20 }, { title: "Motion Graphics", duration: 30 }, { title: "VFX & CGI Essentials", duration: 25 }, { title: "Final Project & Portfolio", duration: 20 }] },
      ],
    },
    {
      title: "Graphic Designing with Video Editing",
      shortDescription: "Master Graphic Designing with Video Editing (Basic) — creativity meets profession.",
      description: `Master Graphic Designing with Video Editing (Basic) & Turn Your Passion Into Creativity.\n\nSoftware You Will Learn:\n• CorelDRAW\n• Adobe Photoshop\n• Adobe Premiere Pro\n\nGraphic Designing:\n• Social media post design\n• Branding & logo design\n• Poster & banner design\n• Packaging design\n• Creative advertising\n• YouTube thumbnails\n\nVideo Editing:\n• Creative video editing\n• Color grading\n• Motion graphics\n• Audio editing\n\n${benefits}\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 64999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Graphic Designing Basics", lessons: [{ title: "CorelDRAW Essentials", duration: 20 }, { title: "Photoshop for Designers", duration: 25 }, { title: "Social Media Post & Logo Design", duration: 25 }, { title: "Poster, Banner & Packaging Design", duration: 20 }, { title: "YouTube Thumbnails", duration: 15 }] },
        { title: "Video Editing Basics", lessons: [{ title: "Premiere Pro Interface", duration: 20 }, { title: "Creative Video Editing", duration: 25 }, { title: "Color Grading & Audio Editing", duration: 20 }, { title: "Motion Graphics Intro", duration: 20 }, { title: "Final Portfolio Project", duration: 15 }] },
      ],
    },
    {
      title: "AutoCAD (Civil)",
      shortDescription: "Build a strong career in Civil Engineering & Construction with AutoCAD.",
      description: `Build a Strong Career in Civil Engineering & Construction.\n\nWhat You Will Learn:\n• Introduction to AutoCAD Interface\n• 2D Civil Engineering Drawings\n• Site Plans & Layouts\n• Building Plans & Elevations\n• Plotting & Printing Techniques\n• Layers, Dimensions & Annotation\n• Real Project Practice\n\nCourse Benefits:\n• Industry-Oriented Training\n• Hands-on Practice with Real Projects\n• Expert Guidance\n• Certificate on Completion\n• Career Opportunities in Construction & Design Industry\n\nBest For:\nCivil Engineering Students, Diploma Students, Architects & Designers, Construction Professionals, Anyone interested in Civil Design.\n\nNo prior experience required. Admission Open!`,
      category: "Developer",
      level: "Beginner",
      price: 14999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
      instructor: instructor._id,
      sections: [
        { title: "AutoCAD Fundamentals", lessons: [{ title: "AutoCAD Interface & Commands", duration: 20 }, { title: "2D Civil Engineering Drawings", duration: 30 }, { title: "Layers, Dimensions & Annotation", duration: 25 }] },
        { title: "Civil Design Projects", lessons: [{ title: "Site Plans & Layouts", duration: 25 }, { title: "Building Plans & Elevations", duration: 30 }, { title: "Plotting & Printing Techniques", duration: 20 }, { title: "Real Project Practice", duration: 30 }] },
      ],
    },
    {
      title: "AutoCAD (Handicraft)",
      shortDescription: "Explore the world of handicrafts & create beautiful handmade products with professional guidance.",
      description: `Explore the World of Handicrafts & Create Beautiful Handmade Products.\n\nThis course focuses on developing creativity, design skills, and entrepreneurial opportunities through the art of handicrafts.\n\nCourse Benefits:\n• Practical Hands-on Training\n• Creative Skill Development\n• Learn Trendy Craft Techniques\n• Opportunity to Start Your Own Business\n• Certificate on Completion\n\nBest For:\nStudents, Homemakers, Creative Enthusiasts, Entrepreneurs, Anyone passionate about arts and crafts.\n\nNo prior experience required. Admission Open!`,
      category: "Arts",
      level: "Beginner",
      price: 19999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Handicraft Foundations", lessons: [{ title: "Introduction to Handicrafts", duration: 20 }, { title: "Design Principles & Creativity", duration: 25 }, { title: "Materials & Tools", duration: 20 }] },
        { title: "Advanced Techniques & Business", lessons: [{ title: "Trendy Craft Techniques", duration: 30 }, { title: "Product Development", duration: 25 }, { title: "Starting Your Own Business", duration: 20 }, { title: "Portfolio & Certification", duration: 15 }] },
      ],
    },

    // ─── SHORT COURSES ───────────────────────────────────────────
    {
      title: "Social Media Marketing (SMM)",
      shortDescription: "Master the art of growing content! Learn social media strategy in just 15 days.",
      description: `Master the Art of Growing Content!\n\nWhat You Will Learn:\n• Social media strategy\n• Content planning & creation\n• Instagram & Facebook marketing\n• Paid advertising basics\n• Audience growth techniques\n• Analytics & performance tracking\n\nDuration: 15 days\n\n${bestFor}`,
      category: "Career",
      level: "Beginner",
      price: 8999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Social Media Strategy", lessons: [{ title: "Social Media Strategy Basics", duration: 15 }, { title: "Content Planning & Creation", duration: 20 }, { title: "Instagram & Facebook Marketing", duration: 20 }] },
        { title: "Growth & Analytics", lessons: [{ title: "Paid Advertising Basics", duration: 20 }, { title: "Audience Growth Techniques", duration: 15 }, { title: "Analytics & Performance Tracking", duration: 15 }] },
      ],
    },
    {
      title: "Canva",
      shortDescription: "Design stunning graphics without any prior experience — Canva from basic to advanced.",
      description: `Design Stunning Graphics Without Any Prior Experience. Learn Canva from Basic to Advanced.\n\nWhat You Will Learn:\n• Intro to Canva & the editor\n• Working with templates\n• Text mastery\n• Colors & branding\n• Elements & design principles\n• Uploading & editing images\n• Canva for posts, IG carousels, stories, reels & short videos\n• Presentations in Canva\n• Canva AI tools\n• Complete project guide\n\nDuration: 15 days\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Canva Basics", lessons: [{ title: "Intro to Canva & Editor", duration: 15 }, { title: "Working with Templates", duration: 15 }, { title: "Text Mastery & Colors", duration: 15 }, { title: "Elements & Image Editing", duration: 15 }] },
        { title: "Advanced Canva", lessons: [{ title: "Canva for Posts & Carousels", duration: 15 }, { title: "Canva for Stories & Reels", duration: 15 }, { title: "Presentations & AI Tools", duration: 15 }, { title: "Complete Project Guide", duration: 20 }] },
      ],
    },
    {
      title: "Filmora Video Editing",
      shortDescription: "Edit videos like a pro with Filmora — professional video editing in just 7 to 15 days!",
      description: `Edit Videos Like a Pro with Filmora. Learn Professional Video Editing Skills in Just a Few Days!\n\nWhat You Will Learn:\n• Video cutting & trimming\n• Transitions & effects\n• Text & titles\n• Coloring\n• Green screen basics\n• Masking & AI tools\n\nDuration: 7 days / 15 days\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 1499,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=800",
      instructor: instructor._id,
      sections: [
        { title: "Filmora Basics", lessons: [{ title: "Interface & Setup", duration: 15 }, { title: "Video Cutting & Trimming", duration: 15 }, { title: "Transitions & Effects", duration: 15 }] },
        { title: "Advanced Editing", lessons: [{ title: "Text, Titles & Coloring", duration: 15 }, { title: "Green Screen Basics", duration: 15 }, { title: "Masking & AI Tools", duration: 15 }] },
      ],
    },
    {
      title: "E-Commerce",
      shortDescription: "Start & grow your business online — learn to sell on Amazon, Flipkart & Meesho.",
      description: `Start & Grow Your Business Online. Learn the Fundamentals of Selling Products Online Through Marketplaces.\n\nWhat You Will Learn:\n• Introduction to e-commerce\n• Product listing & management\n• Marketplace selling\n• Payment gateways\n• Order & inventory management\n• Ads\n\nPlatforms You'll Learn:\n• Amazon\n• Flipkart\n• Meesho\n\nDuration: 1 month\n\n${bestFor}`,
      category: "Business",
      level: "Beginner",
      price: 9999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      instructor: instructor._id,
      sections: [
        { title: "E-Commerce Fundamentals", lessons: [{ title: "Introduction to E-Commerce", duration: 20 }, { title: "Product Listing & Management", duration: 20 }, { title: "Payment Gateways", duration: 15 }] },
        { title: "Marketplace Selling", lessons: [{ title: "Selling on Amazon", duration: 20 }, { title: "Selling on Flipkart", duration: 20 }, { title: "Selling on Meesho", duration: 20 }, { title: "Order & Inventory Management", duration: 15 }, { title: "Running Ads", duration: 20 }] },
      ],
    },
    {
      title: "WordPress",
      shortDescription: "Create professional websites without coding — from setup to SEO in 1 month.",
      description: `Create Professional Websites Without Coding.\n\nWhat You Will Learn:\n• WordPress installation & setup\n• Themes & plugins\n• Website designing\n• Page builders\n• SEO basics\n• Website security & maintenance\n• AI tools for WordPress\n\nDuration: 1 month\n\n${bestFor}`,
      category: "Developer",
      level: "Beginner",
      price: 7999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
      instructor: instructor._id,
      sections: [
        { title: "WordPress Basics", lessons: [{ title: "WordPress Installation & Setup", duration: 20 }, { title: "Themes & Plugins", duration: 20 }, { title: "Website Designing & Page Builders", duration: 25 }] },
        { title: "Advanced WordPress", lessons: [{ title: "SEO Basics", duration: 20 }, { title: "Website Security & Maintenance", duration: 20 }, { title: "AI Tools for WordPress", duration: 15 }] },
      ],
    },
    {
      title: "AutoCAD Civil (Short Course)",
      shortDescription: "Learn professional civil drafting & design skills in just 1 month.",
      description: `Learn Professional Civil Drafting & Design Skills. Gain Practical Knowledge of AutoCAD Used in Construction & Civil Engineering Projects.\n\nWhat You Will Learn:\n• AutoCAD interface & commands\n• 2D civil drawing\n• Site plans & layouts\n• Building plans & elevation\n• Dimensioning & annotation\n\nDuration: 1 month\n\nBest For:\nCivil Engineering Students, Diploma Students, Architects & Designers, Construction Professionals, Anyone interested in Civil Design.\n\nNo prior experience required. Admission Open!`,
      category: "Developer",
      level: "Beginner",
      price: 4999,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
      instructor: instructor._id,
      sections: [
        { title: "AutoCAD Basics", lessons: [{ title: "Interface & Commands", duration: 20 }, { title: "2D Civil Drawing", duration: 25 }, { title: "Dimensioning & Annotation", duration: 20 }] },
        { title: "Civil Design", lessons: [{ title: "Site Plans & Layouts", duration: 25 }, { title: "Building Plans & Elevation", duration: 25 }] },
      ],
    },
    {
      title: "CapCut / VN Video Editing",
      shortDescription: "Learn mobile video editing using CapCut & VN — create viral reels & cinematic videos with ease.",
      description: `Learn Mobile Video Editing Using CapCut & VN to Produce Engaging Content for Social Media. Create Viral Reels & Cinematic Videos With Ease.\n\nWhat You Will Learn:\n• Basic & advanced editing\n• Reels & shorts creation\n• Transitions & effects\n• Text animation\n• Color grading\n• Trending editing styles\n• Audio & video synchronization\n\nDuration: 7 days / 14 days\n\n${bestFor}`,
      category: "Arts",
      level: "Beginner",
      price: 1499,
      currency: "inr",
      thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
      instructor: instructor._id,
      sections: [
        { title: "CapCut Basics", lessons: [{ title: "CapCut Interface & Basic Editing", duration: 15 }, { title: "Transitions, Effects & Text Animation", duration: 15 }, { title: "Reels & Shorts Creation", duration: 15 }] },
        { title: "Advanced & VN", lessons: [{ title: "Color Grading & Trending Styles", duration: 15 }, { title: "VN Editor Basics", duration: 15 }, { title: "Audio & Video Synchronization", duration: 15 }] },
      ],
    },
  ];

  for (const c of courses) {
    c.slug = slugify(c.title) + "-" + Date.now().toString().slice(-5);
    c.totalDurationMinutes = c.sections.reduce(
      (sum, s) => sum + s.lessons.reduce((s2, l) => s2 + l.duration, 0), 0
    );
    await new Promise((r) => setTimeout(r, 10));
  }

  await Course.insertMany(courses);
  console.log(`Seeded ${courses.length} courses successfully.`);
  console.log("Admin login:      admin@veecapclasses.com / Admin@123");
  console.log("Instructor login: instructor@veecapclasses.com / Instructor@123");
  mongoose.connection.close();
}

seed().catch((err) => { console.error(err); process.exit(1); });
