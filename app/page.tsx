"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type FAQ = { q: string; a: string };

type FeedItem = { id: number; name: string; city: string; time: string; initials: string };

const firstNames = [
  "Aziz","Malika","Sardor","Dilnoza","Jasur","Nilufar","Bekzod","Shahnoza","Ulugbek","Feruza",
  "Doniyor","Munira","Zafar","Mohira","Eldor","Barno","Sherzod","Kamola","Alisher","Nodira",
  "Bobur","Sitora","Mirzo","Hulkar","Sanjar","Dilorom","Oybek","Maftuna","Timur","Zuhra"
];
const lastNames = [
  "Karimov","Rahimova","Toshmatov","Yusupova","Nazarov","Ergasheva","Xolmatov","Mirzayeva","Aliyev",
  "Sotvoldiyeva","Hasanov","Tursunova","Qodirov","Xoshimova","Abdullayev","Ismoilov","Botirov","Rajabov"
];
const cities = ["Toshkent","Samarqand","Farg'ona","Namangan","Andijon","Buxoro","Nukus","Qarshi","Termiz","Navoiy"];

const randomItem = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const maskName = (fullName: string) => {
  const [first = "", last = ""] = fullName.split(" ");
  const maskedFirst = first ? `${first[0]}${"*".repeat(Math.max(first.length - 1, 1))}` : "";
  return `${maskedFirst} ${last}`.trim();
};
const makeFeedItem = (id: number): FeedItem => {
  const rawName = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
  const city = randomItem(cities);
  const hourOptions = [3, 4, 5, 6, 8];
  const hoursAgo = randomItem(hourOptions);
  const time = `${hoursAgo} soat oldin`;
  const initials = rawName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return { id, name: maskName(rawName), city, time, initials };
};

function ElectricCTAButton({
  href = "https://t.me/seasonalworkUK_bot",
  label = "$220 ga ro'yxatdan o'tish",
  className = "",
}: { href?: string; label?: string; className?: string }) {
  return (
    <a href={href} className={`simple-cta ${className}`}>
      <span className="simple-cta__icon">
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
          <path d="M6 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  );
}

const faqList: FAQ[] = [
  {
    q: "Nega bu qadar arzon — $220?",
    a: "Bu arzon emas, xizmat uchun yetarli. Odamlar tasavvurida Angliyaga borish pul bilan o'lchangan, sababi oddiy ishchilar bilmaydigan jarayonlar agentliklar va \"pasredniklar\" orqali yuqori narxlarga sotiladi. Biz ish o'rni sotmaymiz, balki rasmiy operator bilan (yopiq koordinatorlar orqali) intervyuga olib chiqishni kafolatlaymiz. Firibgarlar hech qanday aloqasiz 5–10 barobar ko'p oladi, biz esa real xizmat uchun haq olamiz.",
  },
  {
    q: "Siz intervyuda kirishimni kafolatlaysizmi?",
    a: "Xa. Biz intervyuga kirishingizni kafolatlaymiz, bunga ochiqlanmaydigan sabablar bor. Siz dasturga mosmisiz yoki yo'q qaror intervyuda ish beruvchi tomonidan qabul qilinadi. Biz kafolatlaydigan narsa: siz real intervyuga chiqasiz, jarayonda adashmaysiz, savollarga tayyor bo'lasiz.",
  },
  {
    q: "Firibgarlarga allaqachon pul to'ladim. Nima qilaman?",
    a: "Tajribaga ko'ra Whatsappdagi rusiyzabon soxta menejerlarga qilingan to'lovlarni xechkim qaytara olmagan. Firibgarlar puxta tayyorlangan. Politsiya yoki sud orqali da'vo qiling. Biz esa real yopiq kanal orqali qayta boshlashga yordam beramiz, intervyuga kirish — hammayoqni ko'rsatib beramiz.",
  },
  {
    q: "Ingliz tilini bilish kerakmi?",
    a: "Yo'q. Rus tilini minimal muloqot darajasi kerak: O'zingizni tanishtirish, oddiy savollarga javob berish. Intervyu sanasi belgilanganda intervyu savollari va kerakli jumlalarni taqdim etamiz.",
  },
  {
    q: "Bir mavsum uchun qancha pul ishlash mumkin?",
    a: "Minimal tarif — soatiga £11. Standart haftada 6 kun, 6 oy ishlansa ~£12 800–15 900 brutto. Turar joy, transport va ovqatdan keyin odatda £10 000–12 000 qo'lga qoladi. Bu marketing emas, operatorlarning amaldagi stavkalari.",
  },
  {
    q: "Siz firibgar emasligingizni qanday tekshiraman?",
    a: "Xech qanday. Biz va hamkorlarimiz xavfsizligi, dastur davomiy ishlashi uchun biz ishlaydigan yopiq aloqalarni ochiqlamaymiz. Videoqo'ng'iroq yoki ofis orqali aloqa qilmaymiz. Biz 2 yil davomida 1700 ko'proq ishchilarga Seasonal Work Scheme dasturida ishlashga ko'mak berdik. Asosiy maqsadga pul ishlash qo'yilsa agentliklar uchun xizmatni 4-5 barobar qimmat bajarishimiz mumkin (talab ko'p), bu esa yana ischilar sifati buzilishiga olib keladi. Qishloq xo'jaligida ishlaydigan ischilar \"pasredniklar\" orqali $2500-3000 to'lab keta olmaydi, ketganlar esa og'ir mehnat qila olmaydi. Dastur uchun qishloq xo'jaligini real egalari ishga borishi muhim.",
  },
];

export default function Home() {
  const [openStates, setOpenStates] = useState<boolean[]>(() => faqList.map(() => false));
  const [floatVisible, setFloatVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveCount, setLiveCount] = useState(31);
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: 0, name: maskName("Nodira Rajabov"), city: "Toshkent", time: "30 daqiqa oldin", initials: "NR" },
    { id: 1, name: maskName("Sherzod Karimov"), city: "Navoiy", time: "6 soat oldin", initials: "SK" },
    { id: 2, name: maskName("Lobar Qodirov"), city: "Navoiy", time: "3 soat oldin", initials: "LQ" },
    { id: 3, name: maskName("Alisher Aliyev"), city: "Termiz", time: "8 soat oldin", initials: "AA" },
    { id: 4, name: maskName("Dilnoza Botirov"), city: "Buxoro", time: "5 soat oldin", initials: "DB" },
  ]);
  const nextIdRef = useRef(5);
  const slots = useMemo(
    () => Array.from({ length: 17 }).map((_, i) => (i === 5 ? "blink" : i < 5 ? "filled" : "empty")),
    []
  );

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      [
        ".hero .hero-badge",
        ".hero h1",
        ".hero .hero-sub",
        ".hero .hero-actions",
        ".hero .hero-stats",
        "section",
        ".solution-hero > *",
        ".price-card",
        ".compare-card",
        ".pain-card",
        ".truth-item",
        ".scam-item",
        ".step-card",
        ".trust-card",
        ".faq-item",
        ".final-actions",
        ".footer-note",
        ".urgency-bar",
        ".section-title",
        ".section-desc",
      ].join(", ")
    );
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      el.classList.add("fade-up");
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // floating CTA: show once user scrolls a bit down the page
  useEffect(() => {
    const onScroll = () => {
      const showAfter = window.innerHeight * 0.35; // ~35% of viewport
      setFloatVisible(window.scrollY > showAfter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // live counter: start at 31, add 1 every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + 1);
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // live feed: har 30 daqiqada bitta yangi ism qo'shamiz
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const id = nextIdRef.current++;
        const item = makeFeedItem(id);
        return [item, ...prev].slice(0, 4);
      });
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const floatCTA = useMemo(
    () => (
      <a href="https://t.me/seasonalworkUK_bot" className="float-cta" style={{ display: floatVisible ? "flex" : "none" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5" />
          <path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Ro'yxatdan o'tish
      </a>
    ),
    [floatVisible]
  );

  return (
    <>
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <section className="hero">
        <div className="hero-bg-circles">
          <span></span><span></span><span></span>
        </div>

        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#fff" strokeWidth="1.5" />
                <path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Angliya2026
          </div>
          <a href="#bottom-cta" className="nav-cta">Ro'yxatdan o'tish →</a>
        </nav>

        <div className="hero-body">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Seasonal Work Scheme rasmiy dasturi uchun <b>Toshkent shahrida intervyuga kirish kafolati </b>
          </div>

          <h1 className="heading-font">
            Angliyada ish —<br />
            <span className="accent">rasman</span>, atigi <span className="accent">$220</span>,<br />
            <span className="accent-red">firibgarlarsiz yo'l</span>
          </h1>

          <p className="hero-sub">
            Har yili minglab o'zbeklar soxta vositachilarga $1500 dan $10 000 gacha pul yo'qotadi. Biz sizni Buyuk
            Britaniyaning rasmiy viza operatori bilan intervyuga olib chiqamiz.
          </p>

          <div className="hero-actions">
            <a href="#bozor-haqiqat" className="btn-primary">
              Angliyaga boraman
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#qanday" className="btn-ghost">Bu qanday ishlaydi?</a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>$220</strong>
              <span>Xizmat narxi</span>
            </div>
            <div className="hero-stat">
              <strong>$0</strong>
              <span>Vositachi agentlik — bepul</span>
            </div>
            <div className="hero-stat">
              <strong>£11/soat</strong>
              <span>Minimal ish haqi</span>
            </div>
            <div className="hero-stat">
              <strong>6 oy</strong>
              <span>Mavsum davomiyligi</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>pastga aylantiring</span>
        </div>
      </section>

      <section className="pain-section" id="bozor-haqiqat">
        <div className="container">
          <span className="section-label">Bozorning haqiqati</span>
          <h2 className="section-title heading-font">Siz buni o'qiyotgan payt —<br />kimdir allaqachon $3000 yo'qotdi</h2>
          <p className="section-desc">Har yili o'n minglab MDH aholisi firibgarlarga pul to'laydi va natijada hech narsa olmaydi. Mana real hayotda bo'layotgan holatlar.</p>

          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="11" stroke="#FF3B3B" strokeWidth="1.8" />
                  <path d="M13 8v5M13 17v1" stroke="#FF3B3B" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>«To'lang — Angliyada bo'lasiz»</h3>
              <p>Rusiyzabon Whatsapp orqali siz bilan bog'lanadi, sizdan pul oladi, keyin yo'qoladi. 3 oydan keyin — jimlik. Whatsapp messenjerida sizni bloklaydi.</p>
              <span className="pain-amount">−$2 000+</span>
            </div>

            <div className="pain-card">
              <div className="pain-icon">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="4" y="6" width="18" height="14" rx="2" stroke="#FF3B3B" strokeWidth="1.8" />
                  <path d="M4 10h18M9 6V4M17 6V4" stroke="#FF3B3B" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Soxta shartnomalar</h3>
              <p>Mavjud bo'lmagan kompaniya nomidan muhrli chiroyli PDF yuboradi — Odam pul to'laydi — keyin Whatsappdagi odam yana pul so'raydi.</p>
              <span className="pain-amount">−$1 500+</span>
            </div>

            <div className="pain-card">
              <div className="pain-icon">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="10" r="5" stroke="#FF3B3B" strokeWidth="1.8" />
                  <path d="M5 22c0-4 3.6-7 8-7s8 3 8 7" stroke="#FF3B3B" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M19 8l4 4M23 8l-4 4" stroke="#FF3B3B" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>«Do'stimning tanishi»</h3>
              <p>Tanishingiz $3000 to'laydi, unga do'stini olib kelsa $1500 qaytaramiz deyilgan. «Hammasi rasmiy, o'zim tekshirdim» deydi tanishini firibgarga $3000 to'latadi. Bir oydan keyin — na pul, na xujjat, na suhbat yo'q.</p>
              <span className="pain-amount">−$3 000+</span>
            </div>

            <div className="pain-card">
              <div className="pain-icon">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M13 3L3 8v5c0 5.5 4 10.5 10 12 6-1.5 10-6.5 10-12V8L13 3z" stroke="#FF3B3B" strokeWidth="1.8" />
                  <path d="M9 13l3 3 5-5" stroke="#FF3B3B" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>«Agentliklar» ofisi bilan</h3>
              <p>Chiroyli ofis, litsenziya, «xijobli» qiz, hatto rus tili bilmaydigan «menejerlar» — hammasi illuziya yaratish uchun. Uch oydan keyin ofis yopilgan, "soqqa" yig'ilgan.</p>
              <span className="pain-amount">−$5 000+</span>
            </div>
          </div>
        </div>
      </section>

      <section className="truth-section" id="qanday">
        <div className="container">
          <span className="section-label" style={{ color: "#7dffb3" }}>Qattiq haqiqat</span>
          <h2 className="section-title heading-font">Seasonal Worker Scheme<br />aslida qanday ishlaydi</h2>
          <p className="section-desc" style={{ color: "rgba(255,255,255,0.6)" }}>
            Dastur mavjud. U real bor va aslida bepul. Lekin unga kirish ko'ringanidan ancha qiyin.
          </p>

          <div className="truth-grid">
            <div className="truth-item">
              <div className="truth-num">01</div>
              <div>
                <h3>Bu Buyuk Britaniya Seasonal Work Scheme dasturi</h3>
                <p>Seasonal Worker Scheme — Buyuk Britaniya hukumatining rasmiy dasturi. Ishga taklif bepul beriladi. Hech qanday pora berish kerak emas.</p>
              </div>
            </div>
            <div className="truth-item">
              <div className="truth-num">02</div>
              <div>
                <h3>Ishchini taklif qilish xarajatini ish beruvchi to'laydi — ishchi emas</h3>
                <p>Dastur bo'yicha ish beruvchi sizga muhtoj. Shartnoma va turar joyni tashkillash — barchasi intervyuda muhokama qilinadi. Viza markazida to'lov, aviabilet xarajatini o'zi ishchiga yetarli.</p>
              </div>
            </div>
            <div className="truth-item">
              <div className="truth-num">03</div>
              <div>
                <h3>Dasturga faqat rasmiy operatorlar orqali kirish mumkin</h3>
                <p>Buyuk Britaniya 4 ta rasmiy viza operatorini tanlagan. Ular bilan to'g'ridan-to'g'ri bog'lanib bo'lmaydi (buni ko'pchilik biladi)— intervyuga kirish kerak.</p>
              </div>
            </div>
            <div className="truth-item">
              <div className="truth-num">04</div>
              <div>
                <h3>O'rinlar cheklangan — raqobat kuchli</h3>
                <p>Har yili cheklangan miqdorda o'rin ajratiladi. Nomzodlar ko'p. Slotlar tezda yopiladi, talab yuqori.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scam-section">
        <div className="container">
          <span className="section-label" style={{ color: "#8a6000" }}>Diqqat — firibgarlar</span>
          <h2 className="section-title heading-font">Sizni qanday aldashmoqchi —<br />aniq sxemalar</h2>
          <p className="section-desc">Sxemalar murakkablashdi. Hatto ma'lumotli odamlar ham aldanadi. Mana konkret usullar.</p>

          <div className="scam-warning">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L34 32H2L18 4z" fill="#3d2a00" fillOpacity="0.15" stroke="#3d2a00" strokeWidth="1.5" />
              <path d="M18 14v8M18 26v1" stroke="#3d2a00" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <strong>Agar kimdir Angliyada «o'rin» uchun $350 dan ortiq so'rasa — bu firibgar.</strong>
              <p>Rasmiy dastur nomzoddan viza yoki ish o'rni uchun hech qanday to'lov talab qilmaydi.</p>
            </div>
          </div>

          <div className="scam-list">
            <div className="scam-item">
              <div className="scam-bullet">1</div>
              <div>
                <h4>$5000 ga «kafolatlangan o'rin»</h4>
                <p>Hech kim o'rinni kafolatlay olmaydi. Qarorni intervyuda ish beruvchi qabul qiladi. CoS raqamli shartnoma uchun pul to'lanmaydi.</p>
              </div>
            </div>
            <div className="scam-item">
              <div className="scam-bullet">2</div>
              <div>
                <h4>Kompaniyalar nomidan soxta xatlar</h4>
                <p>Internetda Whatsapp orqali real ferma logotipi bilan PDF jo'natishadi. Fermalar viza operatorsiz ishga olmaydi, bu haqda xabarsiz. Bunday xatlarni 5 daqiqada yasash mumkin.</p>
              </div>
            </div>
            <div className="scam-item">
              <div className="scam-bullet">3</div>
              <div>
                <h4>Bosqichma-bosqich oldindan to'lov sxemasi</h4>
                <p>Avval «bron uchun» $500, keyin «hujjatlar uchun» $1000, keyin «viza uchun» $800. Natija — $2300 ketdi, hech narsa yo'q, suhbatga qo'yilmagansiz.</p>
              </div>
            </div>
            <div className="scam-item">
              <div className="scam-bullet">4</div>
              <div>
                <h4>Agentliklar Telegram-kanallari «shoshilinch o'rinlar» bilan</h4>
                <p>Agentliklar sun'iy talab yaratadi: «100 ta o'rin oldik», «25 ta o'rin qoldi», «oxirgi imkoniyat». Pul shartnoma orqali olinadi, kuting deydi. Litsenziya bu dasturga ta'sir qila olmaydi!</p>
              </div>
            </div>
            <div className="scam-item">
              <div className="scam-bullet">5</div>
              <div>
                <h4>Soxta konsalting agentliklar</h4>
                <p>Chiroyli nomda ro'yxatdan o'tadi, 2-4 oyga ofis ijaraga oladi, «Angliya» deb aytib 200 odamga sotadi, keyinroq yopiladi. Yangi nom — yangi sxema bilan boshlaydi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="illusion-section">
        <div className="container">
          <span className="section-label">Illuziya vs Haqiqat</span>
          <h2 className="section-title heading-font">Nima uchun bu dasturga to'g'ri kelmaslik <br />mumkin — buni ochiq aytamiz</h2>
          <p className="section-desc">Biz 100% kafolat bermaysiz. Hech kim bera olmaydi. Lekin biz sizga boshqalardan farqli o'laroq — haqiqiy suhbatda qatnashishga imkoniyat beramiz.</p>

          <div className="compare-wrap">
            <div className="compare-card bad">
              <div className="compare-label bad-label">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#FF3B3B" strokeWidth="1.5" />
                  <path d="M5 8h6" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Firibgarlar nima deydi
              </div>
              <ul>
                <li><div className="li-icon x">✕</div> «O'rin 100% kafolatlangan»</li>
                <li><div className="li-icon x">✕</div> «Biz o'zimiz sizga viza qilamiz»</li>
                <li><div className="li-icon x">✕</div> «To'lang — 2 xaftada Angliyaga uchib ketasiz»</li>
                <li><div className="li-icon x">✕</div> «Intervyusiz imkon bor»</li>
                <li><div className="li-icon x">✕</div> «Bizda Angliya bilan eksklyuziv shartnoma bor»</li>
              </ul>
            </div>

            <div className="compare-card good">
              <div className="compare-label good-label">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#0e8f3e" strokeWidth="1.5" />
                  <path d="M5 8l2 2 4-4" stroke="#0e8f3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Biz nima qilamiz
              </div>
              <ul>
                <li><div className="li-icon ok">✓</div> Sizni real intervyuga olib chiqamiz</li>
                <li><div className="li-icon ok">✓</div> Siz operator bilan o'zingiz hududingizda intervyu berasiz, vaqtini xabar beramiz</li>
                <li><div className="li-icon ok">✓</div> Viza gov.uk rasmiy saytidan rasman topshiriladi</li>
                <li><div className="li-icon ok">✓</div> Hal qilish — operatorda: buni ochiq aytamiz</li>
                <li><div className="li-icon ok">✓</div> Bir marta to'lov, yashirin komissiyalar yo'q</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="solution-section" id="royxat">
        <div className="container">
          <span className="section-label">Bizning yechim</span>
          <h2 className="section-title heading-font">Biz kim va $220 ga nima qilamiz?</h2>

          <div className="solution-hero">
            <div>
              <h2>Buyuk Britaniyaga<br />real yo'lingiz</h2>
              <p style={{ marginBottom: "20px" }}>Biz 2023 yildan 1700 odamga pullik agentliklarni aylanib o'tishda va pora bermay ketishda yordam bera olgan jamoamiz. 2025 yil kuz mavsumidan keyin agentliklar va "pasredniklar" bilan ishlamaymiz. Bundan maqsad dasturga real mos ishchilarni suhbatga olib kelish, dastur bepul ekanligini ishchilarga ko'rsatib berish. Biz viza sotmaymiz. Biz sizni tekshirilgan kanallar (yopiq koordinatorlar) orqali ro'yxatdan o'tkazamiz va Buyuk Britaniya rasmiy viza operatorlari bilan intervyuga olib chiqamiz.</p>
              <p>Siz hamma narsani o'zingiz — har bir qadamda bizning yordamimiz bilan qilasiz. Bu hozirda yagona halol yo'l.</p>
            </div>

            <div className="price-card">
              <div className="price-old">firibgarlar $1500–10 000 oladi</div>
              <div className="price-main">$220</div>
              <div className="price-note">Xizmatlarimizning to'liq narxi</div>
              <ul className="price-features">
                <li><div className="check-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1DB954" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Nomzodni bizga ma'lum manbada ro'yxatdan o'tkazish</li>
                <li><div className="check-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1DB954" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Profilingizga mos operatorda o'rin tanlash</li>
                <li><div className="check-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1DB954" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Seasonal Work Scheme operatori bilan intervyuga chiqarish</li>
                <li><div className="check-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1DB954" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Barcha bosqichlarda qo'llab-quvvatlash</li>
                <li><div className="check-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1DB954" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Hujjatlar bo'yicha aniq yo'riqnoma</li>
              </ul>
              <a href="https://t.me/seasonalworkUK_bot" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Ro'yxatdan o'tishni boshlash →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <span className="section-label">Jarayon</span>
          <h2 className="section-title heading-font" style={{ textAlign: "center" }}>
            Hammasi qanday bo'ladi —<br />4 qadam
          </h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Ro'yxatdan o'tish</h3>
              <p>Maxsus bot orqali ma'lumotlaringizni yuborasiz. To'lovni amalga oshirasiz. Anketani to'ldirasiz (beriladi). Biz tekshiramiz, dastur talablariga muvofiqlsahtiramiz va mos operatorga tavsiya kiritamiz.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Intervyu</h3>
              <p>Biz sizni Buyuk Britaniyaning rasmiy viza operatori bilan intervyuga olib chiqamiz. Intervyu sanasi, hududingizdagi manzil sizga 20 kun avval xabar qilinadi. Intervyuda qatnashish talablari uqtiriladi. Bu ish beruvchi operator bilan haqiqiy suhbat.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Viza</h3>
              <p>Suhbatdan keyin Tasdiqdan (Invitation) so'ng (1-3 hafta) — gov.uk rasmiy saytida Seasonal Worker Visa uchun hujjat topshirasiz. Ko'rsatma beriladi. Viza uchun to'lovni o'z hisobingizdan amalga oshirasiz.</p>
            </div>
            <div className="step-card">
              <div className="step-num">4</div>
              <h3>Ish</h3>
              <p>Buyuk Britaniyaga operator belgilagan vaqtdan kech bo'lmay uchib ketasiz. Rasman soatiga £11 dan 6 oygacha ishlaysiz.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <span className="section-label">Nima uchun ishonishadi</span>
          <h2 className="section-title heading-font">Mantiq, faktlar<br />va pozitsiyamiz</h2>
          <p className="section-desc">Biz soxta bahonalar yasamaymiz. Biz agentlik emasmiz. Sxemamiz nima uchun 2 yildan buyon ishlashini tushuntiramiz.</p>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L4 7v5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7L12 3z" stroke="#0e8f3e" strokeWidth="1.5" />
                  <path d="M9 12l2 2 4-4" stroke="#0e8f3e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Bizga narxlarni ko'taradigan agentliklar kerak emas</h3>
              <p>Bizning biznes modelimiz — yopiq koordinatorlar bilan ishlaymiz, ko'rsatadigan xizmat uchun $220 olamiz. Ishchilar pul ishlash uchun keladi, $3000 xarajat qilishni ma'nosi yo'q.</p>
            </div>

            <div className="trust-card">
              <div className="trust-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="#1565C0" strokeWidth="1.5" />
                  <path d="M3 10h18M8 6V4M16 6V4" stroke="#1565C0" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Shaffof jarayon</h3>
              <p>Siz har bir qadamni oldindan bilasiz. Hech qanday kutilmagan holat yo'q. Hech qanday jarayonni o'zi tushinmaydigan «pasrednik» yo'q.</p>
            </div>

            <div className="trust-card">
              <div className="trust-icon yellow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#8a6000" strokeWidth="1.5" />
                  <path d="M12 7v5l3 3" stroke="#8a6000" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Biz mavsum bo'yi ishlaymiz</h3>
              <p>Dastur har yili 2 marta faol. Biz bir mavsum uchun agentlik ochib, keyin yopib ketmaymiz. Bunda mantiq yo'q, dasturga doim real ishchilar kerak</p>
            </div>

            <div className="trust-card">
              <div className="trust-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#0e8f3e" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="#0e8f3e" strokeWidth="1.5" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#0e8f3e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Real intervyular</h3>
              <p>Biz sizni tirik odamlar — operatorlar vakillari bilan bog'laymiz. Intervyuda qatnashish talablari bilan tanishtiramiz.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <span className="section-label">Ko'p so'raladigan savollar</span>
          <h2 className="section-title heading-font">Qo'rquvlarga va<br />e'tirozlarga javoblar</h2>

          <div className="faq-grid">
            {faqList.map((item, idx) => {
              const isOpen = openStates[idx];
              const toggle = () => setOpenStates((prev) => prev.map((val, i) => (i === idx ? !val : val)));

              return (
                <div key={item.q} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${idx}`}
                    onClick={toggle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle();
                      }
                    }}
                  >
                    <span>{item.q}</span>
                    <svg
                      className={`faq-arrow ${isOpen ? "rotated" : ""}`}
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path d="M4 7l5 5 5-5" stroke="#6b7a90" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className={`faq-a ${isOpen ? "open" : ""}`} id={`faq-${idx}`}>
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="final-section">
        <div className="grid-overlay"></div>
        <div className="container final-container">
          <div className="slots-pill">
            <span className="slots-label">
              <span className="yellow-dot"></span>
              <span className="slots-text">Mavsum o'rinlari cheklangan</span>
            </span>
            <div className="slots-bar">
              {slots.map((state, i) => (
                <span
                  key={i}
                  className={`slot ${state === "filled" ? "filled" : state === "blink" ? "blink" : ""}`}
                />
              ))}
            </div>
          </div>

          <h2 className="final-title heading-font">
            Har bir kechikish —
            <br />
            <span className="accent-green">yo'qolgan o'rin</span>
          </h2>

          <p className="final-desc">
            Bot nomzodlarni kelish tartibida qabul qiladi va operatorlar jamoasiga uzatadi. <strong>Hozir $220 to'lab boshlang</strong>, keyinroq yo'qolgan imkoniyat uchun <strong>$2000 to'lamang.</strong>
          </p>

          <div className="count-pill">
            Bugun ro'yxatdan o'tdi: <span>{liveCount}</span> nafar
          </div>

          <div className="feed-box">
            {feed.map((item) => (
              <div key={item.id} className="feed-row animate-feed">
                <div className="feed-left">
                  <div className="feed-avatar">{item.initials}</div>
                  <div>
                    <div className="feed-name">{item.name}</div>
                    <div className="feed-meta">{item.city} · {item.time}</div>
                  </div>
                </div>
                <span className="feed-badge">Band qildi</span>
              </div>
            ))}
          </div>

          <div className="final-actions" id="bottom-cta">  
            <Link  
              href="https://t.me/seasonalworkUK_bot"  
              className="btn-big group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#16c75f] via-[#1fb45b] to-[#18b85b] text-white text-lg font-extrabold tracking-tight shadow-[0_12px_32px_rgba(24,184,91,0.45)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(24,184,91,0.6)]"  
              target="_blank"  
              rel="noreferrer"  
            >  
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 border border-white/20 shadow-inner shadow-white/20 backdrop-blur-sm transition-transform duration-200 ease-out group-hover:translate-x-[2px]">  
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-white">  
                  <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />  
                  <path d="M6.1 9.6l7.5-3.2-3.1 7.3-.9-2.6-3.5-1.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />  
                  <path d="M9.6 11.2l2.2-2.2" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />  
                </svg>  
              </span>  
              <span className="relative z-10 drop-shadow-sm">$220 ga ro'yxatdan o'tish</span>  
            </Link> 
          </div> 

          <div className="final-subnote">
            ✓ Yashirin to'lovlar yo'q · ✓ CoS shartnomasi bepul · ✓ Rasmiy dastur · ✓ Agentliklarsiz
          </div>
        </div>
      </section>

      {floatCTA}
    </>
  );
}

