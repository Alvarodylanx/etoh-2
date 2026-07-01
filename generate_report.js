/* ═══════════════════════════════════════════════════════════
   ETOH Market — BTech Report  (LMUI 2025/2026)
   Professional SVG diagrams via @resvg/resvg-js
═══════════════════════════════════════════════════════════ */
const { Resvg }    = require('@resvg/resvg-js');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType,
  PageBreak, Table, TableRow, TableCell, WidthType, ShadingType,
} = require('docx');
const fs = require('fs');

/* ── convert SVG string → PNG Buffer ────────────────────── */
function png(svgStr, renderW) {
  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: renderW || 900 },
    font: { loadSystemFonts: true },
  });
  return Buffer.from(resvg.render().asPng());
}

/* ── embed image centred in paragraph ─────────────────────*/
function imgP(buf, w, h) {
  return new Paragraph({
    children: [new ImageRun({ data: buf, transformation: { width: w, height: h } })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
  });
}

/* ── doc helpers ───────────────────────────────────────── */
const F  = 'Times New Roman';
const SZ = 24;
const LN = { line: 360, lineRule: 'auto' };
const SP = { ...LN, after: 200 };
const J  = AlignmentType.JUSTIFIED;
const C  = AlignmentType.CENTER;
const L  = AlignmentType.LEFT;
const CM = Math.round(2.5 / 2.54 * 1440);

const p   = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ})], spacing:SP, alignment:J });
const pc  = (t,b=false) => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,bold:b})], spacing:SP, alignment:C });
const pl  = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ})], spacing:{...LN,after:80}, alignment:L });
const bi  = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ})], bullet:{level:0}, spacing:{...LN,after:100} });
const br  = () => new Paragraph({ text:'', spacing:{line:240,after:60} });
const pb  = () => new Paragraph({ children:[new PageBreak()] });
const chap = t => new Paragraph({ children:[new TextRun({text:t.toUpperCase(),font:F,size:SZ,bold:true})], spacing:{...LN,before:480,after:320}, alignment:C });
const h2  = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,bold:true})], spacing:{...LN,before:320,after:160}, alignment:J });
const h3  = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,bold:true})], spacing:{...LN,before:240,after:100}, alignment:J });
const cap = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,italics:true})], spacing:{...LN,before:40,after:260}, alignment:C });
const tblcap = t => new Paragraph({ children:[new TextRun({text:t,font:F,size:SZ,bold:true})], spacing:{...LN,before:120,after:80}, alignment:C });

const tbl = rows => new Table({
  width:{size:100,type:WidthType.PERCENTAGE},
  rows: rows.map(([a,b],i) => new TableRow({
    children:[
      new TableCell({ width:{size:35,type:WidthType.PERCENTAGE}, margins:{top:60,bottom:60,left:100,right:100},
        shading:i===0?{type:ShadingType.SOLID,color:'d0d0d0',fill:'d0d0d0'}:undefined,
        children:[new Paragraph({children:[new TextRun({text:a,font:F,size:SZ,bold:i===0})],spacing:LN,alignment:L})],
      }),
      new TableCell({ width:{size:65,type:WidthType.PERCENTAGE}, margins:{top:60,bottom:60,left:100,right:100},
        shading:i===0?{type:ShadingType.SOLID,color:'d0d0d0',fill:'d0d0d0'}:undefined,
        children:[new Paragraph({children:[new TextRun({text:b,font:F,size:SZ,bold:i===0})],spacing:LN,alignment:J})],
      }),
    ],
  })),
});

const tbl4 = (headers,rows) => new Table({
  width:{size:100,type:WidthType.PERCENTAGE},
  rows:[
    new TableRow({ children:headers.map(h=>new TableCell({ margins:{top:60,bottom:60,left:80,right:80},
      shading:{type:ShadingType.SOLID,color:'d0d0d0',fill:'d0d0d0'},
      children:[new Paragraph({children:[new TextRun({text:h,font:F,size:20,bold:true})],spacing:LN,alignment:C})],
    }))}),
    ...rows.map(row=>new TableRow({ children:row.map(cell=>new TableCell({ margins:{top:60,bottom:60,left:80,right:80},
      children:[new Paragraph({children:[new TextRun({text:cell,font:F,size:20})],spacing:LN,alignment:J})],
    }))})),
  ],
});

/* ═══════════════════════════════════════════════════════════
   SVG DIAGRAM HELPERS
═══════════════════════════════════════════════════════════ */

const DEFS = `<defs>
<marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  <polygon points="0 0,10 3.5,0 7" fill="#374151"/>
</marker>
<marker id="arrB" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  <polygon points="0 0,10 3.5,0 7" fill="#2563EB"/>
</marker>
<marker id="arrD" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  <polygon points="0 0,10 3.5,0 7" fill="#94A3B8"/>
</marker>
</defs>`;

/* ── entity box for ER diagram ─────────────────────────── */
function entityBox(x, y, w, name, hc, attrs) {
  const rh = 17, hh = 27;
  const h  = hh + attrs.length * rh + 6;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white" stroke="#CBD5E1" stroke-width="1.5" rx="3"/>
<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${hc}" rx="3"/>
<rect x="${x}" y="${y+16}" width="${w}" height="${hh-16}" fill="${hc}"/>
<text x="${x+w/2}" y="${y+18}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="white">${name}</text>`;
  attrs.forEach((a, i) => {
    const ay = y + hh + i * rh;
    const bg = i%2===0 ? '#F8FAFC' : 'white';
    const isPK = a.startsWith('PK ');
    const isFK = a.startsWith('FK ');
    const label = isPK ? '▸ '+a.slice(3) : isFK ? '◈ '+a.slice(3) : '   '+a;
    const fc    = isPK ? '#1D4ED8' : isFK ? '#6D28D9' : '#374151';
    const fw    = (isPK||isFK) ? 'bold' : 'normal';
    s += `<rect x="${x}" y="${ay}" width="${w}" height="${rh}" fill="${bg}"/>
<text x="${x+6}" y="${ay+12}" font-family="Arial,sans-serif" font-size="9.5" font-weight="${fw}" fill="${fc}">${label}</text>`;
  });
  return s + `<rect x="${x}" y="${y+h-1}" width="${w}" height="1" fill="#CBD5E1"/>`;
}

/* ── stick figure for use case diagram ─────────────────── */
function actor(cx, cy, name) {
  return `<circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="#1E3A5F" stroke-width="2"/>
<line x1="${cx}" y1="${cy+13}" x2="${cx}" y2="${cy+48}" stroke="#1E3A5F" stroke-width="2"/>
<line x1="${cx-17}" y1="${cy+26}" x2="${cx+17}" y2="${cy+26}" stroke="#1E3A5F" stroke-width="2"/>
<line x1="${cx}" y1="${cy+48}" x2="${cx-13}" y2="${cy+70}" stroke="#1E3A5F" stroke-width="2"/>
<line x1="${cx}" y1="${cy+48}" x2="${cx+13}" y2="${cy+70}" stroke="#1E3A5F" stroke-width="2"/>
<text x="${cx}" y="${cy+86}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#1E3A5F">${name}</text>`;
}

/* ── use case oval ─────────────────────────────────────── */
function useCase(cx, cy, rx, text, text2='') {
  const t2 = text2 ? `<text x="${cx}" y="${cy+12}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#1E3A5F">${text2}</text>` : '';
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="18" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.5"/>
<text x="${cx}" y="${cy+(text2?-3:4)}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#1E3A5F">${text}</text>${t2}`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 1 — SYSTEM ARCHITECTURE  (900 × 490)
═══════════════════════════════════════════════════════════ */
function architectureSVG() {
  return `<svg width="900" height="490" xmlns="http://www.w3.org/2000/svg">${DEFS}
<rect width="900" height="490" fill="#F8FAFC"/>
<text x="450" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#1E3A5F">ETOH Market — Three-Tier System Architecture</text>

<!-- PRESENTATION TIER -->
<rect x="50" y="42" width="800" height="100" rx="8" fill="#DBEAFE" stroke="#2563EB" stroke-width="2"/>
<rect x="50" y="42" width="800" height="28" rx="8" fill="#2563EB"/>
<rect x="50" y="58" width="800" height="12" fill="#2563EB"/>
<text x="450" y="61" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white">PRESENTATION TIER — Browser</text>
<text x="450" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#1E40AF">React 18 + Vite SPA</text>
<text x="450" y="108" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">React Router DOM · Axios · AuthContext (JWT) · LanguageContext (EN/FR)</text>
<text x="450" y="126" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">Pages: Home · Stands · Products · Market Buzz · Prix du Marché · Je Cherche · Admin</text>

<!-- arrow down -->
<line x1="450" y1="142" x2="450" y2="187" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<rect x="300" y="148" width="300" height="18" rx="3" fill="white" stroke="#CBD5E1" stroke-width="1" opacity="0.9"/>
<text x="450" y="161" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#374151">HTTP Requests + JWT Bearer Token</text>

<!-- APPLICATION TIER -->
<rect x="50" y="192" width="800" height="108" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="2"/>
<rect x="50" y="192" width="800" height="28" rx="8" fill="#16A34A"/>
<rect x="50" y="208" width="800" height="12" fill="#16A34A"/>
<text x="450" y="211" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white">APPLICATION TIER — Server</text>
<text x="450" y="242" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#14532D">Node.js 18 + Express.js 4</text>
<text x="450" y="259" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">/api/auth  /api/stands  /api/products  /api/orders  /api/posts</text>
<text x="450" y="275" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">/api/prices  /api/wanted  /api/ai  /api/admin</text>
<text x="450" y="291" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">Middleware: requireAuth · adminAuth · multer (image / video / audio uploads)</text>

<!-- arrows down -->
<line x1="220" y1="300" x2="185" y2="352" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="105" y="332" font-family="Arial,sans-serif" font-size="10" fill="#374151">SQL Queries</text>
<line x1="680" y1="300" x2="715" y2="352" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="685" y="332" font-family="Arial,sans-serif" font-size="10" fill="#374151">HTTPS / API</text>

<!-- DATA TIER -->
<rect x="50" y="357" width="370" height="105" rx="8" fill="#FEF9C3" stroke="#D97706" stroke-width="2"/>
<rect x="50" y="357" width="370" height="28" rx="8" fill="#D97706"/>
<rect x="50" y="373" width="370" height="12" fill="#D97706"/>
<text x="235" y="376" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white">DATA TIER</text>
<text x="235" y="407" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#451A03">SQLite — etoh.db</text>
<text x="235" y="424" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">users · stands · products · orders</text>
<text x="235" y="441" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">posts · price_reports · wanted_posts</text>
<text x="235" y="456" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#92400E">7 tables · file-based · no separate server</text>

<!-- GEMINI -->
<rect x="480" y="357" width="370" height="105" rx="8" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
<rect x="480" y="357" width="370" height="28" rx="8" fill="#7C3AED"/>
<rect x="480" y="373" width="370" height="12" fill="#7C3AED"/>
<text x="665" y="376" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white">EXTERNAL SERVICE</text>
<text x="665" y="407" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#2E1065">Google Gemini API</text>
<text x="665" y="424" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">Model: gemini-2.5-flash</text>
<text x="665" y="441" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#374151">AI Chat Assistant · Market Guidance</text>
<text x="665" y="456" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#6D28D9">Called only when GEMINI_API_KEY is set</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 2 — ER DIAGRAM  (970 × 660)
═══════════════════════════════════════════════════════════ */
function erDiagramSVG() {
  const eb = entityBox;
  // Row 1
  const usersBox    = eb(15,  55, 192, 'USERS',         '#1E40AF', ['PK id','name','email','password_hash','whatsapp','bio','created_at']);
  const standsBox   = eb(382, 55, 200, 'STANDS',        '#065F46', ['PK id','FK user_id','vendor_name','phone_number','city','is_verified','availability']);
  const productsBox = eb(748, 55, 200, 'PRODUCTS',      '#7C2D12', ['PK id','FK stand_id','product_name','price_cfa','category','image_path','audio_path']);
  // Row 2
  const postsBox    = eb(382,285, 200, 'POSTS',         '#5B21B6', ['PK id','FK stand_id','FK user_id','video_path','title','likes_count']);
  const ordersBox   = eb(748,285, 200, 'ORDERS',        '#164E63', ['PK id','FK product_id','buyer_name','target_city','quarter','landmark','status']);
  // Row 3
  const pricesBox   = eb(15, 492, 192, 'PRICE_REPORTS', '#92400E', ['PK id','item_name','price_cfa','city','reported_at']);
  const wantedBox   = eb(748,492, 200, 'WANTED_POSTS',  '#1F2937', ['PK id','poster_name','description','city','whatsapp','expires_at']);

  return `<svg width="970" height="660" xmlns="http://www.w3.org/2000/svg">${DEFS}
<rect width="970" height="660" fill="#F8FAFC"/>
<text x="485" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#1E3A5F">ETOH Market — Entity-Relationship Diagram</text>
<text x="485" y="46" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#64748B">▸ = Primary Key    ◈ = Foreign Key</text>

${usersBox}${standsBox}${productsBox}${postsBox}${ordersBox}${pricesBox}${wantedBox}

<!-- USERS → STANDS  1:N -->
<line x1="207" y1="137" x2="382" y2="137" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="215" y="130" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">1</text>
<text x="360" y="130" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">N</text>

<!-- STANDS → PRODUCTS  1:N -->
<line x1="582" y1="137" x2="748" y2="137" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="590" y="130" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">1</text>
<text x="727" y="130" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">N</text>

<!-- STANDS → POSTS  1:N -->
<line x1="482" y1="222" x2="482" y2="285" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="488" y="241" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">1</text>
<text x="488" y="274" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">N</text>

<!-- PRODUCTS → ORDERS  1:N -->
<line x1="848" y1="222" x2="848" y2="285" stroke="#374151" stroke-width="2" marker-end="url(#arr)"/>
<text x="854" y="241" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">1</text>
<text x="854" y="274" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#374151">N</text>

<!-- Labels: independent tables -->
<rect x="230" y="510" width="470" height="22" rx="4" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1"/>
<text x="465" y="525" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#64748B">PRICE_REPORTS and WANTED_POSTS are independent — no foreign key relationships</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 3 — USE CASE DIAGRAM  (950 × 570)
═══════════════════════════════════════════════════════════ */
function useCaseSVG() {
  const uc = useCase;
  const ac = actor;

  // Guest use cases (column left, y 80-360)
  const gUCs = [
    [305,  90, 85, 'Browse Products'],
    [305, 140, 85, 'View Stand &amp; Product'],
    [305, 190, 85, 'Contact Seller', '(Safety Gate)'],
    [305, 245, 85, 'Place Delivery Order'],
    [305, 300, 85, 'Submit Price Report'],
    [305, 350, 85, 'Post Je Cherche'],
  ];
  // Registered-only use cases (column mid, y 80-330)
  const rUCs = [
    [530, 105, 75, 'Register / Login'],
    [530, 170, 75, 'Create &amp; Manage Stand'],
    [530, 235, 75, 'Add / Delete Products'],
    [530, 295, 75, 'Post Market Buzz Reel'],
    [530, 355, 75, 'Use AI Chat Assistant'],
  ];
  // Admin use cases (column right, y 150-420)
  const aUCs = [
    [760, 145, 75, 'Manage All Content', '(CRUD)'],
    [760, 220, 75, 'Verify Vendor Badge'],
    [760, 290, 75, 'View Dashboard Stats'],
    [760, 355, 75, 'Update Order Status'],
  ];

  const ucSVG = [...gUCs,...rUCs,...aUCs].map(a => uc(...a)).join('');

  // Lines: Guest → gUCs
  const gLines = gUCs.map(([cx,cy]) =>
    `<line x1="110" y1="195" x2="${cx-85}" y2="${cy}" stroke="#94A3B8" stroke-width="1"/>`
  ).join('');

  // Lines: Registered → all gUCs + rUCs
  const rLines = [...gUCs,...rUCs].map(([cx,cy]) =>
    `<line x1="110" y1="380" x2="${cx-85}" y2="${cy}" stroke="#94A3B8" stroke-width="1"/>`
  ).join('');

  // Lines: Admin → aUCs
  const aLines = aUCs.map(([cx,cy]) =>
    `<line x1="870" y1="295" x2="${cx+75}" y2="${cy}" stroke="#94A3B8" stroke-width="1"/>`
  ).join('');

  return `<svg width="950" height="570" xmlns="http://www.w3.org/2000/svg">
<rect width="950" height="570" fill="#F8FAFC"/>
<text x="475" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="#1E3A5F">ETOH Market — Use Case Diagram</text>

<!-- System boundary -->
<rect x="195" y="50" width="590" height="500" fill="none" stroke="#374151" stroke-width="1.5" stroke-dasharray="8,5" rx="6"/>
<text x="490" y="70" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#374151">«system» ETOH Market</text>

<!-- Column separators (light) -->
<line x1="415" y1="75" x2="415" y2="540" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="640" y1="75" x2="640" y2="540" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4,4"/>

<!-- Column labels -->
<text x="307" y="84" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#6B7280">Guest + Registered</text>
<text x="530" y="84" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#6B7280">Registered only</text>
<text x="757" y="84" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#6B7280">Admin only</text>

<!-- Connection lines (drawn before shapes so shapes appear on top) -->
${gLines}${rLines}${aLines}

<!-- Use cases -->
${ucSVG}

<!-- Actors -->
${ac(75, 122, 'Guest')}
<text x="75" y="211" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="#64748B">Unauthenticated</text>
${ac(75, 320, 'Registered User')}
<text x="75" y="409" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="#64748B">Authenticated</text>
${ac(875, 225, 'Admin')}
<text x="875" y="314" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="#64748B">Admin key</text>

<!-- extends arrow: Registered extends Guest -->
<line x1="90" y1="330" x2="90" y2="210" stroke="#374151" stroke-width="1" stroke-dasharray="5,3" marker-end="url(#arr)"/>
<rect x="3" y="258" width="74" height="18" rx="3" fill="#FEF9C3" stroke="#D97706" stroke-width="1"/>
<text x="40" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#92400E">«extends»</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 4 — SEQUENCE: USER LOGIN  (900 × 440)
═══════════════════════════════════════════════════════════ */
function seqLoginSVG() {
  const lanes = ['Browser', 'React\n(AuthContext)', 'Express\n(auth.js)', 'SQLite\n(etoh.db)'];
  const W = 900, msgTop = 105, msgH = 36;
  const lw = (W - 80) / lanes.length;
  const lx = i => 40 + i * lw + lw / 2;

  const steps = [
    { f:0, t:1, txt:'1. Submit login form {email, password}' },
    { f:1, t:2, txt:'2. POST /api/auth/login' },
    { f:2, t:3, txt:'3. SELECT * FROM users WHERE email = ?' },
    { f:3, t:2, txt:'4. user record (or null)', ret:true },
    { f:2, t:2, txt:'5. bcrypt.compare(password, hash)', self:true },
    { f:2, t:2, txt:'6. jwt.sign({id,email,name}, secret, "7d")', self:true },
    { f:2, t:1, txt:'7. HTTP 200 {token, user}  |  HTTP 401 error', ret:true },
    { f:1, t:1, txt:'8. Save token to localStorage, update AuthContext', self:true },
    { f:1, t:0, txt:'9. Redirect to homepage', ret:true },
  ];

  let lifeLines = '';
  lanes.forEach((name, i) => {
    const cx = lx(i);
    const rows = name.split('\n');
    lifeLines += `<rect x="${cx-lw/2+6}" y="35" width="${lw-12}" height="36" rx="5" fill="#1E40AF" stroke="#1E3A5F" stroke-width="1"/>`;
    rows.forEach((row, ri) => {
      lifeLines += `<text x="${cx}" y="${48 + ri*14}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${lw>150?10.5:9}" font-weight="bold" fill="white">${row}</text>`;
    });
    lifeLines += `<line x1="${cx}" y1="71" x2="${cx}" y2="420" stroke="#94A3B8" stroke-width="1" stroke-dasharray="5,4"/>`;
  });

  let arrows = '';
  steps.forEach((s, idx) => {
    const y = msgTop + idx * msgH;
    const x1 = lx(s.f), x2 = lx(s.t);
    const isDash = !!s.ret;
    const clr = s.ret ? '#94A3B8' : '#1E3A5F';
    const arrId = s.ret ? 'arrD' : 'arr';
    const sw = s.ret ? 1.5 : 2;
    const da = s.ret ? 'stroke-dasharray="6,4"' : '';
    if (s.self) {
      arrows += `<path d="M${x1} ${y} C${x1+45} ${y},${x1+45} ${y+18},${x1} ${y+18}" fill="none" stroke="${clr}" stroke-width="1.5" ${da} marker-end="url(#${arrId})"/>`;
      arrows += `<text x="${x1+50}" y="${y+12}" font-family="Arial,sans-serif" font-size="9" fill="#374151">${s.txt}</text>`;
    } else {
      const dir = x2 > x1 ? -10 : 10;
      arrows += `<line x1="${x1}" y1="${y}" x2="${x2+dir}" y2="${y}" stroke="${clr}" stroke-width="${sw}" ${da} marker-end="url(#${arrId})"/>`;
      const mx = (x1+x2)/2;
      arrows += `<rect x="${mx-85}" y="${y-16}" width="170" height="14" rx="2" fill="white" opacity="0.85"/>`;
      arrows += `<text x="${mx}" y="${y-5}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="${clr}">${s.txt}</text>`;
    }
    // activation box
    arrows += `<rect x="${lx(s.f)-4}" y="${y-2}" width="8" height="18" fill="${s.ret?'#E2E8F0':'#BFDBFE'}" stroke="#93C5FD" stroke-width="0.5"/>`;
  });

  return `<svg width="${W}" height="440" xmlns="http://www.w3.org/2000/svg">${DEFS}
<rect width="${W}" height="440" fill="#FAFAFA"/>
<text x="${W/2}" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#1E3A5F">Sequence Diagram — User Login</text>
${lifeLines}${arrows}
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 5 — SEQUENCE: ADD PRODUCT  (950 × 450)
═══════════════════════════════════════════════════════════ */
function seqProductSVG() {
  const lanes = ['Browser', 'React', 'requireAuth\nMiddleware', 'multer\nMiddleware', 'Express\n(products.js)', 'SQLite'];
  const W = 950, msgTop = 110, msgH = 32;
  const lw = (W - 60) / lanes.length;
  const lx = i => 30 + i * lw + lw / 2;

  const steps = [
    { f:0, t:1, txt:'1. Submit Add Product form (multipart/form-data)' },
    { f:1, t:2, txt:'2. POST /api/products  Authorization: Bearer {JWT}' },
    { f:2, t:2, txt:'3. jwt.verify(token) → attach req.user', self:true },
    { f:2, t:3, txt:'4. Pass to multer' },
    { f:3, t:3, txt:'5. Save files to /uploads/ (unique filenames)', self:true },
    { f:3, t:4, txt:'6. req.files (paths) + req.body + req.user' },
    { f:4, t:5, txt:'7. SELECT user_id FROM stands WHERE id = ?' },
    { f:5, t:4, txt:'8. stand row', ret:true },
    { f:4, t:4, txt:'9. Check req.user.id === stand.user_id', self:true },
    { f:4, t:5, txt:'10. INSERT INTO products VALUES (...)' },
    { f:5, t:4, txt:'11. new product row', ret:true },
    { f:4, t:1, txt:'12. HTTP 201 {product}', ret:true },
    { f:1, t:0, txt:'13. Show success, navigate to stand page', ret:true },
  ];

  let ll = '';
  lanes.forEach((name, i) => {
    const cx = lx(i);
    const rows = name.split('\n');
    ll += `<rect x="${cx-lw/2+4}" y="35" width="${lw-8}" height="38" rx="4" fill="#065F46" stroke="#064E3B" stroke-width="1"/>`;
    rows.forEach((row, ri) => {
      ll += `<text x="${cx}" y="${50 + ri*14}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="bold" fill="white">${row}</text>`;
    });
    ll += `<line x1="${cx}" y1="73" x2="${cx}" y2="430" stroke="#94A3B8" stroke-width="1" stroke-dasharray="5,4"/>`;
  });

  let arrows = '';
  steps.forEach((s, idx) => {
    const y = msgTop + idx * msgH;
    const x1 = lx(s.f), x2 = lx(s.t);
    const clr = s.ret ? '#94A3B8' : '#1E3A5F';
    const da = s.ret ? 'stroke-dasharray="6,4"' : '';
    const arrId = s.ret ? 'arrD' : 'arr';
    if (s.self) {
      arrows += `<path d="M${x1} ${y} C${x1+40} ${y},${x1+40} ${y+16},${x1} ${y+16}" fill="none" stroke="${clr}" stroke-width="1.5" ${da} marker-end="url(#${arrId})"/>`;
      arrows += `<text x="${x1+44}" y="${y+11}" font-family="Arial,sans-serif" font-size="8.5" fill="#374151">${s.txt}</text>`;
    } else {
      const dir = x2 > x1 ? -10 : 10;
      arrows += `<line x1="${x1}" y1="${y}" x2="${x2+dir}" y2="${y}" stroke="${clr}" stroke-width="${s.ret?1.5:1.8}" ${da} marker-end="url(#${arrId})"/>`;
      const mx = (x1+x2)/2;
      const tw = Math.abs(x2-x1) - 20;
      arrows += `<rect x="${mx-tw/2}" y="${y-14}" width="${tw}" height="13" rx="2" fill="white" opacity="0.85"/>`;
      arrows += `<text x="${mx}" y="${y-4}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="${clr}">${s.txt}</text>`;
    }
    arrows += `<rect x="${lx(s.f)-3}" y="${y-2}" width="6" height="14" fill="${s.ret?'#E2E8F0':'#A7F3D0'}" stroke="#6EE7B7" stroke-width="0.5"/>`;
  });

  return `<svg width="${W}" height="450" xmlns="http://www.w3.org/2000/svg">${DEFS}
<rect width="${W}" height="450" fill="#FAFAFA"/>
<text x="${W/2}" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#1E3A5F">Sequence Diagram — Add Product</text>
${ll}${arrows}
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   DIAGRAM 6 — ACTIVITY: BUYER FLOW  (580 × 720)
═══════════════════════════════════════════════════════════ */
function activitySVG() {
  const cx = 290;   // centre x
  const aw = 200;   // activity box width
  const ah = 28;    // activity box height
  const ax = cx - aw/2;

  // Helper: activity node
  const act = (y, txt, clr='#DBEAFE', bclr='#3B82F6') =>
    `<rect x="${ax}" y="${y}" width="${aw}" height="${ah}" rx="12" fill="${clr}" stroke="${bclr}" stroke-width="1.5"/>
<text x="${cx}" y="${y+17}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#1E3A5F">${txt}</text>`;

  // Helper: decision diamond
  const dec = (y, txt) => {
    const dw=160, dh=34;
    return `<polygon points="${cx},${y} ${cx+dw/2},${y+dh/2} ${cx},${y+dh} ${cx-dw/2},${y+dh/2}" fill="#FEF9C3" stroke="#D97706" stroke-width="1.5"/>
<text x="${cx}" y="${y+dh/2+4}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" font-weight="bold" fill="#78350F">${txt}</text>`;
  };

  // Helper: merge (small black diamond)
  const merge = y => `<polygon points="${cx},${y-7} ${cx+7},${y} ${cx},${y+7} ${cx-7},${y}" fill="#374151"/>`;

  // Helper: straight arrow down
  const arrd = (y1,y2) => `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2-8}" stroke="#374151" stroke-width="1.5" marker-end="url(#arr)"/>`;

  // YES/NO labels
  const yn = (x,y,t) => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="#374151">${t}</text>`;

  return `<svg width="580" height="720" xmlns="http://www.w3.org/2000/svg">${DEFS}
<rect width="580" height="720" fill="#FAFAFA"/>
<text x="290" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#1E3A5F">Activity Diagram — Buyer Flow</text>

<!-- START -->
<circle cx="${cx}" cy="48" r="12" fill="#1E3A5F"/>
${arrd(60,78)}

<!-- Open ETOH Market -->
${act(78,'Open ETOH Market')}
${arrd(106,128)}

<!-- Decision: Apply filter? -->
${dec(128,'Apply city / category filter?')}
<!-- YES branch right -->
<line x1="${cx+80}" y1="145" x2="${cx+115}" y2="145" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+115}" y1="145" x2="${cx+115}" y2="175" stroke="#374151" stroke-width="1.5"/>
<rect x="${cx+120}" y="162" width="130" height="24" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.2"/>
<text x="${cx+185}" y="178" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#14532D">Filtered results shown</text>
<line x1="${cx+185}" y1="186" x2="${cx+185}" y2="204" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+185}" y1="204" x2="${cx}" y2="204" stroke="#374151" stroke-width="1.5"/>
${yn(cx+82,140,'Yes')}
<!-- NO: straight down -->
${yn(cx-60,178,'No')}
${arrd(162,200)}
${merge(204)}

<!-- Search text? -->
${arrd(211,228)}
${dec(228,'Search for product?')}
${yn(cx+82,245,'Yes')}
<line x1="${cx+80}" y1="245" x2="${cx+115}" y2="245" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+115}" y1="245" x2="${cx+115}" y2="267" stroke="#374151" stroke-width="1.5"/>
<rect x="${cx+120}" y="256" width="130" height="24" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.2"/>
<text x="${cx+185}" y="272" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#14532D">Real-time search results</text>
<line x1="${cx+185}" y1="280" x2="${cx+185}" y2="300" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+185}" y1="300" x2="${cx}" y2="300" stroke="#374151" stroke-width="1.5"/>
${yn(cx-60,270,'No')}
${arrd(262,298)}
${merge(300)}

<!-- Click product card -->
${arrd(307,324)}
${act(324,'Click product card')}
${arrd(352,370)}
${act(370,'Product detail page loads')}
${arrd(398,416)}

<!-- Decision: Negotiate? -->
${dec(416,'Negotiate price?')}
${yn(cx+82,433,'Yes')}
<line x1="${cx+80}" y1="433" x2="${cx+115}" y2="433" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+115}" y1="433" x2="${cx+115}" y2="455" stroke="#374151" stroke-width="1.5"/>
<rect x="${cx+120}" y="444" width="130" height="24" rx="8" fill="#FEF9C3" stroke="#D97706" stroke-width="1.2"/>
<text x="${cx+185}" y="460" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#78350F">Use Bargain Calculator</text>
<line x1="${cx+185}" y1="468" x2="${cx+185}" y2="488" stroke="#374151" stroke-width="1.5"/>
<line x1="${cx+185}" y1="488" x2="${cx}" y2="488" stroke="#374151" stroke-width="1.5"/>
${yn(cx-60,432,'No')}
${arrd(450,486)}
${merge(488)}

<!-- Contact seller -->
${arrd(495,512)}
${act(512,'Click "Contact Seller Safely"','#FEE2E2','#EF4444')}
${arrd(540,558)}
${act(558,'Safety Gate: read 3 fraud rules','#FEE2E2','#EF4444')}
${arrd(586,604)}
${act(604,'Tick "I have read all rules"','#FEE2E2','#EF4444')}
${arrd(632,650)}
${act(650,'Phone number revealed')}
${arrd(678,696)}

<!-- END -->
<circle cx="${cx}" cy="702" r="10" fill="none" stroke="#1E3A5F" stroke-width="2"/>
<circle cx="${cx}" cy="702" r="6" fill="#1E3A5F"/>
<text x="${cx}" y="720" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#64748B">Chat continues in WhatsApp</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════════════
   GENERATE ALL PNGs
═══════════════════════════════════════════════════════════ */
console.log('  Rendering diagrams...');
const pngArch    = png(architectureSVG(), 900);
const pngER      = png(erDiagramSVG(),    970);
const pngUC      = png(useCaseSVG(),      950);
const pngSeqL    = png(seqLoginSVG(),     900);
const pngSeqP    = png(seqProductSVG(),   950);
const pngAct     = png(activitySVG(),     580);
console.log('  Diagrams rendered.');

/* ── ImageRun helpers (w,h in pixels at 96dpi) ─────────── */
const imgArch = imgP(pngArch, 606, 333);   // 900:490 ratio
const imgER   = imgP(pngER,   606, 412);   // 970:660
const imgUC   = imgP(pngUC,   606, 364);   // 950:570
const imgSeqL = imgP(pngSeqL, 606, 296);   // 900:440
const imgSeqP = imgP(pngSeqP, 606, 288);   // 950:450
const imgAct  = imgP(pngAct,  435, 527);   // 580:720

/* ═══════════════════════════════════════════════════════════
   DOCUMENT SECTIONS
═══════════════════════════════════════════════════════════ */

const cover = [
  br(),br(),
  pc('LANDMARK METROPOLITAN UNIVERSITY INSTITUTE',true),
  pc('FACULTY OF SCIENCE AND TECHNOLOGY',true),
  pc('DEPARTMENT OF COMPUTER SCIENCE AND SOFTWARE ENGINEERING',true),
  br(),br(),
  pc('─────────────────────────────────────────────────────'),br(),
  pc('ETOH MARKET: DESIGN AND IMPLEMENTATION OF A',true),
  pc('WEB-BASED DIGITAL MARKETPLACE FOR',true),
  pc('CAMEROONIAN VENDORS AND BUYERS',true),
  br(),pc('─────────────────────────────────────────────────────'),
  br(),br(),
  pc('A Project Report Submitted in Partial Fulfilment of the'),
  pc('Requirements for the Award of a'),
  pc('Bachelor of Technology (BTech) in Software Engineering',true),
  br(),br(),pc('By'),br(),
  pc('SAGONG TCHOFFO ALVARO DYLAN',true),
  pc('Registration Number: [REGISTRATION NUMBER]'),
  br(),br(),pc('Supervisor:'),
  pc('[SUPERVISOR\'S FULL NAME AND QUALIFICATION]'),
  br(),br(),pc('Academic Year: 2025 / 2026'),
  pb(),
];

const tocSec = [
  chap('Table of Contents'),br(),
  pl('Dedication ................................................ i'),
  pl('Acknowledgments ........................................... ii'),
  pl('List of Abbreviations ..................................... iii'),
  pl('List of Tables ............................................ iv'),
  pl('List of Figures ........................................... v'),
  pl('Abstract .................................................. vi'),br(),
  pl('CHAPTER ONE: GENERAL INTRODUCTION'),
  pl('  1.1  Introduction ........................................ 1'),
  pl('  1.2  Background .......................................... 2'),
  pl('  1.3  Problem Statement ................................... 3'),
  pl('  1.4  Objectives .......................................... 4'),
  pl('  1.5  Significance ........................................ 5'),
  pl('  1.6  Scope ............................................... 5'),
  pl('  1.7  Definition of Terms ................................. 6'),
  pl('  1.8  Organisation ........................................ 7'),br(),
  pl('CHAPTER TWO: LITERATURE REVIEW'),
  pl('  2.1  Introduction ........................................ 8'),
  pl('  2.2  Related Concepts .................................... 8'),
  pl('  2.3  Related Works ...................................... 11'),
  pl('  2.4  Proposed Solution .................................. 15'),br(),
  pl('CHAPTER THREE: MATERIALS AND METHODS'),
  pl('  3.1  Introduction ....................................... 17'),
  pl('  3.2  Development Methodology ............................ 17'),
  pl('  3.3  Tools and Materials ................................ 18'),
  pl('  3.4  System Modules ..................................... 20'),
  pl('  3.5  System Analysis .................................... 21'),
  pl('  3.6  System Design ...................................... 27'),br(),
  pl('CHAPTER FOUR: IMPLEMENTATION, RESULTS AND TESTING'),
  pl('  4.1  Introduction ....................................... 33'),
  pl('  4.2  Implementation ..................................... 33'),
  pl('  4.3  Results ............................................ 37'),
  pl('  4.4  Testing ............................................ 41'),br(),
  pl('CHAPTER FIVE: SUMMARY, CONCLUSIONS AND RECOMMENDATIONS'),
  pl('  5.1  Discussions ........................................ 44'),
  pl('  5.2  Conclusions ........................................ 45'),
  pl('  5.3  Recommendations .................................... 46'),
  pl('  5.4  Further Work ....................................... 47'),br(),
  pl('References ................................................ 48'),
  pb(),
];

const dedication = [
  br(),br(),br(),chap('Dedication'),br(),
  p('This work is dedicated to every small-scale vendor in Cameroon who gets up early, sets up their stall, and works hard every day to support their family.'),br(),
  p('It is also dedicated to my family for their constant support throughout this journey.'),pb(),
];

const acknowledgments = [
  chap('Acknowledgments'),br(),
  p('I thank my supervisor, [Supervisor\'s Name], for the guidance and feedback that shaped this project.'),br(),
  p('I am grateful to the Landmark Metropolitan University Institute and the Department of Computer Science and Software Engineering for the knowledge and tools that made this project possible.'),br(),
  p('I also thank the market vendors and buyers in Douala and Yaoundé whose daily challenges motivated every design decision in ETOH Market.'),pb(),
];

const abbreviations = [
  chap('List of Abbreviations'),br(),
  pl('AI     — Artificial Intelligence'),
  pl('API    — Application Programming Interface'),
  pl('B2C    — Business-to-Consumer'),
  pl('C2C    — Consumer-to-Consumer'),
  pl('CFA    — Communauté Financière Africaine'),
  pl('CORS   — Cross-Origin Resource Sharing'),
  pl('CRUD   — Create, Read, Update, Delete'),
  pl('ER     — Entity-Relationship'),
  pl('FR     — Functional Requirement'),
  pl('HTTP   — HyperText Transfer Protocol'),
  pl('JS     — JavaScript'),
  pl('JSON   — JavaScript Object Notation'),
  pl('JWT    — JSON Web Token'),
  pl('LMUI   — Landmark Metropolitan University Institute'),
  pl('MoMo   — Mobile Money'),
  pl('NFR    — Non-Functional Requirement'),
  pl('npm    — Node Package Manager'),
  pl('REST   — Representational State Transfer'),
  pl('SPA    — Single-Page Application'),
  pl('SQL    — Structured Query Language'),
  pl('UI     — User Interface'),
  pl('URL    — Uniform Resource Locator'),
  pl('UX     — User Experience'),
  pl('VPS    — Virtual Private Server'),
  pb(),
];

const listTables = [
  chap('List of Tables'),br(),
  pl('Table 3.1:  Hardware and Software Requirements'),
  pl('Table 3.2:  Backend Dependencies'),
  pl('Table 3.3:  Frontend Dependencies'),
  pl('Table 3.4:  System Modules'),
  pl('Table 3.5:  Functional Requirements'),
  pl('Table 3.6:  Non-Functional Requirements'),
  pl('Table 3.7:  Project Schedule'),
  pl('Table 3.8:  Use Cases'),
  pl('Table 3.9:  Data Dictionary — users'),
  pl('Table 3.10: Data Dictionary — stands'),
  pl('Table 3.11: Data Dictionary — products'),
  pl('Table 3.12: Data Dictionary — orders'),
  pl('Table 4.1:  Unit Test Cases'),
  pl('Table 4.2:  Integration Test Cases'),
  pl('Table 4.3:  System Test Results'),
  pb(),
];

const listFigures = [
  chap('List of Figures'),br(),
  pl('Figure 3.1:  System Architecture Diagram'),
  pl('Figure 3.2:  Entity-Relationship Diagram'),
  pl('Figure 3.3:  Use Case Diagram'),
  pl('Figure 3.4:  Sequence Diagram — User Login'),
  pl('Figure 3.5:  Sequence Diagram — Add Product'),
  pl('Figure 3.6:  Activity Diagram — Buyer Flow'),
  pb(),
];

const abstract = [
  chap('Abstract'),br(),
  p('ETOH Market is a web-based digital marketplace built for Cameroon\'s informal market sector. Vendors in cities like Douala and Yaoundé have no easy way to show their products to buyers outside their physical stall, and buyers waste time and money travelling to markets to compare prices. ETOH Market solves this by giving vendors free virtual shops and connecting them with buyers through WhatsApp — the app most Cameroonians already use every day.'),
  p('The system was built with Node.js and Express.js for the backend, React.js and Vite for the frontend, and SQLite for the database. Features include product listings with images, videos, and voice notes; a Safety Gate to protect buyers from fraud; a Bargain Calculator; a Bendskin delivery button; a community price board (Prix du Marché); a buyer request board (Je Cherche); short video reels (Market Buzz); a Google Gemini AI chat assistant; and a full English/French bilingual interface. Five two-week Agile iterations were used. All 20 functional requirements were verified through unit, integration, and system tests.'),
  p('Keywords: digital marketplace, e-commerce, Cameroon, React.js, WhatsApp, SQLite, Agile.'),
  pb(),
];

/* ── CHAPTERS (abbreviated for space; full text below) ─── */

const ch1 = [
  chap('Chapter One: General Introduction'),
  h2('1.1  Introduction'),
  p('People in Cameroon buy and sell goods mostly in open-air markets like Marché Central in Douala and Marché Mokolo in Yaoundé. Vendors can only reach customers who walk past their stall. Buyers have no digital way to search for products or compare prices before they travel. ETOH Market moves the market experience online in a way that fits Cameroon — using tools people already trust.'),br(),
  h2('1.2  Background to the Study'),
  p('Over 90% of jobs in Cameroon are in the informal sector [1]. Most commerce happens in physical markets. WhatsApp is used by the majority of smartphone owners as an informal commerce tool — vendors send product photos and buyers negotiate prices through it [2]. ETOH Market builds on this existing behaviour by adding a proper search and discovery layer, without replacing WhatsApp. Existing platforms like Jumia, Tonaton, and Facebook Marketplace do not adequately serve informal Cameroonian vendors [3].'),br(),
  h2('1.3  Statement of the Problem'),
  p('Six problems were identified:'),
  bi('Vendors have no digital presence — customers are limited to those who walk past their stall.'),
  bi('Buyers waste time and money travelling to markets to find specific products.'),
  bi('Prices are hidden — there is no public reference for what goods cost today.'),
  bi('Buyers distrust unknown online sellers because mobile money fraud is common.'),
  bi('Last-mile bendskin delivery is hard to coordinate without a dedicated tool.'),
  bi('Most platforms support only one language, excluding either English or French speakers.'),br(),
  h2('1.4  Objectives of the Study'),
  h3('General Objective'),
  p('To design and implement a web-based digital marketplace that lets Cameroonian vendors list their products online and lets buyers discover, compare, and contact vendors safely.'),
  h3('Specific Objectives'),
  bi('Build a secure JWT and bcrypt authentication system.'),
  bi('Develop virtual stands with product listings supporting images, videos, and voice notes.'),
  bi('Create a WhatsApp-integrated contact system with a Safety Gate and Trusted Vendor Badge.'),
  bi('Build a Bargain Calculator and Bendskin Delivery Button for local commerce practices.'),
  bi('Implement a community price board (Prix du Marché) for twelve common staple goods.'),
  bi('Create a buyer request board (Je Cherche) where buyers post what they need.'),
  bi('Integrate Google Gemini AI as an in-app market guidance assistant.'),
  bi('Deliver a fully bilingual (English and French) interface.'),
  bi('Build an admin panel for complete platform management.'),
  bi('Test all features through unit, integration, and system tests.'),br(),
  h2('1.5  Significance of the Study'),
  p('For vendors, the platform expands customer reach beyond the physical stall at zero cost. For buyers, it saves travel time and provides price transparency. Research shows access to market price information can improve vendor and buyer outcomes in African markets [4]. For the academic community, the project shows a full-stack web application with AI integration can be built at minimal cost using open-source tools.'),br(),
  h2('1.6  Scope of the Study'),
  p('The system covers eight cities: Douala, Yaoundé, Bamenda, Buea, Bafoussam, Kribi, Limbe, and Ngaoundéré. All features in Section 1.4 are included. Payment processing and native mobile apps are out of scope.'),br(),
  h2('1.7  Definition of Terms'),
  bi('Stand: A vendor\'s virtual shop on ETOH Market containing their details and product listings.'),
  bi('Bendskin: A motorcycle taxi used for short-distance transport and delivery in Cameroonian cities.'),
  bi('Safety Gate: A modal that shows fraud prevention rules and requires buyer confirmation before revealing a seller\'s phone number.'),
  bi('JWT (JSON Web Token): A signed token that proves a user is logged in, sent with every API request.'),
  bi('SQLite: A file-based relational database stored as a single .db file with no separate server.'),
  bi('Reel: A short vendor video, similar to TikTok, posted to demonstrate products.'),
  bi('CFA Franc: The currency of Cameroon.'),
  bi('Agile: A development method that builds software in short, repeated cycles called iterations.'),br(),
  h2('1.8  Organisation of the Study'),
  p('Chapter One introduces the project. Chapter Two reviews related work. Chapter Three covers design and methodology. Chapter Four presents implementation and test results. Chapter Five gives conclusions and recommendations.'),
  pb(),

  chap('Chapter Two: Literature Review'),
  h2('2.1  Introduction'),
  p('This chapter reviews the key ideas behind ETOH Market, examines six existing platforms, and explains the proposed solution.'),br(),
  h2('2.2  Review of Related Concepts'),
  h3('2.2.1  Digital Marketplaces'),
  p('A digital marketplace is a platform where many vendors and many buyers come together [6]. Unlike a single shop\'s website, it is the digital equivalent of a shopping centre. ETOH Market follows a Consumer-to-Consumer (C2C) model where individual vendors sell directly to individual buyers.'),br(),
  h3('2.2.2  Mobile Commerce in Africa'),
  p('Almost all internet access in Cameroon is through mobile devices. GSMA data shows smartphone adoption in Sub-Saharan Africa grows at ~6% per year [2]. Research by Aker and Mbiti showed that mobile phones reduce market price dispersion and help both buyers and sellers find better prices [4]. This directly motivates the Prix du Marché price board.'),br(),
  h3('2.2.3  WhatsApp Commerce'),
  p('WhatsApp dominates communication in Cameroon. Vendors already share product photos and buyers already negotiate prices through it. ETOH Market keeps WhatsApp as the contact tool but adds a searchable catalogue on top, using standard wa.me links to open conversations.'),br(),
  h3('2.2.4  Digital Trust'),
  p('Mobile money fraud is a known problem in Cameroon [3]. Gefen et al. found that trust is one of the most critical factors in e-commerce adoption [5]. ETOH Market uses the Safety Gate (mandatory fraud warning) and the Trusted Vendor Badge (admin-verified credibility signal) to address this.'),br(),
  h3('2.2.5  Community Information Systems'),
  p('WeFarm connected over one million farmers in East Africa through peer-to-peer market knowledge sharing [7]. It proved community-sourced data platforms work even on slow networks. The Prix du Marché feature applies the same model to Cameroonian staple food prices.'),br(),
  h2('2.3  Review of Related Works'),
  h3('2.3.1  Jumia'),
  p('Jumia is Africa\'s largest e-commerce platform with payment escrow, professional logistics, and buyer protection. However, it requires formal business registration and charges 5–20% commissions. These requirements exclude most informal Cameroonian vendors. Recommendation: future platforms should use lightweight email-only registration.'),br(),
  h3('2.3.2  Tonaton'),
  p('Tonaton is a free classifieds platform in Ghana and Cameroon. No registration or commissions required. However, it is passive — no verified sellers, no voice note support, no bilingual interface, no WhatsApp integration, and buyers cannot post what they are looking for.'),br(),
  h3('2.3.3  Facebook Marketplace'),
  p('Facebook Marketplace uses the existing Facebook user base and is free. But it is designed for a global audience with no Cameroonian-specific features — no price board, no bargain calculator, no bendskin delivery integration, and no bilingual support.'),br(),
  h3('2.3.4  Jiji Africa'),
  p('Jiji is a classified ads platform across Africa. It is not available in Cameroon and has documented fraud problems. It provides no community engagement features.'),br(),
  h3('2.3.5  WhatsApp Business'),
  p('WhatsApp Business allows a single vendor to display a product catalogue. Excellent for communicating with existing customers, but provides no discovery layer. A buyer cannot search across multiple WhatsApp Business vendors simultaneously.'),br(),
  h3('2.3.6  WeFarm'),
  p('WeFarm connected over one million African farmers through peer agricultural knowledge sharing [7]. Its community information model directly inspired the Prix du Marché feature. WeFarm focuses only on knowledge, not commerce.'),br(),
  h2('2.4  Proposed Solution'),
  p('No existing platform combines free vendor registration, no commissions, bilingual interface, WhatsApp-native communication, community price board, reverse marketplace, multimedia listings, a trust framework, and an AI assistant. ETOH Market provides all of these. The core principle is to work with existing Cameroonian behaviours — add a search layer on top of WhatsApp commerce, a calculator on top of negotiation, a contact message generator on top of bendskin delivery.'),
  pb(),

  chap('Chapter Three: Materials and Methods'),
  h2('3.1  Introduction'),
  p('This chapter describes the development methodology, tools and materials, system modules, and analysis and design artefacts.'),br(),
  h2('3.2  Development Methodology'),
  p('ETOH Market was built using the Agile software development method. Agile delivers working software in short cycles and adapts to changing requirements [8]. Several features (voice recording, Je Cherche, Prix du Marché) were added during development based on better understanding of user needs. Five two-week iterations were used:'),
  bi('Iteration 1 (Weeks 1–2): Database schema, server, authentication, stand management.'),
  bi('Iteration 2 (Weeks 3–4): Product management, file uploads, homepage with search and filters.'),
  bi('Iteration 3 (Weeks 5–6): WhatsApp contact, Safety Gate, Bargain Calculator, Bendskin Button, orders.'),
  bi('Iteration 4 (Weeks 7–9): Market Buzz reels, Prix du Marché, Je Cherche, voice recorder.'),
  bi('Iteration 5 (Weeks 10–12): AI chat, bilingual support, Admin Panel, Trusted Badge, availability status, testing, and documentation.'),br(),
  h2('3.3  Tools and Materials'),br(),
  tblcap('Table 3.1: Hardware and Software Requirements'),
  tbl([['Item','Specification'],['Processor','Intel Core i5 8th Gen or equivalent'],['RAM','8 GB development; 2 GB minimum for deployment'],['Storage','256 GB SSD development; 20 GB VPS'],['Node.js','v18+'],['SQLite','v5.1.6 via sqlite3 npm package'],['React + Vite','React 18, Vite 5'],['Test Device','Android smartphone (Android 9+) for mobile testing']]),
  br(),
  tblcap('Table 3.2: Backend Dependencies'),
  tbl4(['Package','Version','Purpose','Reason'],[
    ['Express.js','4.18.2','REST API framework','Most popular Node.js framework; well-documented'],
    ['bcryptjs','3.0.3','Password hashing','Industry-standard; salted; brute-force resistant'],
    ['jsonwebtoken','9.0.3','JWT tokens','Stateless sessions; no server-side storage'],
    ['multer','1.4.5','File uploads','Handles multipart forms; size and type limits'],
    ['@google/generative-ai','0.24.1','Gemini AI SDK','Official SDK; simple chat interface'],
    ['cors','2.8.5','Cross-origin requests','Allows React dev server to call backend'],
    ['dotenv','16.3.1','Environment variables','Keeps secrets out of source code'],
    ['Jest + Supertest','30.4.2 / 7.2.2','Testing','Standard JS test runner + HTTP integration tests'],
  ]),
  br(),
  tblcap('Table 3.3: Frontend Dependencies'),
  tbl4(['Package','Version','Purpose','Reason'],[
    ['React','18+','UI library','Component-based; efficient virtual DOM'],
    ['Vite','5+','Build tool','Instant hot reload; faster than webpack'],
    ['React Router DOM','6+','Navigation','SPA routing without page reloads'],
    ['Axios','1+','HTTP client','JWT interceptors; auto JSON parsing'],
  ]),
  br(),
  h2('3.4  System Modules'),br(),
  tblcap('Table 3.4: System Modules'),
  tbl4(['Module','Backend File','Key Frontend Files','Responsibilities'],[
    ['Authentication','routes/auth.js','Login.jsx, Register.jsx, Profile.jsx','Register, login, JWT, profile picture upload'],
    ['Stands','routes/stands.js','CreateStand.jsx, MyStands.jsx, StandDetail.jsx','Create, edit, delete stands; availability status'],
    ['Products','routes/products.js','CreateProduct.jsx, ProductDetail.jsx','List products with media; search and filter'],
    ['Commerce','(integrated)','SafetyGate.jsx, BendskinButton.jsx','Safety Gate, WhatsApp contact, Bargain Calculator, orders'],
    ['Market Buzz','routes/posts.js','Reels.jsx','Short video feed, snap-scroll, likes'],
    ['Price Board','routes/prices.js','PrixDuMarche.jsx','Price submission and min/avg/max aggregation'],
    ['Je Cherche','routes/wanted.js','JeCherche.jsx','Buyer requests with 7-day auto-expiry'],
    ['AI Chat','routes/gemini.js','ChatWidget.jsx','Gemini API chat with local market system prompt'],
    ['Admin','routes/admin.js','Admin.jsx','Dashboard stats, full CRUD, vendor verification'],
  ]),
  br(),
  h2('3.5  System Analysis'),
  h3('3.5.1  Functional Requirements'),br(),
  tblcap('Table 3.5: Functional Requirements'),
  tbl4(['ID','Description','Priority'],[
    ['FR01','Users can register with name, email, and password (min 6 chars).','High'],
    ['FR02','Users can log in; system returns a 7-day JWT token.','High'],
    ['FR03','Authenticated users can update profile name, bio, WhatsApp, and picture.','Medium'],
    ['FR04','Authenticated users can create stands with name, phone, city, description.','High'],
    ['FR05','Stand owners can edit their stand and set availability (Open / Away / Closed).','High'],
    ['FR06','Stand owners can delete their stand; all products are deleted with it.','Medium'],
    ['FR07','Stand owners can add products with name, price (CFA), category, image, video, voice note.','High'],
    ['FR08','Homepage shows all products and stands, filterable by city and category, with a search bar.','High'],
    ['FR09','Safety Gate modal must be confirmed before seller\'s phone number is shown.','High'],
    ['FR10','WhatsApp button opens a direct chat via wa.me link.','High'],
    ['FR11','Bargain Calculator offers 10%, 20%, 30% discount tiers with a copyable message.','Medium'],
    ['FR12','Bendskin Button generates a pre-filled WhatsApp delivery request.','Medium'],
    ['FR13','Buyers can place delivery orders with name, city, neighbourhood, and landmark.','Medium'],
    ['FR14','Authenticated users can post short videos to the Market Buzz feed.','Medium'],
    ['FR15','Any user can submit a price report for one of twelve staple items.','Medium'],
    ['FR16','System shows min, avg, and max price per item from the last 24 hours.','Medium'],
    ['FR17','Any user can post a buyer request on Je Cherche with their WhatsApp number.','Medium'],
    ['FR18','Je Cherche posts automatically expire 7 days after creation.','Low'],
    ['FR19','An AI chat assistant is available on all pages.','Low'],
    ['FR20','The full interface can be switched between English and French at any time.','High'],
  ]),
  br(),
  h3('3.5.2  Non-Functional Requirements'),br(),
  tblcap('Table 3.6: Non-Functional Requirements'),
  tbl4(['ID','Category','Requirement'],[
    ['NFR01','Performance','Homepage loads all products in under 3 seconds on 3G mobile.'],
    ['NFR02','Usability','Interface works on screen widths from 320 px upwards.'],
    ['NFR03','Security','Passwords stored as bcrypt hashes; JWT for all session management.'],
    ['NFR04','Security','Admin routes require a separate key; ownership checks server-side.'],
    ['NFR05','Reliability','All API errors return JSON with the correct HTTP status code.'],
    ['NFR06','Scalability','SQLite can be swapped for PostgreSQL without changing app logic.'],
    ['NFR07','Portability','Runs on Node.js v18; works on Chrome, Firefox, Safari, and Edge.'],
    ['NFR08','Maintainability','One route file per domain; reusable React components across pages.'],
  ]),
  br(),
  h3('3.5.3  Project Schedule'),br(),
  tblcap('Table 3.7: Project Schedule'),
  tbl4(['Week','Activity','Deliverable'],[
    ['1–2','Requirements, DB schema, setup','etoh.db schema, .env configuration'],
    ['3–4','Authentication, stand management, auth pages','Working login/register/stands flow'],
    ['5–6','Product management, file uploads, homepage filters','Product listing and browsing'],
    ['7–8','WhatsApp, Safety Gate, Bargain Calc, Bendskin, orders','Full commerce module'],
    ['9–10','Market Buzz, Prix du Marché, Je Cherche, voice recorder','All community features'],
    ['11','AI chat, bilingual, Admin Panel, Trusted Badge, availability','Complete feature set'],
    ['12','Testing, bug fixes, documentation, report writing','Test suite passing, this report'],
  ]),
  br(),
  h3('3.5.4  Use Cases'),br(),
  tblcap('Table 3.8: Use Cases'),
  tbl4(['ID','Use Case','Actor','Description'],[
    ['UC01','Browse Products','Guest / Registered','Open homepage, apply filters, use search bar.'],
    ['UC02','Register','Guest','Enter name, email, password. System hashes and returns JWT.'],
    ['UC03','Login','Guest','Enter email and password. System verifies and returns JWT.'],
    ['UC04','Create Stand','Registered','Enter stand details. System creates stand.'],
    ['UC05','Add Product','Registered (owner)','Enter product details, upload media. System checks ownership and saves.'],
    ['UC06','Contact Seller','Guest / Registered','Confirm Safety Gate rules, reveal phone, tap WhatsApp button.'],
    ['UC07','Place Order','Guest / Registered','Fill delivery form. System saves order record.'],
    ['UC08','Post Reel','Registered','Upload video. Reel appears in Market Buzz feed.'],
    ['UC09','Submit Price','Guest / Registered','Select item, enter price and city. Saved to price_reports.'],
    ['UC10','Post Je Cherche','Guest / Registered','Enter description, city, WhatsApp. Saved with 7-day expiry.'],
    ['UC11','Admin Manage','Admin','Edit, verify, or delete any user, stand, product, reel, or order.'],
  ]),
  br(),
  h3('3.5.5  Use Case Diagram'),
  imgUC,
  cap('Figure 3.3: Use Case Diagram'),br(),

  h3('3.5.6  Sequence Diagram — User Login'),
  p('Figure 3.4 shows the complete interaction sequence when a user logs in: from form submission through Express authentication, bcrypt verification, and JWT generation to AuthContext state update.'),
  imgSeqL,
  cap('Figure 3.4: Sequence Diagram — User Login'),br(),

  h3('3.5.7  Sequence Diagram — Add Product'),
  p('Figure 3.5 shows how a product is saved: the request passes through the JWT middleware, the multer file-upload middleware, and an ownership check before the INSERT is executed.'),
  imgSeqP,
  cap('Figure 3.5: Sequence Diagram — Add Product'),br(),

  h3('3.5.8  Activity Diagram — Buyer Flow'),
  p('Figure 3.6 shows the complete buyer journey from opening the homepage to revealing the seller\'s contact number through the Safety Gate.'),
  imgAct,
  cap('Figure 3.6: Activity Diagram — Buyer Product Discovery and Contact Flow'),br(),

  h2('3.6  System Design'),
  h3('3.6.1  System Architecture'),
  p('ETOH Market uses a three-tier client-server architecture (Figure 3.1). The presentation tier is a React SPA in the browser. The application tier is a Node.js + Express.js server. The data tier is SQLite in a single etoh.db file. Uploaded media is served by Express.static() from the uploads/ folder. The Google Gemini API is called for AI chat.'),
  imgArch,
  cap('Figure 3.1: System Architecture Diagram'),br(),

  h3('3.6.2  Entity-Relationship Diagram'),
  p('The database has seven tables. Users own Stands (1:N). Stands have Products (1:N) and Posts (1:N). Products are referenced by Orders (1:N). PriceReport and WantedPost are independent tables with no foreign key links.'),
  imgER,
  cap('Figure 3.2: Entity-Relationship Diagram'),br(),

  h3('3.6.3  Data Dictionary'),br(),
  tblcap('Table 3.9: Data Dictionary — users'),
  tbl4(['Column','Type','Constraints','Description'],[
    ['id','INTEGER','PK, AUTOINCREMENT','Unique user identifier'],
    ['name','TEXT','NOT NULL','Full name from registration'],
    ['email','TEXT','UNIQUE, NOT NULL','Login email address'],
    ['password_hash','TEXT','NOT NULL','bcrypt hash; plaintext never stored'],
    ['whatsapp','TEXT','NULLABLE','Optional WhatsApp number'],
    ['profile_picture','TEXT','NULLABLE','URL path to uploaded avatar'],
    ['bio','TEXT','NULLABLE','Short self-description'],
    ['created_at','TEXT','DEFAULT datetime(\'now\')','Creation timestamp'],
  ]),
  br(),
  tblcap('Table 3.10: Data Dictionary — stands'),
  tbl4(['Column','Type','Constraints','Description'],[
    ['id','INTEGER','PK, AUTOINCREMENT','Unique stand identifier'],
    ['user_id','INTEGER','FK → users(id) CASCADE','Owner; stand deleted if owner deleted'],
    ['vendor_name','TEXT','NOT NULL','Name of the vendor\'s stand'],
    ['phone_number','TEXT','NOT NULL','Primary contact phone number'],
    ['city','TEXT','DEFAULT \'Douala\'','City where the vendor operates'],
    ['is_verified','INTEGER','DEFAULT 0','1 = Trusted Vendor Badge awarded by admin'],
    ['availability','TEXT','DEFAULT \'open\'','open, away, or closed'],
  ]),
  br(),
  tblcap('Table 3.11: Data Dictionary — products'),
  tbl4(['Column','Type','Constraints','Description'],[
    ['id','INTEGER','PK, AUTOINCREMENT','Unique product identifier'],
    ['stand_id','INTEGER','FK → stands(id) CASCADE','Stand that owns this product'],
    ['product_name','TEXT','NOT NULL','Name of the product'],
    ['price_cfa','REAL','NOT NULL','Asking price in CFA francs'],
    ['category','TEXT','DEFAULT \'general\'','food, produce, fashion, electronics, beauty, home, crafts, services, general'],
    ['image_path','TEXT','NULLABLE','URL to uploaded product image'],
    ['video_path','TEXT','NULLABLE','URL to uploaded product video'],
    ['audio_voice_path','TEXT','NULLABLE','URL to uploaded voice note'],
  ]),
  br(),
  tblcap('Table 3.12: Data Dictionary — orders'),
  tbl4(['Column','Type','Constraints','Description'],[
    ['id','INTEGER','PK, AUTOINCREMENT','Unique order identifier'],
    ['product_id','INTEGER','FK → products(id) CASCADE','The product ordered'],
    ['buyer_name','TEXT','NOT NULL','Full name of the buyer'],
    ['target_city','TEXT','NOT NULL','Delivery city'],
    ['target_quarter','TEXT','NOT NULL','Neighbourhood or district'],
    ['near_landmark','TEXT','NOT NULL','Nearest landmark for the delivery rider'],
    ['status','TEXT','DEFAULT \'pending\'','pending, confirmed, delivered, or cancelled'],
  ]),
  pb(),

  chap('Chapter Four: Implementation, Results and Testing'),
  h2('4.1  Introduction'),
  p('This chapter describes how each major module was built, presents the system results, and reports unit, integration, and system test outcomes.'),br(),
  h2('4.2  Implementation'),
  h3('4.2.1  Server and Database'),
  p('The entry point server.js loads database.js (which runs all CREATE TABLE IF NOT EXISTS statements and ALTER TABLE migrations), loads app.js (which mounts all nine route files), then starts the HTTP listener. The test suite imports app.js without starting the listener and uses a separate test database pointed to by the DB_PATH environment variable.'),br(),
  h3('4.2.2  Authentication'),
  p('Registration uses bcrypt.hash(password, 10). The cost factor of 10 makes each hash take ~100ms, preventing brute-force attacks. Login uses bcrypt.compare(entered, stored). On success, jwt.sign({id,email,name}, secret, "7d") returns a 7-day token. The requireAuth middleware verifies this token on every protected request and attaches req.user.'),br(),
  h3('4.2.3  File Uploads'),
  p('Multer saves uploads to uploads/ with timestamped unique filenames. Products accept three files per request via upload.fields([{name:\'image\'},{name:\'video\'},{name:\'audio\'}]). Files are served at /uploads/ by Express.static(). The Voice Recorder uses the browser\'s MediaRecorder API to record up to 60 seconds of audio without any plugin.'),br(),
  h3('4.2.4  Frontend Architecture'),
  p('AuthContext stores the JWT and user in React state and localStorage. LanguageContext provides t() — all text is retrieved by key (e.g. t(\'heroTitle\')), so toggling the language updates all 200+ strings instantly. All API calls go through a single Axios instance. A request interceptor adds the JWT header; a response interceptor auto-logs out expired sessions.'),br(),
  h3('4.2.5  Key Features'),
  p('Bargain Calculator: offer = Math.floor(price × (1−pct/100) / 50) × 50. Division and multiplication by 50 rounds to the nearest 50 CFA — the standard denomination in Cameroonian markets.'),
  p('Prix du Marché: SQL window functions (MIN, MAX, AVG with OVER PARTITION BY item_name) calculate stats for all twelve tracked items in one query.'),
  p('Availability Badge: pulsing green CSS animation dot for open, static amber for away, red for closed.'),
  p('AI Chat: backend calls Gemini with a system prompt making it a "friendly Cameroonian market assistant who knows CFA prices, local recipes, and safe trading tips". A fallback message is returned if no API key is configured.'),br(),
  h2('4.3  Results'),
  p('[Figure 4.1: Homepage showing the hero banner, live stats strip (e.g. "67 Products | 18 Stands | 8 Cities"), product grid with Trusted Vendor badges and green availability dots, and filter chips for city and category.]'),br(),
  p('[Figure 4.2: Product detail page with Safety Gate modal open showing three fraud prevention rules and a checkbox — the phone number is hidden until the buyer ticks the checkbox. The Bargain Calculator below shows three buttons (10%, 20%, 30% off) with prices rounded to the nearest 50 CFA and a "Copy Offer Message" button.]'),br(),
  p('[Figure 4.3: Market Buzz reel feed — centred video with vendor info and likes counter. Auto-plays on scroll via IntersectionObserver.]'),br(),
  p('[Figure 4.4: Prix du Marché showing twelve staple food cards, each with today\'s min / average / max price from community reports.]'),br(),
  p('[Figure 4.5: Je Cherche board showing buyer request cards with description, city, days until expiry, and a WhatsApp contact button.]'),br(),
  p('[Figure 4.6: Admin Panel dashboard with stat cards and a Stands tab showing a Verify toggle that grants the Trusted Vendor Badge.]'),br(),
  h2('4.4  Testing'),
  h3('4.4.1  Unit Tests'),br(),
  tblcap('Table 4.1: Unit Test Cases'),
  tbl4(['ID','Test','Expected','Result'],[
    ['UT-A01','Register with valid data','HTTP 201, JWT returned','PASS'],
    ['UT-A02','Register without name','HTTP 400, error message','PASS'],
    ['UT-A03','Register with password < 6 chars','HTTP 400, error message','PASS'],
    ['UT-A04','Register with duplicate email','HTTP 409, error message','PASS'],
    ['UT-A05','Login with correct credentials','HTTP 200, JWT returned','PASS'],
    ['UT-A06','Login with wrong password','HTTP 401, error message','PASS'],
    ['UT-A07','Access /me without token','HTTP 401, error message','PASS'],
    ['UT-A08','Access /me with expired token','HTTP 401, error message','PASS'],
  ]),
  br(),
  h3('4.4.2  Integration Tests'),br(),
  tblcap('Table 4.2: Integration Test Cases'),
  tbl4(['ID','Test','Expected','Result'],[
    ['IT-S01','Create stand as authenticated user','HTTP 201, stand saved','PASS'],
    ['IT-S02','Create stand without token','HTTP 401 Unauthorized','PASS'],
    ['IT-S03','Edit stand you own','HTTP 200, updated','PASS'],
    ['IT-S04','Edit stand you do not own','HTTP 403 Forbidden','PASS'],
    ['IT-S05','Delete stand; check products deleted','HTTP 200; products = 0','PASS'],
    ['IT-P01','Add product to your own stand','HTTP 201, product saved','PASS'],
    ['IT-P02','Add product to someone else\'s stand','HTTP 403 Forbidden','PASS'],
    ['IT-P03','Submit price report with valid data','HTTP 201, report saved','PASS'],
    ['IT-P04','Submit price report with price = 0','HTTP 400, validation error','PASS'],
    ['IT-W01','Post Je Cherche with invalid WhatsApp','HTTP 400, validation error','PASS'],
    ['IT-W02','Delete Je Cherche with correct WhatsApp','HTTP 200, deleted','PASS'],
    ['IT-W03','Delete Je Cherche with wrong WhatsApp','HTTP 403 Forbidden','PASS'],
  ]),
  br(),
  h3('4.4.3  System Tests'),
  p('A full end-to-end test was run: register → login → create stand → add three products → browse homepage → place delivery order → submit two price reports → post a Je Cherche request. All steps passed.'),br(),
  tblcap('Table 4.3: System Test Results'),
  tbl4(['Requirement','Method','Result','Notes'],[
    ['FR01–FR03: Auth','End-to-end user journey','PASS','All auth flows work'],
    ['FR04–FR06: Stands','Create, edit, availability, delete','PASS','CASCADE deletion confirmed'],
    ['FR07–FR08: Products','Add product with media; filter on homepage','PASS','Images served at /uploads/'],
    ['FR09–FR10: Safety Gate + WhatsApp','Manual browser test','PASS','Checkbox required before reveal'],
    ['FR11: Bargain Calculator','Verify 10/20/30% calculations','PASS','Rounds to nearest 50 CFA'],
    ['FR12: Bendskin Button','Verify WhatsApp message content','PASS','All product/vendor details included'],
    ['FR13: Orders','POST order; verify in DB via admin','PASS','All fields stored correctly'],
    ['FR14: Market Buzz','Upload video; verify auto-play','PASS','IntersectionObserver on mobile'],
    ['FR15–FR16: Prix du Marché','Submit 3 reports; check min/avg/max','PASS','SQL window functions correct'],
    ['FR17–FR18: Je Cherche','Post request; verify 7-day expiry','PASS','Expired posts hidden from feed'],
    ['FR19: AI Chat','Send message; verify Gemini response','PASS (with key)','Fallback shown without key'],
    ['FR20: Bilingual','Toggle language; verify all text','PASS','All 200+ strings translated'],
    ['NFR01: Performance','100 products API response time','PASS','Under 120ms on LAN'],
    ['NFR03–NFR04: Security','No plaintext passwords; ownership checks','PASS','Verified by unit/integration tests'],
  ]),
  pb(),

  chap('Chapter Five: Summary, Conclusions and Recommendations'),
  h2('5.1  Discussions'),
  p('ETOH Market meets all 20 functional and 8 non-functional requirements. The most important finding is that a full-featured digital marketplace for Cameroon can be built using open-source tools at a monthly running cost of under 7,000 CFA francs. The WhatsApp-first design was the most critical decision — using wa.me links works with existing user behaviour rather than against it. The bilingual feature proved more valuable than expected: Cameroonian market interactions naturally switch between English and French. The Prix du Marché and Je Cherche features fill real information gaps: research confirms community-sourced market data creates measurable economic benefits for buyers and sellers in African markets [4][7].'),br(),
  h2('5.2  Conclusions'),
  p('This project successfully designed, developed, implemented, and tested ETOH Market — a bilingual, WhatsApp-integrated digital marketplace for Cameroonian vendors and buyers. The system addresses all six identified problems. The technology stack (Node.js, Express.js, React.js, SQLite, JWT, bcryptjs, Google Gemini) was well-suited to all requirements. Agile was the right methodology — it handled significant scope changes without disrupting the project. ETOH Market shows that a student developer can build locally adapted e-commerce technology that has real social and economic value for the community it serves.'),br(),
  h2('5.3  Recommendations'),
  bi('Deploy now: Host on a VPS with a .cm domain and SSL certificate to reach real Cameroonian users immediately.'),
  bi('Build an Android app: Push notifications and a better mobile experience would increase engagement. Android covers over 90% of the Cameroonian smartphone market.'),
  bi('Create a WhatsApp onboarding guide: A step-by-step sign-up guide delivered via WhatsApp in both English and French would reduce the digital literacy barrier.'),
  bi('Add Mobile Money integration: An optional MTN MoMo or Orange Money escrow feature would increase buyer confidence for high-value transactions.'),
  bi('Improve content moderation: AI-assisted image classification could flag suspicious listings for admin review as the platform grows.'),
  bi('Monitor performance: Deploy Prometheus and Grafana to track API response times and error rates.'),br(),
  h2('5.4  Further Work'),
  bi('AI price prediction: The time-series data from Prix du Marché could train an LSTM model to forecast future staple food prices.'),
  bi('Local language NLP: Fine-tuning a model on Cameroonian Pidgin, Bassa, Fulfulde, Duala, and Ewondo would make the AI assistant more culturally resonant.'),
  bi('Impact study: A 12-month study measuring vendor revenue change after joining ETOH Market would provide rigorous evidence of economic impact.'),
  bi('Scalable vendor verification: Self-sovereign identity (SSI) research could enable vendors to prove identity through mobile operators without manual admin review.'),
  bi('Bendskin routing: Order origin/destination data could optimise bendskin rider routing and reduce delivery times.'),
  pb(),

  chap('References'),br(),
  pl('[1] International Labour Organization, "Women and Men in the Informal Economy: A Statistical Picture," 3rd ed., ILO, Geneva, 2018.'),br(),
  pl('[2] GSMA, "The Mobile Economy: Sub-Saharan Africa 2023," GSMA Intelligence, London, 2023.'),br(),
  pl('[3] Datareportal, "Digital 2024: Cameroon," Datareportal, 2024. [Online]. Available: https://datareportal.com/reports/digital-2024-cameroon'),br(),
  pl('[4] J. C. Aker and I. M. Mbiti, "Mobile phones and economic development in Africa," J. Econ. Perspect., vol. 24, no. 3, pp. 207–232, 2010.'),br(),
  pl('[5] D. Gefen, E. Karahanna, and D. W. Straub, "Trust and TAM in online shopping: An integrated model," MIS Q., vol. 27, no. 1, pp. 51–90, 2003.'),br(),
  pl('[6] E. Turban, D. King, J. K. Lee, and T.-P. Liang, Electronic Commerce: A Managerial and Social Networks Perspective, 8th ed., Cham: Springer, 2015.'),br(),
  pl('[7] WeFarm, "WeFarm Impact Report 2021," WeFarm Ltd., 2021. [Online]. Available: https://wefarm.org'),br(),
  pl('[8] K. Beck et al., "Manifesto for Agile Software Development," Agile Alliance, 2001. [Online]. Available: http://agilemanifesto.org'),br(),
  pl('[9] UN Women, "Women\'s Economic Empowerment in Cameroon," UN Women Cameroon, Yaoundé, 2022.'),
];

/* ═══════════════════════════════════════════════════════════
   BUILD DOCUMENT
═══════════════════════════════════════════════════════════ */
const all = [
  ...cover, ...tocSec, ...dedication, ...acknowledgments,
  ...abbreviations, ...listTables, ...listFigures, ...abstract,
  ...ch1,
];

const doc = new Document({
  title: 'ETOH Market — BTech Project Report',
  sections:[{
    properties:{ page:{ margin:{ top:CM, bottom:CM, left:CM, right:CM } } },
    children: all,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('ETOH_Market_Project_Report.docx', buf);
  console.log(`\n  Done: ETOH_Market_Project_Report.docx  (${(buf.length/1024).toFixed(1)} KB)\n`);
});
