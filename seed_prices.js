require('dotenv').config();
const db = require('./database');

const reports = [
  // Tomates
  { item_name:'Tomates',        price_cfa:350,  unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Marie-Claire' },
  { item_name:'Tomates',        price_cfa:400,  unit:'kg',     market_name:'Marché Mokolo',        city:'Yaoundé',   reporter:'Pauline' },
  { item_name:'Tomates',        price_cfa:300,  unit:'kg',     market_name:'Marché B',             city:'Bamenda',   reporter:'Grace' },
  { item_name:'Tomates',        price_cfa:450,  unit:'kg',     market_name:'New-Bell Marché',      city:'Douala',    reporter:'Fatou' },
  { item_name:'Tomates',        price_cfa:380,  unit:'kg',     market_name:'Marché Mvog-Mbi',      city:'Yaoundé',   reporter:'Sandrine' },

  // Plantains
  { item_name:'Plantains',      price_cfa:1500, unit:'régime', market_name:'Marché Central',      city:'Douala',    reporter:'Joseph' },
  { item_name:'Plantains',      price_cfa:2000, unit:'régime', market_name:'Marché Mfoundi',       city:'Yaoundé',   reporter:'Patrick' },
  { item_name:'Plantains',      price_cfa:1200, unit:'régime', market_name:'Marché B',             city:'Bamenda',   reporter:'Emmanuel' },
  { item_name:'Plantains',      price_cfa:1800, unit:'régime', market_name:'Marché Bonamoussadi',  city:'Douala',    reporter:'Cécile' },
  { item_name:'Plantains',      price_cfa:2200, unit:'régime', market_name:'Marché de Bafoussam',  city:'Bafoussam', reporter:'Rodrigue' },

  // Huile de palme
  { item_name:'Huile de palme', price_cfa:900,  unit:'litre',  market_name:'Marché Central',      city:'Douala',    reporter:'Martine' },
  { item_name:'Huile de palme', price_cfa:1000, unit:'litre',  market_name:'Marché Mokolo',        city:'Yaoundé',   reporter:'Sylvie' },
  { item_name:'Huile de palme', price_cfa:850,  unit:'litre',  market_name:'Marché B',             city:'Bamenda',   reporter:'Alice' },
  { item_name:'Huile de palme', price_cfa:950,  unit:'litre',  market_name:'Marché Kumba',         city:'Buea',      reporter:'Rose' },

  // Riz blanc
  { item_name:'Riz blanc',      price_cfa:600,  unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Jean-Paul' },
  { item_name:'Riz blanc',      price_cfa:650,  unit:'kg',     market_name:'Marché Mvog-Mbi',      city:'Yaoundé',   reporter:'Michel' },
  { item_name:'Riz blanc',      price_cfa:580,  unit:'kg',     market_name:'Marché de Limbé',      city:'Limbe',     reporter:'Samuel' },
  { item_name:'Riz blanc',      price_cfa:700,  unit:'kg',     market_name:'Marché de Bafoussam',  city:'Bafoussam', reporter:'Thierry' },

  // Ndolé
  { item_name:'Ndolé',          price_cfa:350,  unit:'bottes', market_name:'Marché Central',      city:'Douala',    reporter:'Brigitte' },
  { item_name:'Ndolé',          price_cfa:400,  unit:'bottes', market_name:'Marché Mfoundi',       city:'Yaoundé',   reporter:'Véronique' },
  { item_name:'Ndolé',          price_cfa:300,  unit:'bottes', market_name:'Marché de Kribi',      city:'Kribi',     reporter:'Isabelle' },
  { item_name:'Ndolé',          price_cfa:450,  unit:'bottes', market_name:'New-Bell Marché',      city:'Douala',    reporter:'Nadine' },

  // Bœuf
  { item_name:'Bœuf',           price_cfa:3500, unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Alain' },
  { item_name:'Bœuf',           price_cfa:3800, unit:'kg',     market_name:'Marché Mokolo',        city:'Yaoundé',   reporter:'Robert' },
  { item_name:'Bœuf',           price_cfa:3200, unit:'kg',     market_name:'Marché B',             city:'Bamenda',   reporter:'Denis' },
  { item_name:'Bœuf',           price_cfa:4000, unit:'kg',     market_name:'Marché de Bafoussam',  city:'Bafoussam', reporter:'François' },

  // Poulet entier
  { item_name:'Poulet entier',  price_cfa:2800, unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Hélène' },
  { item_name:'Poulet entier',  price_cfa:3000, unit:'kg',     market_name:'Marché Mvog-Mbi',      city:'Yaoundé',   reporter:'Claire' },
  { item_name:'Poulet entier',  price_cfa:2600, unit:'kg',     market_name:'Marché Kumba',         city:'Buea',      reporter:'Christine' },
  { item_name:'Poulet entier',  price_cfa:3200, unit:'kg',     market_name:'Marché de Kribi',      city:'Kribi',     reporter:'Monique' },

  // Poisson fumé
  { item_name:'Poisson fumé',   price_cfa:2500, unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Alphonse' },
  { item_name:'Poisson fumé',   price_cfa:2800, unit:'kg',     market_name:'Marché Mfoundi',       city:'Yaoundé',   reporter:'Victor' },
  { item_name:'Poisson fumé',   price_cfa:2200, unit:'kg',     market_name:'Marché de Kribi',      city:'Kribi',     reporter:'Georges' },
  { item_name:'Poisson fumé',   price_cfa:3000, unit:'kg',     market_name:'Marché de Limbé',      city:'Limbe',     reporter:'Ernest' },

  // Manioc
  { item_name:'Manioc',         price_cfa:250,  unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Élise' },
  { item_name:'Manioc',         price_cfa:300,  unit:'kg',     market_name:'Marché Mokolo',        city:'Yaoundé',   reporter:'Anne' },
  { item_name:'Manioc',         price_cfa:200,  unit:'kg',     market_name:'Marché B',             city:'Bamenda',   reporter:'Bénédicte' },
  { item_name:'Manioc',         price_cfa:280,  unit:'kg',     market_name:'Marché de Bafoussam',  city:'Bafoussam', reporter:'Colette' },

  // Haricots
  { item_name:'Haricots',       price_cfa:750,  unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Gilles' },
  { item_name:'Haricots',       price_cfa:800,  unit:'kg',     market_name:'Marché Mvog-Mbi',      city:'Yaoundé',   reporter:'Henri' },
  { item_name:'Haricots',       price_cfa:700,  unit:'kg',     market_name:'Marché B',             city:'Bamenda',   reporter:'Isaac' },
  { item_name:'Haricots',       price_cfa:850,  unit:'kg',     market_name:'Marché de Limbé',      city:'Limbe',     reporter:'Jules' },

  // Piment rouge
  { item_name:'Piment rouge',   price_cfa:300,  unit:'bottes', market_name:'Marché Central',      city:'Douala',    reporter:'Laurence' },
  { item_name:'Piment rouge',   price_cfa:350,  unit:'bottes', market_name:'Marché Mokolo',        city:'Yaoundé',   reporter:'Marcelle' },
  { item_name:'Piment rouge',   price_cfa:250,  unit:'bottes', market_name:'Marché de Kribi',      city:'Kribi',     reporter:'Nicole' },
  { item_name:'Piment rouge',   price_cfa:400,  unit:'bottes', market_name:'Marché de Bafoussam',  city:'Bafoussam', reporter:'Odette' },

  // Gombo
  { item_name:'Gombo',          price_cfa:500,  unit:'kg',     market_name:'Marché Central',      city:'Douala',    reporter:'Pélagie' },
  { item_name:'Gombo',          price_cfa:600,  unit:'kg',     market_name:'Marché Mfoundi',       city:'Yaoundé',   reporter:'Rosalie' },
  { item_name:'Gombo',          price_cfa:450,  unit:'kg',     market_name:'Marché B',             city:'Bamenda',   reporter:'Suzanne' },
  { item_name:'Gombo',          price_cfa:550,  unit:'kg',     market_name:'Marché de Limbé',      city:'Limbe',     reporter:'Thérèse' },
];

db.serialize(() => {
  const stmt = db.prepare(
    `INSERT INTO price_reports (item_name, price_cfa, unit, market_name, city, reporter, reported_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' minutes'))`
  );

  reports.forEach((r, i) => {
    const minsAgo = Math.floor(Math.random() * 360); // within last 6 hours
    stmt.run(r.item_name, r.price_cfa, r.unit, r.market_name, r.city, r.reporter, minsAgo, (err) => {
      if (err) console.error('Error inserting:', r.item_name, err.message);
    });
  });

  stmt.finalize(() => {
    console.log(`✅ Seeded ${reports.length} price reports across ${[...new Set(reports.map(r=>r.city))].length} cities.`);
    db.close();
  });
});
