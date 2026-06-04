require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database');

const IMG = {
  // Fashion
  kaba:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ankara:     'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80',
  jeans:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  headwrap:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  dress2:     'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80',
  shoes:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  // Food
  ndole:      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
  spices:     'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&q=80',
  groundnut:  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
  mbongo:     'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
  palmoil:    'https://images.unsplash.com/photo-1612204103590-b55f88f92765?w=600&q=80',
  egusi:      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  crayfish:   'https://images.unsplash.com/photo-1519996409144-56c88c77e3e2?w=600&q=80',
  fufu:       'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
  okok:       'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
  kola:       'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  smokedfish: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80',
  banga:      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
  // Tech
  samsung:    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  iphone:     'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
  earbuds:    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  powerbank:  'https://images.unsplash.com/photo-1609592802186-5a62bf8e2b84?w=600&q=80',
  laptop:     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  macbook:    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  ipad:       'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  tv:         'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
  ps5:        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
  camera:     'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  drone:      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80',
  iphone13:   'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80',
  // Cars
  camry:      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',
  corolla:    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
  honda:      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&q=80',
  prado:      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
  suzuki:     'https://images.unsplash.com/photo-1617654697808-7dfb7c1c8a3c?w=600&q=80',
  hyundai:    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
  pickup:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  // Furniture
  sofa:       'https://images.unsplash.com/photo-1555041469-149c6f3a2e2b?w=600&q=80',
  bed:        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
  dining:     'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  wardrobe:   'https://images.unsplash.com/photo-1555041469-149c6f3a2e2b?w=600&q=80',
  desk:       'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&q=80',
  tvstand:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  mattress:   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
  shelf:      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80',
  // Produce
  plantain:   'https://images.unsplash.com/photo-1571680322579-11d4f0936bff?w=600&q=80',
  waterleaf:  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
  garden:     'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
  avocado:    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
  // Buzz images
  mktscene:   'https://images.unsplash.com/photo-1612278675615-7b093b07772d?w=800&q=80',
  fashion1:   'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
  cook1:      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
  tech1:      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80',
  fruits1:    'https://images.unsplash.com/photo-1519996409144-56c88c77e3e2?w=800&q=80',
  car1:       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  furn1:      'https://images.unsplash.com/photo-1555041469-149c6f3a2e2b?w=800&q=80',
  spice1:     'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80',
  drone1:     'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
  market2:    'https://images.unsplash.com/photo-1581591524425-44a74a7671a7?w=800&q=80',
  ps5img:     'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
  prado1:     'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
};

async function run(sql, params = []) {
  return new Promise((res, rej) =>
    db.run(sql, params, function (err) { err ? rej(err) : res(this.lastID); })
  );
}
function getRow(sql, params = []) {
  return new Promise((res) => db.get(sql, params, (_, r) => res(r)));
}

async function seed() {
  console.log('\nSeeding ETOH Market with full Cameroonian demo content…\n');
  const pw = await require('bcryptjs').hash('demo1234', 10);

  // ── Users ──────────────────────────────────────────────────────────────
  const USERS = [
    { name: 'Josephine Mbarga',   email: 'josephine@etoh.cm', pw, wa: '677001111', bio: 'Fashion vendor in Douala-Akwa. Specialising in African print clothing and traditional wear.' },
    { name: 'Chef Bello Ngamba',  email: 'bello@etoh.cm',     pw, wa: '699002222', bio: 'Cameroonian chef and spice trader in Yaoundé. Authentic flavours for your kitchen.' },
    { name: 'Paul Nkemdirim',     email: 'paul@etoh.cm',      pw, wa: '651003333', bio: 'Tech specialist in Bamenda. Genuine phones and accessories since 2018.' },
    { name: 'Marie Ndi',          email: 'marie@etoh.cm',     pw, wa: '670004444', bio: 'Fresh produce — farm to table, every morning in Buea.' },
    { name: 'Alain Fotso Motors', email: 'alain@etoh.cm',     pw, wa: '655005555', bio: 'Certified pre-owned and new car dealer. 15 years in the Cameroonian auto market.' },
    { name: 'Casa Bella Douala',  email: 'casa@etoh.cm',      pw, wa: '691006666', bio: 'Premium furniture showroom. Beds, sofas, dining sets — delivered across Cameroon.' },
  ];

  for (const u of USERS) {
    await run(
      'INSERT OR IGNORE INTO users (name, email, password_hash, whatsapp, bio) VALUES (?,?,?,?,?)',
      [u.name, u.email, u.pw, u.wa, u.bio]
    );
  }
  const uids = await Promise.all(USERS.map((u) => getRow('SELECT id FROM users WHERE email=?', [u.email]).then((r) => r?.id)));

  // ── Stands ─────────────────────────────────────────────────────────────
  const STANDS = [
    { uid: uids[0], name: 'Josephine Fashion Hub',        phone: '677001111', city: 'Douala',    desc: 'Authentic African print dresses, kaba-ngondo, and imported fabrics.' },
    { uid: uids[1], name: "Bello's Cameroonian Kitchen",  phone: '699002222', city: 'Yaoundé',   desc: 'Dried spices, ndolé, groundnut paste and all Cameroonian cooking essentials.' },
    { uid: uids[2], name: 'TechZone Bamenda',             phone: '651003333', city: 'Bamenda',   desc: 'New and UK-used smartphones, laptops, accessories and solar chargers.' },
    { uid: uids[3], name: "Ndi's Fresh Market",           phone: '670004444', city: 'Buea',      desc: 'Fresh plantains, garden eggs, waterleaf — harvested every morning.' },
    { uid: uids[4], name: 'Fotso Motors Cameroon',        phone: '655005555', city: 'Douala',    desc: 'Certified used and brand-new cars. Toyota, Honda, Hyundai. Financing available.' },
    { uid: uids[5], name: 'Casa Bella Furniture',         phone: '691006666', city: 'Yaoundé',   desc: 'Premium bedroom, living room, and dining furniture. Factory direct prices.' },
    { uid: uids[2], name: 'TechZone Yaoundé',             phone: '651003334', city: 'Yaoundé',   desc: 'Gaming consoles, drones, cameras and smart home devices.' },
  ];

  const sids = [];
  for (const s of STANDS) {
    const id = await run(
      'INSERT INTO stands (user_id, vendor_name, phone_number, stand_description, city) VALUES (?,?,?,?,?)',
      [s.uid, s.name, s.phone, s.desc, s.city]
    );
    sids.push(id);
  }

  // ── Products ───────────────────────────────────────────────────────────
  const PRODUCTS = [
    // Stand 0 – Fashion (Douala)
    { sid: sids[0], name: 'Kaba Ngondo Traditional Dress',    price: 35000,       cat: 'fashion',     img: IMG.kaba      },
    { sid: sids[0], name: 'Ankara Fabric (6 yards)',           price: 12000,       cat: 'fashion',     img: IMG.ankara    },
    { sid: sids[0], name: 'Imported Jeans (Sizes 30-40)',      price: 8500,        cat: 'fashion',     img: IMG.jeans     },
    { sid: sids[0], name: 'African Kente Headwrap',            price: 4500,        cat: 'fashion',     img: IMG.headwrap  },
    { sid: sids[0], name: 'Wax Print Summer Dress',            price: 18000,       cat: 'fashion',     img: IMG.dress2    },

    // Stand 1 – Food (Yaoundé)
    { sid: sids[1], name: 'Fresh Ndolé Leaves (500g)',         price: 500,         cat: 'food',        img: IMG.ndole     },
    { sid: sids[1], name: 'Njansang Spice Pack (100g)',        price: 1500,        cat: 'food',        img: IMG.spices    },
    { sid: sids[1], name: 'Pure Groundnut Paste (1kg)',        price: 2000,        cat: 'food',        img: IMG.groundnut },
    { sid: sids[1], name: 'Mbongo Tchobi Spice Mix',           price: 3000,        cat: 'food',        img: IMG.mbongo    },
    { sid: sids[1], name: 'Red Palm Oil (5 litres)',           price: 3500,        cat: 'food',        img: IMG.palmoil   },
    { sid: sids[1], name: 'Egusi / Melon Seeds (1kg)',         price: 2500,        cat: 'food',        img: IMG.egusi     },
    { sid: sids[1], name: 'Dried Crayfish (500g)',             price: 4000,        cat: 'food',        img: IMG.crayfish  },
    { sid: sids[1], name: 'Fufu Corn Flour (5kg)',             price: 2000,        cat: 'food',        img: IMG.fufu      },
    { sid: sids[1], name: 'Okok Leaves (fresh bundle)',        price: 800,         cat: 'food',        img: IMG.okok      },
    { sid: sids[1], name: 'Kola Nuts (1 dozen)',               price: 1500,        cat: 'food',        img: IMG.kola      },
    { sid: sids[1], name: 'Large Smoked Mackerel Fish',        price: 5000,        cat: 'food',        img: IMG.smokedfish},
    { sid: sids[1], name: 'Banga Palm Soup Base (500ml)',      price: 2000,        cat: 'food',        img: IMG.banga     },

    // Stand 2 – Tech phones (Bamenda)
    { sid: sids[2], name: 'Samsung Galaxy A15 (New)',          price: 95000,       cat: 'electronics', img: IMG.samsung   },
    { sid: sids[2], name: 'iPhone 11 (UK Used, 64GB)',         price: 120000,      cat: 'electronics', img: IMG.iphone    },
    { sid: sids[2], name: 'Wireless Bluetooth Earbuds',        price: 15000,       cat: 'electronics', img: IMG.earbuds   },
    { sid: sids[2], name: 'Solar Power Bank 20000mAh',         price: 18000,       cat: 'electronics', img: IMG.powerbank },
    { sid: sids[2], name: 'HP 250 G8 Laptop (i5, 8GB RAM)',   price: 185000,      cat: 'electronics', img: IMG.laptop    },
    { sid: sids[2], name: 'iPhone 13 Pro Max 256GB',           price: 280000,      cat: 'electronics', img: IMG.iphone13  },

    // Stand 3 – Produce (Buea)
    { sid: sids[3], name: 'Fresh Plantains (Bundle of 12)',    price: 800,         cat: 'produce',     img: IMG.plantain  },
    { sid: sids[3], name: 'Waterleaf / Ndolé Base (Basket)',   price: 300,         cat: 'produce',     img: IMG.waterleaf },
    { sid: sids[3], name: 'Garden Eggs (1 Dozen)',             price: 600,         cat: 'produce',     img: IMG.garden    },
    { sid: sids[3], name: 'Ripe Avocados (6 Pieces)',          price: 1000,        cat: 'produce',     img: IMG.avocado   },

    // Stand 4 – Cars (Douala)
    { sid: sids[4], name: 'Toyota Camry 2018 (Used, AC)',      price: 8500000,     cat: 'general',     img: IMG.camry     },
    { sid: sids[4], name: 'Toyota Corolla 2020 (New)',         price: 12000000,    cat: 'general',     img: IMG.corolla   },
    { sid: sids[4], name: 'Honda CRV 2017 (UK Used)',          price: 9000000,     cat: 'general',     img: IMG.honda     },
    { sid: sids[4], name: 'Toyota Land Cruiser Prado 2019',    price: 22000000,    cat: 'general',     img: IMG.prado     },
    { sid: sids[4], name: 'Hyundai Sonata 2019 (Used)',        price: 7500000,     cat: 'general',     img: IMG.hyundai   },
    { sid: sids[4], name: 'Suzuki Alto 2021 (New)',            price: 4500000,     cat: 'general',     img: IMG.suzuki    },

    // Stand 5 – Furniture (Yaoundé)
    { sid: sids[5], name: '3+2+1 Sofa Set (Leather)',          price: 120000,      cat: 'home',        img: IMG.sofa      },
    { sid: sids[5], name: 'Queen Size Bed Frame + Headboard',  price: 85000,       cat: 'home',        img: IMG.bed       },
    { sid: sids[5], name: 'Dining Table (6 Seater, Wood)',     price: 95000,       cat: 'home',        img: IMG.dining    },
    { sid: sids[5], name: '4-Door Sliding Wardrobe',           price: 110000,      cat: 'home',        img: IMG.wardrobe  },
    { sid: sids[5], name: 'Study Desk + Bookshelf',            price: 35000,       cat: 'home',        img: IMG.desk      },
    { sid: sids[5], name: 'TV Entertainment Stand (120cm)',    price: 45000,       cat: 'home',        img: IMG.tvstand   },
    { sid: sids[5], name: 'Orthopedic Mattress (Queen)',       price: 55000,       cat: 'home',        img: IMG.mattress  },
    { sid: sids[5], name: '5-Tier Bookshelf / Display Unit',   price: 28000,       cat: 'home',        img: IMG.shelf     },

    // Stand 6 – Tech gadgets (Yaoundé)
    { sid: sids[6], name: 'MacBook Air M1 (256GB)',            price: 450000,      cat: 'electronics', img: IMG.macbook   },
    { sid: sids[6], name: 'iPad 9th Generation (Wi-Fi 64GB)', price: 155000,      cat: 'electronics', img: IMG.ipad      },
    { sid: sids[6], name: 'Samsung 43" 4K Smart TV',          price: 175000,      cat: 'electronics', img: IMG.tv        },
    { sid: sids[6], name: 'PlayStation 5 Console (New)',       price: 250000,      cat: 'electronics', img: IMG.ps5       },
    { sid: sids[6], name: 'Canon EOS M50 Camera Kit',         price: 210000,      cat: 'electronics', img: IMG.camera    },
    { sid: sids[6], name: 'DJI Mini 3 Drone (Fly More)',      price: 300000,      cat: 'electronics', img: IMG.drone     },
  ];

  for (const p of PRODUCTS) {
    await run(
      'INSERT INTO products (stand_id, product_name, price_cfa, category, image_path) VALUES (?,?,?,?,?)',
      [p.sid, p.name, p.price, p.cat, p.img]
    );
  }

  // Free hosted sample videos (Google Cloud public bucket)
  const BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
  const VID = {
    v1:  BASE + 'ForBiggerBlazes.mp4',
    v2:  BASE + 'ForBiggerEscapes.mp4',
    v3:  BASE + 'SubaruOutbackOnStreetAndDirt.mp4',
    v4:  BASE + 'WeAreGoingOnBullrun.mp4',
    v5:  BASE + 'VolkswagenGTIReview.mp4',
    v6:  BASE + 'ForBiggerJoyrides.mp4',
    v7:  BASE + 'ForBiggerFun.mp4',
    v8:  BASE + 'BigBuckBunny.mp4',
    v9:  BASE + 'ElephantsDream.mp4',
    v10: BASE + 'TearsOfSteel.mp4',
    v11: BASE + 'ForBiggerMeltdowns.mp4',
    v12: BASE + 'Sintel.mp4',
  };

  // ── Market Buzz posts (video only) ────────────────────────────────────
  const POSTS = [
    { uid: uids[0], sid: sids[0], title: '🎉 New Kaba Ngondo Collection — just arrived!',            desc: 'Fresh stock from our Yaoundé tailor. Sizes 36-54. DM to order before they sell out! Livraison à Douala, Yaoundé et Bamenda.', vid: VID.v1 },
    { uid: uids[1], sid: sids[1], title: '🍲 Secret to the PERFECT Ndolé — watch this!',             desc: 'Wash ndolé 7 times with coarse salt. Blend groundnuts silky-smooth. Sauté onions, fold in paste and smoked fish. Simmer 20 min. All ingredients available in my stand!', vid: VID.v2 },
    { uid: uids[2], sid: sids[2], title: '📱 Samsung Galaxy A15 — fresh batch in Bamenda!',          desc: '128GB, AMOLED display, 50MP camera. Original box, 12-month warranty. First 5 buyers get a FREE screen protector!', vid: VID.v3 },
    { uid: uids[3], sid: sids[3], title: '🌿 Morning harvest just dropped — come early!',             desc: 'Plantains, waterleaf, garden eggs and avocados picked this morning. Open 6am daily at Mile 17 Market near Total Station, Buea.', vid: VID.v4 },
    { uid: uids[4], sid: sids[4], title: '🚗 Toyota Land Cruiser Prado 2019 — live tour!',           desc: 'Full option, 7 seats, leather interior, panoramic sunroof. One owner. Price negotiable. Test drive at our Douala showroom — Bonanjo.', vid: VID.v5 },
    { uid: uids[5], sid: sids[5], title: '🛋️ 3+2+1 Leather Sofa Set — PRICE DROP this week!',       desc: 'Premium imported leather. Available in black, cream and brown. Was 150k — now 120,000 CFA! Free delivery within Yaoundé.', vid: VID.v6 },
    { uid: uids[2], sid: sids[6], title: '🎮 PlayStation 5 — unboxing in Yaoundé!',                  desc: 'Brand new PS5 with 2 controllers + FIFA 24. Sealed box, official warranty. Limited units — WhatsApp us to reserve yours now!', vid: VID.v7 },
    { uid: uids[1], sid: sids[1], title: '🌶️ Cameroon spice secrets — Njansang explained!',          desc: 'Njansang gives Ndolé its deep earthy flavour. Sourced directly from Bassa farmers. 100g packs available — perfect diaspora gift!', vid: VID.v8 },
    { uid: uids[2], sid: sids[6], title: '🚁 DJI Mini 3 Drone — flying over Yaoundé!',              desc: '4K video, 30-min flight time, obstacle avoidance. Perfect for real estate, weddings and content creation in Cameroon. Only 3 units left!', vid: VID.v9 },
    { uid: uids[4], sid: sids[4], title: '🚙 Test drive the Toyota Corolla 2020!',                   desc: 'Drive your dream car today. Brand new, full warranty, air conditioning. Financing available 12-36 months. Visit Fotso Motors Bonanjo, Douala.', vid: VID.v10 },
    { uid: uids[5], sid: sids[5], title: '🛏️ Complete bedroom setup tour — 220,000 CFA!',           desc: 'Queen bed + orthopedic mattress + 4-door wardrobe bundle. Free delivery and assembly in Yaoundé. Limited offer this month only!', vid: VID.v11 },
    { uid: uids[0], sid: sids[0], title: '🧣 African Fashion Week inspired collection 2024',          desc: 'Wax-print mini dresses inspired by Dakar Fashion Week. Bright colours, tailored fit. Custom sizes welcome — WhatsApp for measurements!', vid: VID.v12 },
  ];

  for (const p of POSTS) {
    await run(
      'INSERT INTO posts (user_id, stand_id, title, description, media_path, media_type) VALUES (?,?,?,?,?,?)',
      [p.uid, p.sid, p.title, p.desc, p.vid, 'video']
    );
  }

  console.log('✅  Seeded successfully:');
  console.log(`   ${USERS.length} users  •  ${STANDS.length} stands  •  ${PRODUCTS.length} products  •  ${POSTS.length} Market Buzz posts`);
  console.log('\n   Cities covered: Douala • Yaoundé • Bamenda • Buea');
  console.log('   Test login: josephine@etoh.cm / demo1234\n');
  db.close();
}

seed().catch((err) => { console.error(err); db.close(); });
