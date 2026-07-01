const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, ShadingType, PageBreak, convertInchesToTwip, BorderStyle,
  Table, TableRow, TableCell, WidthType, VerticalAlign,
} = require('docx');
const fs = require('fs');

/* ── helpers ──────────────────────────────────────────────────────── */
const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 440, after: 220 },
});
const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 320, after: 160 },
});
const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
});
const p = (text) => new Paragraph({
  children: [new TextRun({ text, size: 24, font: 'Calibri' })],
  spacing: { after: 180 }, alignment: AlignmentType.JUSTIFIED,
});
const bullet = (text, level = 0) => new Paragraph({
  children: [new TextRun({ text, size: 24, font: 'Calibri' })],
  bullet: { level }, spacing: { after: 110 },
});
const br = () => new Paragraph({ text: '', spacing: { after: 80 } });
const pb = () => new Paragraph({ children: [new PageBreak()] });
const tip = (text) => new Paragraph({
  children: [new TextRun({ text: `💡 Tip: ${text}`, size: 22, font: 'Calibri', italics: true, color: '1d4ed8' })],
  spacing: { before: 100, after: 120 }, indent: { left: convertInchesToTwip(0.3) },
});
const note = (text) => new Paragraph({
  children: [new TextRun({ text: `📌 Note: ${text}`, size: 22, font: 'Calibri', italics: true, color: '059669' })],
  spacing: { before: 100, after: 120 }, indent: { left: convertInchesToTwip(0.3) },
});
const code = (text) => new Paragraph({
  children: [new TextRun({ text, font: 'Courier New', size: 20, color: '374151' })],
  spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.4) },
  shading: { type: ShadingType.SOLID, color: 'f3f4f6', fill: 'f3f4f6' },
});
const center = (text, size = 24, bold = false, color = '0f172a') => new Paragraph({
  children: [new TextRun({ text, size, font: 'Calibri', bold, color })],
  alignment: AlignmentType.CENTER, spacing: { after: 200 },
});
const bold = (label, body) => new Paragraph({
  children: [
    new TextRun({ text: label + ': ', size: 24, font: 'Calibri', bold: true }),
    new TextRun({ text: body, size: 24, font: 'Calibri' }),
  ],
  spacing: { after: 140 }, alignment: AlignmentType.JUSTIFIED,
});

function twoColTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([left, right]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: left, font: 'Calibri', size: 22, bold: true })] })],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: right, font: 'Calibri', size: 22 })] })],
        }),
      ],
    })),
  });
}

/* ── document ─────────────────────────────────────────────────────── */
const doc = new Document({
  title: 'ETOH Market — Complete Project Documentation',
  description: 'Full technical and plain-English documentation of the ETOH Market platform.',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 24 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 40, color: '92400e', font: 'Calibri' },
        paragraph: {
          spacing: { before: 440, after: 220 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: 'f59e0b', space: 4 } },
        },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 30, color: '1d4ed8', font: 'Calibri' },
        paragraph: { spacing: { before: 300, after: 160 } },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 26, color: '059669', font: 'Calibri' },
        paragraph: { spacing: { before: 220, after: 110 } },
      },
    ],
  },
  sections: [{
    properties: {
      page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.25), right: convertInchesToTwip(1.25) } },
    },
    children: [

      /* ═══════════════════════════════════════════════════════════════
         COVER PAGE
      ════════════════════════════════════════════════════════════════ */
      br(), br(), br(),
      center('🛒', 96, false, 'f59e0b'),
      center('ETOH MARKET', 80, true, '92400e'),
      center('The Digital Central Market of Cameroon', 36, false, '64748b'),
      br(),
      center('─────────────────────────────────────', 20, false, 'd1d5db'),
      br(),
      center('COMPLETE PROJECT DOCUMENTATION', 30, true, '374151'),
      center('Written in plain English — so anyone can understand it', 24, false, '94a3b8'),
      br(),
      center('Version 1.0   |   June 2026', 22, false, '94a3b8'),
      br(), br(), br(),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         TABLE OF CONTENTS
      ════════════════════════════════════════════════════════════════ */
      h1('Table of Contents'),
      bullet('Chapter 1 — What Is ETOH Market?'),
      bullet('Chapter 2 — The Big Problem We Are Solving'),
      bullet('Chapter 3 — How the Project Is Organised (Architecture)'),
      bullet('Chapter 4 — The Database: Where Everything Is Stored'),
      bullet('Chapter 5 — The Backend: The Kitchen That Does All the Work'),
      bullet('  5.1  Authentication (Login & Registration)'),
      bullet('  5.2  Stands (Vendor Shops)'),
      bullet('  5.3  Products'),
      bullet('  5.4  Orders (Delivery Requests)'),
      bullet('  5.5  Market Buzz Posts (Reels)'),
      bullet('  5.6  Community Price Board (Prix du Marché)'),
      bullet('  5.7  Je Cherche (Buyer Wanted Board)'),
      bullet('  5.8  AI Chat Assistant'),
      bullet('  5.9  Admin Panel API'),
      bullet('Chapter 6 — The Frontend: Everything the User Sees'),
      bullet('  6.1  App Structure and Navigation'),
      bullet('  6.2  The Homepage'),
      bullet('  6.3  Product Detail Page'),
      bullet('  6.4  Stand Detail Page'),
      bullet('  6.5  Market Buzz (Video Reels)'),
      bullet('  6.6  Prix du Marché (Community Price Board)'),
      bullet('  6.7  Je Cherche (Buyer Wanted Board)'),
      bullet('  6.8  Login and Register Pages'),
      bullet('  6.9  Profile Page'),
      bullet('  6.10 Admin Panel'),
      bullet('Chapter 7 — Special Components Explained'),
      bullet('  7.1  Safety Gate'),
      bullet('  7.2  Bargain Calculator'),
      bullet('  7.3  Bendskin Delivery Button'),
      bullet('  7.4  Voice Recorder'),
      bullet('  7.5  AI Chat Widget'),
      bullet('  7.6  Availability Badge'),
      bullet('  7.7  Trusted Vendor Badge'),
      bullet('  7.8  WhatsApp Button'),
      bullet('Chapter 8 — Security and Authentication Explained Simply'),
      bullet('Chapter 9 — The Language System (English and French)'),
      bullet('Chapter 10 — How to Run the Project on Your Computer'),
      bullet('Chapter 11 — The Full API Reference'),
      bullet('Chapter 12 — Technologies Used and Why Each Was Chosen'),
      bullet('Chapter 13 — Testing'),
      bullet('Chapter 14 — Design Philosophy'),
      bullet('Chapter 15 — Future Plans'),
      bullet('Final Words'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 1
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 1 — What Is ETOH Market?'),

      p('Imagine you are in Douala, Cameroon. You want to buy a brand-new pair of shoes. What do you normally do? You get dressed, take a taxi, walk through Marché Central in the heat, go from stall to stall, hear a different price from every vendor, try to remember which one had the best offer, go back, negotiate, pay, and finally come home two hours later — tired and possibly still not sure you got a fair deal.'),
      br(),
      p('ETOH Market changes all of that. It is a website — a digital marketplace — where Cameroonian vendors put their products online and buyers anywhere in Cameroon can find them, see the real price, and contact the seller directly on WhatsApp. No travel, no heat, no time wasted.'),
      br(),
      p('Think of it as a virtual Marché Central that you can visit from your phone in 30 seconds.'),
      br(),
      h2('The Name "ETOH"'),
      p('The name ETOH comes from the concept of the central marketplace in Cameroonian culture — the great hub where everyone meets to trade, connect, and do business. In Ewondo, "etoh" means abundance, the gathering place. Just like the physical central market is the heartbeat of a Cameroonian city, ETOH Market aims to be the heartbeat of Cameroonian digital commerce.'),
      br(),
      h2('Who Is ETOH Market For?'),
      bullet('Vendors (sellers): Anyone who has something to sell — food, clothing, electronics, furniture, beauty products, crafts — and wants to reach more buyers without renting a shop.'),
      bullet('Buyers: Anyone who wants to find products quickly, compare prices, and contact sellers safely without walking through the market.'),
      bullet('The Community: Anyone in Cameroon who wants to share today\'s market prices so that everyone is informed and no one gets cheated.'),
      br(),
      h2('What Can You Do on ETOH Market?'),
      bullet('Browse products from local Cameroonian vendors, filtered by city, category, or search term.'),
      bullet('Open a free virtual "stand" (shop) and list your products with photos, videos, and voice descriptions.'),
      bullet('Contact any vendor instantly via WhatsApp — the app everyone already uses.'),
      bullet('Negotiate prices using the built-in Bargain Calculator (10%, 20%, or 30% off).'),
      bullet('Arrange home delivery via a bendskin (moto-taxi) rider with a pre-written WhatsApp message.'),
      bullet('Place a formal delivery order with your full address and a request for the vendor to contact you.'),
      bullet('Watch short market videos (Market Buzz Reels) — like TikTok, but for Cameroonian market vendors.'),
      bullet('Check today\'s community-submitted prices for 12 common staples (Prix du Marché).'),
      bullet('Post what you\'re looking for so vendors can come to you (Je Cherche).'),
      bullet('Chat with an AI assistant (powered by Google Gemini) for market advice, recipes, and price guidance.'),
      bullet('Switch the entire website between English and French with one click.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 2
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 2 — The Big Problem We Are Solving'),

      p('Every feature on ETOH Market was designed to solve a specific problem that real Cameroonians face every day. This chapter explains each problem and exactly how we solved it.'),
      br(),

      h2('Problem 1: Buyers waste too much time'),
      p('Going to a physical market takes time, transport money, and energy. You might visit 15 stalls before finding what you need — and still not be sure the price is fair.'),
      br(),
      bold('Our Solution', 'A searchable digital catalogue. Every product is listed online. Buyers filter by city, category, or search by name. All in seconds, from any phone.'),
      br(),

      h2('Problem 2: Sellers cannot reach enough buyers'),
      p('A vendor in Bamenda might have excellent dried fish, but a buyer in Douala will never know about her unless they personally travel there. Small vendors cannot afford Google Ads, a Facebook page, or a website.'),
      br(),
      bold('Our Solution', 'Every vendor gets a free Stand (their own page) on ETOH Market. They list their products once, and any buyer in Cameroon can find them through a simple search.'),
      br(),

      h2('Problem 3: Nobody trusts online strangers'),
      p('Mobile money scams are a real and frequent problem in Cameroon. A scammer pretends to be a vendor, takes your money, and disappears. Buyers are right to be suspicious.'),
      br(),
      bold('Our Solution', 'Three layers of trust protection: (1) A Safety Gate that shows important safety rules before revealing any vendor\'s phone number — the buyer must check a box confirming they read and understood the rules. (2) A Trusted Vendor Badge (lion symbol) that the admin awards to verified vendors. (3) WhatsApp-first contact — money never passes through ETOH Market, so there is nothing to steal.'),
      br(),

      h2('Problem 4: Prices are hidden and unfair'),
      p('In Cameroonian markets, prices are rarely written down. The same product might cost one price to a local and double to an outsider. Buyers have no reference point.'),
      br(),
      bold('Our Solution', 'Two price tools: (1) The Bargain Calculator shows buyers a realistic negotiation range automatically calculated from the listed price. (2) The Prix du Marché community board shows min, average, and max prices for 12 staples based on what buyers actually paid today across different cities.'),
      br(),

      h2('Problem 5: Last-mile delivery is hard to arrange'),
      p('Even when a buyer finds the right product online, getting it delivered to their home in Cameroon is another challenge entirely. They have to figure out delivery logistics themselves.'),
      br(),
      bold('Our Solution', 'The Bendskin Delivery Button. With one tap, a pre-filled WhatsApp message is generated with the product name, vendor location, price, and the buyer\'s delivery address — ready to send to the buyer\'s regular bendskin (moto-taxi) rider.'),
      br(),

      h2('Problem 6: "I know what I want but can\'t find it"'),
      p('Sometimes a buyer needs something very specific — like "20 kg of fresh groundnuts, raw, before Thursday in Douala." Posting in 5 WhatsApp groups and waiting for a response is slow and unreliable.'),
      br(),
      bold('Our Solution', 'Je Cherche (I\'m Looking For) — a reverse marketplace board where buyers post their needs. Vendors browse the board and contact the buyer directly on WhatsApp. Posts expire automatically after 7 days.'),
      br(),

      h2('Problem 7: You never know if the seller is available'),
      p('You find a great product, send a WhatsApp message, and wait. The vendor is at the farm. Or away on business. Or just closed for the day. You wasted your time and now feel frustrated.'),
      br(),
      bold('Our Solution', 'The Stand Availability Status. Every vendor can set their real-time status: Open Now (green), Back Soon (yellow), or Closed (red). This is shown on their stand page and on every product card from that vendor.'),
      br(),

      h2('Problem 8: Vendors have no way to showcase their products visually'),
      p('A text description of a dress or a food dish is not very convincing. Buyers want to see and hear. Vendors without a YouTube channel or TikTok account have no way to share video demonstrations.'),
      br(),
      bold('Our Solution', 'Products can have a photo, a short video, AND a voice note (recorded directly in the browser using the microphone). The Market Buzz page is a TikTok-style scrollable video feed where vendors post short product demonstration clips.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 3
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 3 — How the Project Is Organised (Architecture)'),

      p('ETOH Market is built using a classic "client-server" architecture. This is a very common way to build web applications. Think of it like a restaurant:'),
      br(),
      bullet('The customer (you on your phone) = the Frontend'),
      bullet('The waiter = the API (the messenger between customer and kitchen)'),
      bullet('The kitchen = the Backend'),
      bullet('The pantry / fridge = the Database'),
      br(),
      p('The customer gives their order to the waiter. The waiter takes it to the kitchen. The kitchen prepares the food using ingredients from the pantry. The waiter brings it back. The customer eats.'),
      br(),
      p('On ETOH Market, when you click "View Products", your browser (frontend) sends a request to the server (backend). The backend queries the database, gets all the products, and sends them back to the browser, which displays them as nice cards on the screen.'),
      br(),

      h2('Part 1: The Frontend (React + Vite)'),
      p('The frontend is everything you see and interact with. It lives inside the "client" folder. It is written in JavaScript using React, a popular library for building interactive websites. React lets us break the UI into small reusable "components" — like lego bricks. One component is a product card. Another is the navbar. Another is the chat widget. These components snap together to make full pages.'),
      br(),
      p('Vite is the tool that "compiles" the React code into regular HTML, CSS, and JavaScript that any browser can understand. It also runs a local development server so you can see your changes instantly while coding.'),
      br(),

      h2('Part 2: The Backend (Node.js + Express)'),
      p('The backend is the brain of the application. It runs on a server (or your computer during development) and listens for requests from the browser. It is written in Node.js (JavaScript running on the server) and uses Express.js (a tool that makes creating route handlers very simple).'),
      br(),
      p('The backend handles: login/registration, saving products, creating stands, handling orders, managing files (images, videos, audio), calling the AI service, and serving the compiled frontend files to the browser.'),
      br(),

      h2('Part 3: The Database (SQLite)'),
      p('The database is where all data is permanently stored. We use SQLite — a simple, file-based database. All the data lives in a single file called "etoh.db" inside the project folder. There is no separate database server to install or configure. This makes it perfect for a project of this size and complexity. If the project grows very large, it can be migrated to PostgreSQL with relatively minor changes.'),
      br(),

      h2('How They Connect'),
      p('When you deploy the project, the backend builds and serves the frontend files. Both run on the same server at port 3000. The frontend makes API calls to the backend at paths like /api/products. The backend queries the database, formats the response as JSON, and sends it back. JSON is a simple text format — like a shopping list but for data.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 4
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 4 — The Database: Where Everything Is Stored'),

      p('The database is like a very organised filing cabinet. It has different drawers (called "tables"), and each drawer stores one type of information. Every row in a table is one record.'),
      br(),
      p('The database file is called etoh.db and is created automatically the first time you start the server. The code that creates it lives in database.js.'),
      br(),

      h2('The Tables'),

      h3('users'),
      p('Stores everyone who has created an account.'),
      twoColTable([
        ['id', 'A unique number for each user (auto-increments: 1, 2, 3...)'],
        ['name', 'Their full name'],
        ['email', 'Their email address (must be unique — no two accounts with same email)'],
        ['password_hash', 'Their password after being scrambled by bcrypt — the real password is never stored'],
        ['whatsapp', 'Their WhatsApp phone number (optional)'],
        ['profile_picture', 'Path to their uploaded profile photo (optional)'],
        ['bio', 'A short description of themselves (optional)'],
        ['created_at', 'The date and time they registered'],
      ]),
      br(),

      h3('stands'),
      p('Stores every virtual vendor shop.'),
      twoColTable([
        ['id', 'Unique stand number'],
        ['user_id', 'Which user owns this stand (links to users table)'],
        ['vendor_name', 'The name of the shop'],
        ['phone_number', 'The vendor\'s phone number'],
        ['stand_description', 'A description of what the stand sells'],
        ['city', 'Which Cameroonian city the vendor is in (default: Douala)'],
        ['creation_date', 'When the stand was created'],
        ['is_verified', '0 = not verified, 1 = Trusted Vendor badge awarded by admin'],
        ['availability', 'open, away, or closed — set by the vendor themselves'],
      ]),
      br(),

      h3('products'),
      p('Every item listed for sale on ETOH Market.'),
      twoColTable([
        ['id', 'Unique product number'],
        ['stand_id', 'Which stand this product belongs to'],
        ['product_name', 'The name of the product'],
        ['price_cfa', 'The price in CFA francs (Cameroon\'s currency)'],
        ['category', 'One of: food, produce, fashion, electronics, beauty, home, crafts, services, general'],
        ['image_path', 'Where the product photo is stored on the server'],
        ['video_path', 'Where the product video is stored (optional)'],
        ['audio_voice_path', 'Where the seller\'s voice note is stored (optional)'],
        ['description', 'A text description of the product (optional)'],
      ]),
      br(),

      h3('orders'),
      p('Every delivery request placed by a buyer.'),
      twoColTable([
        ['id', 'Unique order number'],
        ['product_id', 'Which product the buyer wants'],
        ['buyer_name', 'The buyer\'s full name'],
        ['target_city', 'Which city to deliver to'],
        ['target_quarter', 'Which neighbourhood in that city'],
        ['near_landmark', 'A specific nearby landmark (e.g. "next to Total station Akwa")'],
        ['order_date', 'When the order was placed'],
        ['status', 'pending, confirmed, delivered, or cancelled'],
      ]),
      br(),

      h3('posts'),
      p('All Market Buzz video reels and other media posts.'),
      twoColTable([
        ['id', 'Unique post number'],
        ['user_id', 'Who posted it'],
        ['stand_id', 'Which stand the post is linked to (optional)'],
        ['title', 'The title of the post'],
        ['description', 'A caption or description'],
        ['media_path', 'Where the video or image file is stored'],
        ['media_type', 'image or video'],
        ['likes', 'How many times it has been liked'],
        ['created_at', 'When it was posted'],
      ]),
      br(),

      h3('price_reports'),
      p('Community-submitted market prices — what people actually paid today.'),
      twoColTable([
        ['id', 'Unique report number'],
        ['item_name', 'Which staple (e.g. Tomates, Plantains, Riz blanc)'],
        ['price_cfa', 'The price paid'],
        ['unit', 'The unit of measurement (e.g. kg, litre, régime)'],
        ['market_name', 'Which market they bought it from (optional)'],
        ['city', 'Which city'],
        ['reporter', 'Their first name (optional)'],
        ['reported_at', 'When the report was submitted'],
      ]),
      br(),

      h3('wanted_posts'),
      p('Buyer requests posted on the Je Cherche board — things buyers are looking for.'),
      twoColTable([
        ['id', 'Unique request number'],
        ['buyer_name', 'The buyer\'s first name'],
        ['description', 'What they are looking for'],
        ['quantity', 'How much they need (optional)'],
        ['city', 'Which city they are in'],
        ['whatsapp', 'Their WhatsApp number (so vendors can contact them)'],
        ['created_at', 'When they posted the request'],
        ['expires_at', 'When the post automatically disappears (7 days after posting)'],
      ]),
      br(),

      h2('Database Migrations'),
      p('When we added new features after the project was already running (like the bio field, the availability status, or the verified badge), we could not just delete the database and start fresh — that would erase all real data. Instead we used "migrations" — SQL commands that add new columns to existing tables without disturbing existing data. These run automatically every time the server starts and are safely ignored if the column already exists.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 5
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 5 — The Backend: The Kitchen That Does All the Work'),

      p('The backend is made up of several "route files". Each one handles a different category of actions. Think of each route file as a different department in a company. Here is a tour of every department.'),
      br(),
      p('The main entry point is server.js, which starts the server. It loads database.js (which creates and connects to the database) and then loads app.js.'),
      br(),
      p('app.js is the "main menu". It registers every route file under its own path prefix and configures important settings (CORS so the frontend can talk to the backend, JSON parsing so we can read request data, static file serving for uploaded images and videos).'),
      br(),

      h2('5.1  Authentication (routes/auth.js)'),
      p('This file handles creating accounts and logging in.'),
      br(),
      h3('POST /api/auth/register — Create a New Account'),
      p('Steps: (1) Check that name, email, and password were provided. (2) Require password to be at least 6 characters. (3) Run the password through bcrypt (a hashing function) — this scrambles it so the real password is never stored. (4) Save the new user to the database. (5) Create a JWT token (a signed digital ticket) and send it back. The frontend stores this token and sends it with every future request that requires login.'),
      br(),
      h3('POST /api/auth/login — Log In'),
      p('Steps: (1) Find the user by email. (2) Use bcrypt to check if the entered password matches the stored hash. (3) If correct, create and return a JWT token. (4) If wrong, return a clear error message.'),
      br(),
      h3('GET /api/auth/me — Get My Profile'),
      p('Requires login. Returns the current user\'s profile details from the database (name, email, WhatsApp, bio, profile picture) without the password hash.'),
      br(),
      h3('PUT /api/auth/profile — Update My Profile'),
      p('Requires login. The user can update their name, bio, WhatsApp number, and upload a new profile picture. The server uses multer (a file upload tool) to receive and save the image file, then updates the database with the new values.'),
      br(),

      h2('5.2  Stands (routes/stands.js)'),
      p('Stands are vendor shops. Any registered user can create one or more stands.'),
      br(),
      h3('GET /api/stands — All Stands'),
      p('Returns every stand in the database, sorted newest first. No login required. Used by the homepage to show the stands grid.'),
      br(),
      h3('GET /api/stands/mine — My Stands'),
      p('Requires login. Returns only the stands belonging to the logged-in user, plus a count of how many products each stand has.'),
      br(),
      h3('GET /api/stands/:id — One Stand with Products'),
      p('Returns all details of one specific stand plus all its products. Used by the Stand Detail page.'),
      br(),
      h3('POST /api/stands — Create a Stand'),
      p('Requires login. The logged-in user provides a vendor name, phone number, city, and optional description. The new stand is saved with user_id set to the logged-in user\'s id.'),
      br(),
      h3('PUT /api/stands/:id — Edit a Stand'),
      p('Requires login and ownership. The server first checks that the stand belongs to the logged-in user. If it does, it updates the name, phone, and description. If it does not, it returns a 403 Forbidden error.'),
      br(),
      h3('PUT /api/stands/:id/availability — Set Availability Status'),
      p('Requires login and ownership. The vendor sets their status to "open", "away", or "closed". Any other value is rejected with an error.'),
      br(),
      h3('DELETE /api/stands/:id — Delete a Stand'),
      p('Requires login and ownership. Deletes the stand and — because of the CASCADE rule in the database — also automatically deletes all products that belonged to it.'),
      br(),

      h2('5.3  Products (routes/products.js)'),
      p('Products are the items vendors sell. Each product belongs to one stand.'),
      br(),
      h3('GET /api/products — All Products'),
      p('Returns all products joined with their stand\'s name, city, and verification status. Accepts optional filters: city and category as query parameters (e.g. /api/products?city=Douala&category=food).'),
      br(),
      h3('GET /api/products/:id — One Product'),
      p('Returns full details of one product including the stand\'s vendor name, phone number, and owner id (needed to determine if the logged-in user is the owner).'),
      br(),
      h3('POST /api/products — Add a Product'),
      p('Requires login. The vendor provides stand_id, product_name, and price_cfa. They can also upload up to three files: an image, a video, and an audio voice note. The server first verifies that the stand belongs to the logged-in user (security check) and then saves everything.'),
      br(),
      h3('POST /api/products/:id/voice — Upload a Voice Note'),
      p('Requires login and ownership. Allows the vendor to add or replace the audio voice note on an existing product.'),
      br(),
      h3('DELETE /api/products/:id — Delete a Product'),
      p('Requires login. Checks ownership before deleting.'),
      br(),

      h2('5.4  Orders (routes/orders.js)'),
      p('Orders are delivery requests. A buyer fills out their address and requests delivery of a product.'),
      br(),
      h3('POST /api/orders — Place an Order'),
      p('No login required. The buyer provides: product_id, buyer_name, target_city, target_quarter (neighbourhood), and near_landmark (a specific nearby place to help the delivery rider find them). The order is saved and the vendor is expected to contact the buyer via WhatsApp to confirm.'),
      br(),
      h3('GET /api/orders — All Orders'),
      p('Returns all orders with the product name, price, and vendor name. This is mainly used by the Admin Panel.'),
      br(),

      h2('5.5  Market Buzz Posts (routes/posts.js)'),
      p('Posts are Market Buzz reels — short videos (and images) that vendors post to show off their products.'),
      br(),
      h3('GET /api/posts — All Posts'),
      p('Returns all posts with the author\'s name, profile picture, and the linked stand\'s name. Sorted newest first. No login required.'),
      br(),
      h3('POST /api/posts — Create a Post'),
      p('Requires login. The user uploads a video or image file, gives it a title and optional description, and can optionally link it to one of their stands. The server automatically detects whether the uploaded file is a video or image based on its MIME type and extension.'),
      br(),
      h3('POST /api/posts/:id/like — Like a Post'),
      p('No login required. Increments the like counter by 1 and returns the new total. Anyone can like any post any number of times (no duplicate prevention).'),
      br(),
      h3('DELETE /api/posts/:id — Delete a Post'),
      p('Requires login and ownership. Only the person who created the post can delete it.'),
      br(),

      h2('5.6  Community Price Board (routes/prices.js)'),
      p('The Prix du Marché feature lets community members submit and view real market prices for 12 common staples.'),
      br(),
      h3('GET /api/prices/items — List of Tracked Items'),
      p('Returns the fixed list of 12 staples (Tomates, Plantains, Huile de palme, Riz blanc, Ndolé, Bœuf, Poulet entier, Poisson fumé, Manioc, Haricots, Piment rouge, Gombo) with their units.'),
      br(),
      h3('GET /api/prices — Today\'s Price Reports'),
      p('Returns all price reports from the last 24 hours. For each item it also calculates the min, max, average, and total number of reports using SQL window functions. The frontend then shows one summary card per item. Accepts optional city filter.'),
      br(),
      h3('POST /api/prices — Submit a Price'),
      p('No login required. Anyone can submit what they paid. Validates that the price is between 1 and 10 million CFA (to catch obvious mistakes). Saves to the price_reports table.'),
      br(),

      h2('5.7  Je Cherche — Buyer Wanted Board (routes/wanted.js)'),
      p('Je Cherche is a reverse marketplace — buyers post what they need, vendors respond.'),
      br(),
      h3('GET /api/wanted — Active Requests'),
      p('Returns all wanted_posts where expires_at is in the future (not yet expired). Sorted newest first. Accepts optional city filter.'),
      br(),
      h3('POST /api/wanted — Post a Request'),
      p('No login required. Validates that a valid Cameroonian phone number was provided for WhatsApp. Saves the request with an automatic expiry date 7 days in the future.'),
      br(),
      h3('DELETE /api/wanted/:id — Remove a Request'),
      p('No login required. The poster proves they own the post by providing their WhatsApp number. The server only deletes the post if the WhatsApp number matches the one stored when the post was created. This is a lightweight ownership check without requiring an account.'),
      br(),

      h2('5.8  AI Chat Assistant (routes/gemini.js)'),
      p('The AI chat feature uses Google\'s Gemini API to answer buyer questions.'),
      br(),
      h3('POST /api/ai/chat — Send a Message'),
      p('No login required. Receives the user\'s message, checks if the GEMINI_API_KEY is configured in the .env file. If it is, it sends the message to Google Gemini with a carefully written system prompt that tells the AI to behave like a friendly Cameroonian market guide who knows local products, prices in CFA, recipes (Ndolé, Eru, Koki, Mbongo Tchobi), safe trading tips, delivery landmarks across Cameroon, and can respond in Pidgin, French, or English. If the API key is not configured, it returns a friendly fallback message explaining the situation.'),
      br(),

      h2('5.9  Admin Panel API (routes/admin.js)'),
      p('All admin routes require the secret admin key sent in the x-admin-key request header. If the key is wrong or missing, every request returns "Admin access denied."'),
      br(),
      h3('POST /api/admin/login — Verify Password'),
      p('The admin types their password in the browser. The frontend stores it in sessionStorage (deleted when the tab is closed) and sends it as x-admin-key with every admin request.'),
      br(),
      h3('GET /api/admin/stats — Dashboard Numbers'),
      p('Runs 5 database counts in parallel (users, stands, products, reels, orders) and returns them all at once.'),
      br(),
      h3('Products Management'),
      p('Search and filter all products. Edit any product\'s details (name, price, category, description, image, video). Delete any product.'),
      br(),
      h3('Reels Management'),
      p('View all video reels. Upload new reels on behalf of any vendor. Edit title and description. Delete reels.'),
      br(),
      h3('Stands Management'),
      p('View all stands with owner details and product counts. Edit any stand. Give or remove the Trusted Vendor (is_verified) badge. Delete any stand.'),
      br(),
      h3('Orders Management'),
      p('View all orders with product and vendor details. Filter by status. Search by buyer or vendor name. Update any order\'s status (pending → confirmed → delivered or cancelled) using a dropdown.'),
      br(),
      h3('Users Management'),
      p('View all registered users with their stand counts. Search by name, email, or WhatsApp. Delete any user (this also deletes all their stands and products via CASCADE).'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 6
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 6 — The Frontend: Everything the User Sees'),

      p('The frontend lives inside the client/ folder. It is a React application that is compiled by Vite. The main entry point is main.jsx, which mounts the App component into the HTML page. App.jsx defines all routes (URLs) and which page component to show for each one.'),
      br(),

      h2('6.1  App Structure and Navigation (App.jsx)'),
      p('The App wraps everything in two "context providers" — LanguageProvider (manages English/French translations) and AuthProvider (manages who is logged in). Inside, React Router maps each URL path to a page component.'),
      br(),
      p('The admin panel at /admin is completely isolated — it has no navbar and no chat widget. All other pages share the Navbar at the top and the floating AI ChatWidget at the bottom right.'),
      br(),
      twoColTable([
        ['/', 'Homepage — products and stands grid'],
        ['/login', 'Login page'],
        ['/register', 'Registration page'],
        ['/market-buzz', 'Market Buzz video reel feed'],
        ['/prix-du-marche', 'Community price board'],
        ['/je-cherche', 'Buyer wanted board'],
        ['/stands/:id', 'Individual stand page'],
        ['/products/:id', 'Individual product page'],
        ['/create-stand', 'Create a new stand (login required)'],
        ['/my-stands', 'Manage my stands (login required)'],
        ['/profile', 'Edit my profile (login required)'],
        ['/stands/:id/edit', 'Edit a specific stand (login + ownership required)'],
        ['/stands/:id/add-product', 'Add a product to a stand (login + ownership required)'],
        ['/admin/*', 'Admin panel (admin password required)'],
      ]),
      br(),

      h2('6.2  The Homepage (Home.jsx)'),
      p('When the homepage loads, it immediately fetches all stands and all products from the backend at the same time (in parallel) to minimise waiting time. It then renders:'),
      br(),
      bullet('A hero banner with the platform tagline, a "Open My Stand" button, a "Watch Reels" button, and small city pill labels (Douala, Yaoundé, Bamenda, Buea, Bafoussam).'),
      bullet('A stats strip showing live counts of active stands, listed products, reels, and the CFA currency label.'),
      bullet('A tab switcher between Products and Stands.'),
      bullet('A search bar that filters results instantly as you type.'),
      bullet('A region filter showing 8 Cameroonian cities as clickable chips.'),
      bullet('A category filter (for Products tab) showing icons for food, produce, fashion, electronics, beauty, home, crafts, and services.'),
      bullet('The filtered product grid (3 columns on desktop, 1 on mobile).'),
      bullet('A Market Buzz promotional banner at the bottom linking to the video reel feed.'),
      br(),
      p('All filtering happens entirely on the browser — no new API request is made when you change a filter. The browser already has all the data and just hides/shows cards based on your selection.'),
      br(),

      h2('6.3  Product Detail Page (ProductDetail.jsx)'),
      p('This page shows everything about one product. It loads the product and its stand details. The page contains:'),
      br(),
      bullet('Product image (click to zoom)'),
      bullet('Product name, price in CFA, category badge, and the vendor\'s Trusted Vendor badge if verified'),
      bullet('Availability badge showing the vendor\'s real-time status'),
      bullet('The product video (if uploaded) in a native HTML5 player'),
      bullet('The seller\'s voice note (if uploaded) — an audio player with the label "Bayam-Sellam Voice Note"'),
      bullet('A "Contact Seller Safely" button — opens the Safety Gate modal before revealing the phone number'),
      bullet('A "Chat on WhatsApp" green button — links directly to a wa.me WhatsApp conversation with the vendor'),
      bullet('The Bargain Calculator (described in Chapter 7)'),
      bullet('The Bendskin Delivery Button (described in Chapter 7)'),
      bullet('A "Request Delivery" form where the buyer fills in their full address to place a formal order'),
      br(),
      p('If the logged-in user is the product owner, they see a "Delete Product" button instead of the buyer-facing tools.'),
      br(),

      h2('6.4  Stand Detail Page (StandDetail.jsx)'),
      p('Shows a vendor\'s stand page with the stand name, description, city, verification badge, availability status, phone number (behind Safety Gate), and a grid of all their products. If the logged-in user owns the stand, they see "Add Product", "Edit Stand", and availability control buttons.'),
      br(),

      h2('6.5  Market Buzz — Video Reels (Reels.jsx)'),
      p('A TikTok-style scrollable video feed. Each reel snaps into view as you scroll. The layout is: vendor info panel on the left, the video in the centre (tall, portrait format), and action buttons on the right (like, visit stand, delete if owner). Videos start playing automatically when scrolled into view (using the Intersection Observer API — a browser feature that detects when an element enters the screen).'),
      br(),
      p('Logged-in users can post their own reel by clicking "+ Post". A modal opens where they can upload a video file, write a title and caption, and optionally link the reel to one of their stands.'),
      br(),

      h2('6.6  Prix du Marché — Community Price Board (PrixDuMarche.jsx)'),
      p('Shows a grid of 12 price cards, one for each tracked staple (Tomates, Plantains, Huile de palme, etc.). Each card shows the item\'s emoji icon, the min price in green, the average price in the centre, and the max price in red — all from today\'s reports. A count badge shows how many reports were submitted today for that item. A "Submit a Price" modal lets anyone report what they paid today, which market they bought it from, and in which city.'),
      br(),

      h2('6.7  Je Cherche — Buyer Wanted Board (JeCherche.jsx)'),
      p('A board showing all active buyer requests. Each card shows the buyer\'s name, what they are looking for, the quantity, how many days ago they posted, how many days until it expires, and a "Contact on WhatsApp" button that opens WhatsApp with a pre-written message in French ("Bonjour [name]! J\'ai vu votre annonce sur ETOH Market..."). A city filter at the top narrows results. A "Post a Request" button opens a form. If the poster wants to delete their post, they type their WhatsApp number to prove ownership.'),
      br(),

      h2('6.8  Login and Register Pages'),
      p('Clean, simple forms. Login asks for email and password. Register asks for full name, email, password, and confirm password. On success, the JWT token and user data are saved to AuthContext, and the user is redirected to the homepage. Error messages are shown inline (e.g. "An account with this email already exists.").'),
      br(),

      h2('6.9  Profile Page (Profile.jsx)'),
      p('A form where logged-in users can update their name, bio, WhatsApp number, and profile picture. Changes are sent to PUT /api/auth/profile. The profile picture is uploaded as a multipart form with the image file, saved to the uploads/ folder, and the path is stored in the database.'),
      br(),

      h2('6.10  Admin Panel (Admin.jsx)'),
      p('A completely separate page at /admin. It has its own login form with a dark theme. Once authenticated, it shows a dashboard with stat cards, and a tab bar for Products, Reels, Stands, Orders, and Users management. All admin API calls include the admin key as x-admin-key in the request header. The key is stored in sessionStorage (not localStorage) so it is automatically cleared when the browser tab is closed.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 7
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 7 — Special Components Explained'),

      p('Several components on ETOH Market are particularly clever or unique. This chapter explains each one in detail.'),
      br(),

      h2('7.1  Safety Gate (SafetyGate.jsx)'),
      p('This is a modal (pop-up) that appears before the app reveals any seller\'s phone number. It exists because mobile money scams are a real and serious problem in Cameroon. We wanted to make buyers consciously aware of the risks before every contact.'),
      br(),
      p('How it works: When a buyer clicks "Contact Seller Safely", a dark overlay covers the screen and a white card pops up. It shows three safety rules with icons:'),
      bullet('Never send mobile money or cash before physically inspecting and receiving the goods.'),
      bullet('Always arrange meetings at busy public places — near a petrol station, church, bakery, or bank.'),
      bullet('Double-check all payment confirmation SMS codes. Ignore any link sent by strangers.'),
      br(),
      p('Below the rules is a checkbox: "I have read and fully understand all the safety guidelines above." The "Reveal Seller Contact" button stays grey and disabled until the checkbox is ticked. This forces the buyer to consciously acknowledge the rules. Once ticked and the button is clicked, the phone number appears in bold, and a reminder to "Stay safe — meet in public, inspect before paying" is shown below it.'),
      br(),
      tip('This is a UX (user experience) pattern called a "friction gate" — a small intentional obstacle that makes users stop and think before taking an important action. It does not prevent bad transactions, but it makes buyers more aware.'),
      br(),

      h2('7.2  Bargain Calculator (inside ProductDetail.jsx)'),
      p('Price negotiation is a central part of Cameroonian market culture. Nobody pays the first price. The Bargain Calculator acknowledges this culture and makes it easy and comfortable.'),
      br(),
      p('How it works: Three offer buttons are shown, each a different percentage off the listed price:'),
      bullet('Cool (10% off) — shown in green — a polite, friendly opening offer'),
      bullet('Fair (20% off) — shown in amber — a commonly accepted reasonable offer'),
      bullet('Aggressive (30% off) — shown in red — pushing hard for the best possible price'),
      br(),
      p('The offer prices are calculated automatically: (listed_price × (1 - percentage/100)) rounded down to the nearest 50 CFA (because Cameroon prices are always round numbers). When a buyer clicks an offer, a "Copy Message" button appears showing the exact WhatsApp message ready to send: "Hi! I\'m interested in [product name]. Would you accept [offer price] CFA?" The buyer copies it and pastes it into WhatsApp. Everything is translated to French if the language is set to French.'),
      br(),

      h2('7.3  Bendskin Delivery Button (BendskinButton.jsx)'),
      p('Arranging delivery in Cameroon usually means calling your regular bendskin (moto-taxi) rider and explaining where to pick up and where to deliver. This button pre-fills all that information.'),
      br(),
      p('How it works: The buyer clicks the orange "Bendskin Delivery" button. A small panel drops down asking for their delivery address. When they click "Open WhatsApp", a wa.me link opens with a pre-written message already filled in. The message includes the product name, vendor name and city, price in CFA, and the buyer\'s delivery address. The buyer just selects their bendskin contact from WhatsApp and hits send. The message works in both English and French depending on the language setting.'),
      br(),
      p('Example message: "🛵 Bendskin Delivery Request — ETOH Market  |  📦 Product: Fresh Tomatoes  |  🏪 Vendor: Mami Grace (Douala)  |  💰 Price: 2,500 CFA  |  🏠 Deliver to: Akwa, near Total station  |  Can you handle this delivery? What\'s your rate?"'),
      br(),

      h2('7.4  Voice Recorder (VoiceRecorder.jsx)'),
      p('Vendors who are not comfortable typing long descriptions can record a voice note instead — just like a WhatsApp voice message. This is especially useful for vendors who are not very literate but can describe their product perfectly by voice.'),
      br(),
      p('How it works: A microphone button (🎙️) sits on the "Add Product" form. When clicked, the browser asks permission to use the microphone. If granted, recording starts immediately and a timer counts up (max 60 seconds). When the vendor clicks stop (⏹️), the recording is processed into an audio file (WebM format) and a small audio player appears so they can preview it. The vendor can re-record if not happy. When they submit the product form, the audio blob is sent along with the other product data to the backend, which saves it as a file and stores the path in the database.'),
      br(),
      p('On the Product Detail page, buyers see an audio player labelled "Bayam-Sellam Voice Note" (a reference to the famous women traders in Cameroon who sell door-to-door by describing products verbally).'),
      br(),

      h2('7.5  AI Chat Widget (ChatWidget.jsx)'),
      p('A floating chat bubble in the bottom-right corner of every page. It opens a chat panel with a header showing "ETOH Market Guide — Powered by Gemini AI".'),
      br(),
      p('How it works: The first message the AI sends when the chat opens is always: "Mbolo! I am your ETOH Market Guide. Ask me about products, local prices in CFA, recipes, safe trading tips, or delivery spots across Cameroon!" (Mbolo is a greeting in Ewondo, a Cameroonian language.) When the buyer types a question and presses Enter or clicks Send, the message is posted to /api/ai/chat on the backend. The backend forwards it to Google Gemini with a detailed system prompt instructing the AI to act as a warm, friendly Cameroonian market assistant. The AI\'s response comes back and is displayed in the chat window.'),
      br(),

      h2('7.6  Availability Badge (AvailabilityBadge.jsx)'),
      p('A small coloured indicator that shows a vendor\'s availability status. It appears on stand cards on the homepage, on the stand detail page, and on the product detail page. Three states:'),
      bullet('"Open Now" — green pulsing dot'),
      bullet('"Back Soon" — yellow dot'),
      bullet('"Closed" — red dot'),
      br(),
      p('The green dot has a CSS "pulse" animation (it softly grows and shrinks) to suggest live/active status — a design trick borrowed from live status indicators on platforms like Discord or YouTube Live.'),
      br(),

      h2('7.7  Trusted Vendor Badge'),
      p('A small golden lion badge (🦁) that appears next to a vendor\'s name. The lion was chosen as the symbol because it is strong, trustworthy, and has cultural resonance in Central Africa. The badge is labelled "Trusted Vendor" (in English) or "Vendeur Certifié" (in French). It appears everywhere the vendor\'s name is shown: stand cards on homepage, the stand detail page, product cards, and Market Buzz reels. The admin grants this badge from the Admin Panel by clicking the "Verify" button next to a stand.'),
      br(),

      h2('7.8  WhatsApp Button (WhatsAppButton.jsx)'),
      p('A green button styled like the WhatsApp brand. When clicked, it opens a wa.me link with the vendor\'s phone number pre-filled. This creates a new WhatsApp conversation directly. The wa.me service is provided by WhatsApp / Meta and works on both mobile and desktop. On mobile it opens the WhatsApp app directly. On desktop it opens WhatsApp Web.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 8
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 8 — Security and Authentication Explained Simply'),

      h2('How Passwords Are Protected'),
      p('We never store the actual password. Here is why: if a hacker broke into our database and stole all the data, they would get a list of email addresses and their hashed passwords. Without the actual password, they cannot log in. Here is how bcrypt hashing works, in simple terms:'),
      br(),
      bullet('You type your password: "mypassword123"'),
      bullet('bcrypt runs it through a mathematical algorithm 10 times (10 "rounds" — we control this)'),
      bullet('The result is a long, random-looking string: "$2b$10$kVnLQdqZjJb..." — this is the hash'),
      bullet('We store the hash in the database'),
      bullet('When you log in later, bcrypt compares your typed password against the stored hash'),
      bullet('If they match → let you in. If not → reject. The original password is never recovered.'),
      br(),
      p('The more rounds you set, the slower the hashing — which is intentional! It makes it extremely slow for a hacker to try millions of passwords (a "brute force" attack).'),
      br(),

      h2('How the Login Token (JWT) Works'),
      p('After login, the server creates a JWT (JSON Web Token). Think of it like a VIP wristband at a concert. Once you get the wristband (after showing your ID at the gate), you can walk freely into the venue — security just glances at your wristband, they do not ask for your ID again at every door.'),
      br(),
      bullet('The JWT contains: your user id, email, and name — packed into a small text string'),
      bullet('It is "signed" by the server using a secret key (JWT_SECRET in .env)'),
      bullet('Only the server knows the secret key, so only the server can verify the signature'),
      bullet('The token is stored in the browser\'s localStorage'),
      bullet('Every protected API request sends it as: Authorization: Bearer <token>'),
      bullet('The server reads the token, verifies the signature, and extracts your user id'),
      bullet('Tokens expire after 7 days (TOKEN_TTL = \'7d\') — after that, you must log in again'),
      br(),

      h2('How Admin Security Works'),
      p('The admin panel does not use the same JWT system. Instead, the admin types a password that matches ADMIN_PASSWORD in the .env file. The frontend stores this password in sessionStorage (it is deleted when the browser tab closes — unlike localStorage which stays until manually cleared). Every admin API request sends it in a custom header called x-admin-key. The backend\'s adminAuth middleware checks this header before allowing any admin action.'),
      br(),

      h2('How Ownership Is Enforced'),
      p('Before any logged-in user can edit or delete a stand or product, the backend verifies ownership. For a stand: it queries the database to check that the stand\'s user_id matches the logged-in user\'s id from the JWT. For a product: it joins the products and stands tables to get the stand\'s user_id and compares it to the logged-in user. If they do not match, the server returns HTTP 403 Forbidden — the action is blocked.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 9
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 9 — The Language System (English and French)'),

      p('Cameroon has two official languages: English and French. ETOH Market supports both from day one.'),
      br(),
      p('All text on the website is stored in a central "translations" object inside LanguageContext.jsx. This object has two keys: "en" (English) and "fr" (French). Every piece of text you see on the site is looked up from this object using a key.'),
      br(),
      p('For example, instead of writing "Welcome to ETOH Market" directly in the code, we write t("heroTitle"). The t() function looks up "heroTitle" in the current language. In English it returns "Welcome to ETOH Market". In French it returns "Bienvenue sur ETOH Market".'),
      br(),
      p('The current language is stored in the browser\'s localStorage (a small storage built into every browser) so it is remembered between visits. The language toggle button in the navbar switches it instantly. Every component that uses text calls useLang() — a custom React hook — to access the t() function.'),
      br(),
      p('For dynamic text (like bargain messages that include the product name and price), the translation value is a function: t("bargainMsg", productName, price) calls bargainMsg(productName, price) which returns the formatted string in the right language.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 10
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 10 — How to Run the Project on Your Computer'),

      h2('What You Need First'),
      bullet('Node.js version 18 or higher — download from nodejs.org'),
      bullet('A code editor such as VS Code — download from code.visualstudio.com'),
      bullet('A terminal / command prompt (PowerShell on Windows, Terminal on Mac)'),
      br(),

      h2('Step 1: Open the Project Folder'),
      p('Navigate to the etoh_market folder in your terminal.'),
      code('cd C:\\Users\\YourName\\etoh_market'),
      br(),

      h2('Step 2: Install Backend Tools'),
      p('This downloads all the backend libraries listed in package.json.'),
      code('npm install'),
      br(),

      h2('Step 3: Install Frontend Tools'),
      code('cd client'),
      code('npm install'),
      code('cd ..'),
      br(),

      h2('Step 4: (Optional) Fill the Database with Sample Data'),
      p('The seed files create some example vendors, products, and prices so the site does not look empty.'),
      code('node seed.js'),
      code('node seed_prices.js'),
      br(),

      h2('Step 5: Configure the .env File'),
      p('The .env file holds secret settings. It looks like this:'),
      code('PORT=3000'),
      code('JWT_SECRET=your_secret_key_here'),
      code('ADMIN_PASSWORD=etoh_admin_2024'),
      code('GEMINI_API_KEY=your_gemini_api_key_here'),
      br(),
      p('The GEMINI_API_KEY is needed only if you want the AI chat to work. Get one for free at aistudio.google.com. The other values have safe defaults.'),
      br(),

      h2('Step 6: Start the Backend Server'),
      p('Run this in the etoh_market folder:'),
      code('node server.js'),
      p('You should see: "ETOH Market Server → http://localhost:3000"'),
      br(),

      h2('Step 7: Start the Frontend (in a second terminal window)'),
      code('cd client'),
      code('npm run dev'),
      p('You should see: "Local: http://localhost:5173"'),
      br(),

      h2('Step 8: Open the Website'),
      twoColTable([
        ['Main site', 'http://localhost:5173'],
        ['Admin panel', 'http://localhost:5173/admin  (default password: etoh_admin_2024)'],
        ['Market Buzz', 'http://localhost:5173/market-buzz'],
        ['Price Board', 'http://localhost:5173/prix-du-marche'],
        ['Buyer Board', 'http://localhost:5173/je-cherche'],
      ]),
      br(),
      tip('The frontend (port 5173) and backend (port 3000) run separately during development. In production you build the frontend with "npm run build" inside the client folder, and the backend serves the built files at localhost:3000.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 11
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 11 — The Full API Reference'),

      p('An API (Application Programming Interface) is the set of rules for how the frontend and backend communicate. Every API endpoint is an address (URL) that does one specific thing.'),
      br(),

      h2('Public Endpoints — No Login Required'),
      twoColTable([
        ['GET  /api/stands', 'Get all vendor stands'],
        ['GET  /api/stands/:id', 'Get one stand with all its products'],
        ['GET  /api/products', 'Get all products (filter: ?city=Douala&category=food)'],
        ['GET  /api/products/:id', 'Get one product\'s full details'],
        ['GET  /api/posts', 'Get all Market Buzz reels'],
        ['GET  /api/posts/:id', 'Get one reel'],
        ['POST /api/posts/:id/like', 'Like a reel'],
        ['GET  /api/prices/items', 'Get the list of 12 tracked staples'],
        ['GET  /api/prices', 'Get today\'s price reports (filter: ?city=Douala)'],
        ['POST /api/prices', 'Submit a price report'],
        ['GET  /api/wanted', 'Get active buyer requests (filter: ?city=Douala)'],
        ['POST /api/wanted', 'Post a new buyer request'],
        ['DELETE /api/wanted/:id', 'Remove a buyer request (provide whatsapp in body)'],
        ['POST /api/ai/chat', 'Send message to AI chat assistant'],
        ['POST /api/orders', 'Place a delivery order'],
      ]),
      br(),

      h2('Authentication Endpoints'),
      twoColTable([
        ['POST /api/auth/register', 'Create a new account → returns JWT token'],
        ['POST /api/auth/login', 'Log in → returns JWT token'],
        ['GET  /api/auth/me', 'Get my profile (requires: Bearer token in Authorization header)'],
        ['PUT  /api/auth/profile', 'Update name, bio, WhatsApp, profile picture (requires: token)'],
      ]),
      br(),

      h2('Protected Endpoints — JWT Token Required'),
      twoColTable([
        ['GET  /api/stands/mine', 'Get my stands with product counts'],
        ['POST /api/stands', 'Create a new stand'],
        ['PUT  /api/stands/:id', 'Edit my stand'],
        ['PUT  /api/stands/:id/availability', 'Set my stand status (open/away/closed)'],
        ['DELETE /api/stands/:id', 'Delete my stand'],
        ['POST /api/products', 'Add a product (image + video + audio optional)'],
        ['POST /api/products/:id/voice', 'Upload/replace voice note on a product'],
        ['DELETE /api/products/:id', 'Delete my product'],
        ['POST /api/posts', 'Post a Market Buzz reel'],
        ['DELETE /api/posts/:id', 'Delete my reel'],
      ]),
      br(),

      h2('Admin Endpoints — x-admin-key Header Required'),
      twoColTable([
        ['GET  /api/admin/stats', 'Dashboard count statistics'],
        ['GET  /api/admin/orders', 'All orders (latest 200)'],
        ['PUT  /api/admin/orders/:id/status', 'Update order status'],
        ['GET  /api/admin/products', 'All products (search: ?search=X&category=Y)'],
        ['PUT  /api/admin/products/:id', 'Edit any product'],
        ['DELETE /api/admin/products/:id', 'Delete any product'],
        ['GET  /api/admin/reels', 'All video reels'],
        ['POST /api/admin/reels', 'Upload a reel as admin'],
        ['PUT  /api/admin/reels/:id', 'Edit reel title/description'],
        ['DELETE /api/admin/reels/:id', 'Delete any reel'],
        ['GET  /api/admin/stands', 'All stands with owner info and product counts'],
        ['PUT  /api/admin/stands/:id/edit', 'Edit any stand'],
        ['PUT  /api/admin/stands/:id/verify', 'Grant or remove Trusted Vendor badge'],
        ['DELETE /api/admin/stands/:id', 'Delete any stand'],
        ['GET  /api/admin/users', 'All users with stand counts'],
        ['DELETE /api/admin/users/:id', 'Delete any user and all their data'],
        ['GET  /api/admin/stands-list', 'Simple name+city list for admin dropdowns'],
      ]),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 12
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 12 — Technologies Used and Why Each Was Chosen'),

      h2('Backend Technologies'),
      twoColTable([
        ['Node.js', 'JavaScript running on the server. Same language as the frontend, so developers only need to know one language to work on the whole project.'],
        ['Express.js', 'The simplest and most popular way to build web servers in Node.js. Creates routes (URL handlers) in just a few lines of code.'],
        ['SQLite', 'A file-based database stored as a single .db file. No installation, no configuration, no separate server. Perfect for this scale. Handles thousands of records with ease.'],
        ['bcryptjs', 'Industry-standard password hashing. Deliberately slow — designed to make brute-force attacks impractical. Used by banks and large corporations worldwide.'],
        ['jsonwebtoken', 'Creates and verifies JWT tokens. Stateless authentication — the server does not need to store sessions; all user info is inside the token.'],
        ['multer', 'Handles multipart file uploads (images, videos, audio). Saves files to the uploads/ folder with unique filenames to prevent collisions.'],
        ['dotenv', 'Loads secret variables from a .env file into the environment. Prevents secrets (API keys, passwords) from being hardcoded in the source code.'],
        ['cors', 'Allows the frontend (on port 5173) to make API requests to the backend (on port 3000) during development. Without this, browsers would block cross-origin requests.'],
        ['@google/generative-ai', 'Google\'s official SDK for Gemini AI. Used to send prompts and receive responses from the Gemini model.'],
        ['docx', 'Used to generate this documentation file programmatically in Word format.'],
      ]),
      br(),

      h2('Frontend Technologies'),
      twoColTable([
        ['React', 'Component-based UI library. Every button, card, and modal is a reusable component. React efficiently updates only the parts of the screen that changed.'],
        ['Vite', 'Ultra-fast build tool and development server. Replaces older tools like webpack. Starts in under 1 second and hot-reloads changes instantly.'],
        ['React Router DOM', 'Handles client-side navigation. When you click a link, the URL changes but the page does not fully reload — giving a fast, app-like feel.'],
        ['Axios', 'HTTP client for making API requests. Cleaner than the native fetch API with better error handling and automatic JSON parsing.'],
        ['React Context API', 'Built into React. Shares global state (who is logged in, current language) across all components without manually passing data down through every layer.'],
      ]),
      br(),

      h2('External Services'),
      twoColTable([
        ['Google Gemini AI', 'Powers the AI chat assistant. The gemini-2.5-flash model is fast and cost-effective. The system prompt makes it behave like a Cameroonian market expert.'],
        ['WhatsApp (wa.me links)', 'All buyer-seller communication happens through WhatsApp. wa.me is a WhatsApp-provided link format that opens a conversation with any phone number. No API key or registration needed — it just works.'],
      ]),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 13
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 13 — Testing'),

      p('The project includes automated tests in the /tests folder. They are written using Jest (a popular JavaScript test runner) and Supertest (which sends real HTTP requests to the backend and checks the responses). Run all tests with:'),
      code('npm test'),
      br(),
      p('Tests use an isolated database (separate from etoh.db) that is created fresh for each test run and deleted afterwards. This means tests never interfere with real data.'),
      br(),

      h2('Types of Tests'),
      bullet('Smoke tests — Does every API route respond without crashing? Checks that the server starts and all endpoints return a response.'),
      bullet('Auth tests — Register a new user, log in, access a protected route with the token, try accessing without a token (should get 401 Unauthorized).'),
      bullet('Stands tests — Create a stand, retrieve it, update it, verify ownership rules.'),
      bullet('Products tests — Add a product to a stand, retrieve it, ensure only the owner can delete it.'),
      bullet('Orders tests — Place an order with valid and invalid data.'),
      bullet('Prices tests — Submit a price report, retrieve today\'s summary.'),
      bullet('Wanted tests — Post a request, retrieve it, delete it with the correct WhatsApp number.'),
      bullet('QA tests — Send invalid data and verify that the correct error messages come back.'),
      bullet('User story tests — End-to-end flow: Register → Create Stand → Add Product → Place Order.'),
      br(),
      tip('Always run the tests before committing new code to make sure you did not accidentally break something else.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 14
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 14 — Design Philosophy'),

      p('Every design decision on ETOH Market was guided by one core question: "Will this work well for someone in Cameroon on a basic Android phone with a slow internet connection?" This shaped every feature, every button, every API response.'),
      br(),

      h2('Speed Over Everything'),
      bullet('The homepage loads stands and products in parallel (two requests at the same time), halving the wait time.'),
      bullet('Filtering on the homepage happens entirely in the browser — no extra API request when you change a filter.'),
      bullet('The backend sends only the data needed — no bloated responses with unnecessary fields.'),
      bullet('Images and videos are served directly from the server as static files — no external CDN required.'),
      bullet('React updates only what changed on screen — no full page reloads that would feel slow on mobile.'),
      br(),

      h2('WhatsApp First'),
      p('WhatsApp is how Cameroonians do business. It is on every phone, everyone knows how to use it, and people trust it. Instead of building a custom messaging system, every contact button, delivery request, and bargain offer connects through WhatsApp. We leverage what already works rather than replacing it.'),
      br(),

      h2('No Payment Processing'),
      p('ETOH Market deliberately does not handle any money. Buyers and sellers arrange payment themselves — in person, via Mobile Money (Orange Money, MTN MoMo), or by any agreed method. This design decision was made intentionally: processing payments would add enormous complexity (fraud prevention, refund handling, regulatory requirements) and create a target for scammers. By staying out of the payment flow entirely, we stay simple and safe.'),
      br(),

      h2('Community-Powered Trust'),
      bullet('The Trusted Vendor badge requires human review by the admin — not just an automated check.'),
      bullet('The Prix du Marché price board gets more accurate as more people submit reports — the community benefits from each other\'s knowledge.'),
      bullet('Je Cherche connects buyers and sellers directly without any intermediary.'),
      bullet('Market Buzz lets vendors build their own reputation through authentic short videos.'),
      br(),

      h2('Bilingual from Day One'),
      p('All text is stored in a translation file from the very beginning — not added as an afterthought. Both languages are always in sync because they live in the same file. Switching languages is instant because no server request is needed — all translations are already loaded in the browser.'),
      br(),

      h2('Mobile-First Layout'),
      p('The CSS is written mobile-first. On small screens, product grids stack into a single column. Buttons are large enough to tap with a finger. The Market Buzz feed fills the full screen height in portrait mode like a proper TikTok-style experience. The admin panel uses overflow-x: auto on tables so they are scrollable on narrow screens.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         CHAPTER 15
      ════════════════════════════════════════════════════════════════ */
      h1('Chapter 15 — Future Plans'),

      h2('Short Term (Next 3 Months)'),
      bullet('Product reviews — buyers leave text testimonials with star ratings on products they purchased.'),
      bullet('Push notifications — WhatsApp Business API integration to notify buyers when their order status changes.'),
      bullet('Vendor analytics dashboard — show each vendor how many views, likes, and WhatsApp contacts their stand and products received this week.'),
      bullet('Image compression — automatically resize uploaded images to reduce file size and speed up page loads.'),
      br(),

      h2('Medium Term (3–12 Months)'),
      bullet('Mobile app — React Native version of the app for Android (primary market) and iPhone. Much of the code can be reused from the web version.'),
      bullet('Group buy (Tontine) — multiple buyers pool together for a bulk-discount order. The more people join, the lower the price per unit.'),
      bullet('Seller ratings — a trust score calculated from buyer feedback after each completed order.'),
      bullet('Multi-language support — add Cameroonian Pidgin English, Fulfulde, Bassa, and Ewondo translations for deeper local connection.'),
      bullet('Mobile Money fee calculator — show buyers the exact total including Orange Money or MTN MoMo transfer fees.'),
      br(),

      h2('Long Term (12+ Months)'),
      bullet('Verified bendskin network — partner with moto-taxi associations in major cities for tracked, insured last-mile delivery.'),
      bullet('Wholesale marketplace — bulk order section for restaurants, caterers, event planners, and small businesses who buy in large quantities.'),
      bullet('ETOH Finance — micro-credit for vendors who need to buy stock upfront. The platform\'s order history would serve as a credit score.'),
      bullet('Offline mode — cache the product catalogue locally so buyers can browse without internet and place an order when they reconnect.'),
      pb(),

      /* ═══════════════════════════════════════════════════════════════
         FINAL WORDS
      ════════════════════════════════════════════════════════════════ */
      h1('Final Words'),

      p('ETOH Market started with a simple idea: Cameroon has some of the most talented, hardworking, creative vendors in the world. A woman who wakes up at 4am to prepare her Ndolé. A tailor who learned his craft from his father and can make anything from scratch. A young man who repairs phones better than any shop in the city. They deserve to be found by buyers who need them.'),
      br(),
      p('Every line of code in this project was written with that reality in mind. Every feature solves a real problem that real Cameroonians face every day. The Bargain Calculator knows that negotiating is not rude — it\'s culture. The Bendskin Button knows that delivery means a guy on a moto, not a courier truck. The Safety Gate knows that trust is hard-earned online. The Prix du Marché knows that fair prices only exist when information is shared openly.'),
      br(),
      p('This is not just a marketplace website. It is an attempt to digitise the warmth, the hustle, the community, and the spirit of the Cameroonian central market — and put it in the pocket of every Cameroonian with a smartphone.'),
      br(),
      br(),
      new Paragraph({
        children: [new TextRun({ text: 'Built with love, for Cameroon.', bold: true, size: 36, font: 'Calibri', color: '92400e' })],
        alignment: AlignmentType.CENTER, spacing: { before: 400 },
      }),
      br(),
      center('© 2026 ETOH Market. All rights reserved.', 20, false, '94a3b8'),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const outPath = 'ETOH_Market_Documentation.docx';
  fs.writeFileSync(outPath, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`\n  Documentation generated: ${outPath}  (${kb} KB)\n`);
});
