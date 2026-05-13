# מדריך העלאה ל-Vercel — צעד אחר צעד

## מה צריך מראש
- חשבון GitHub (חינם): https://github.com/signup
- חשבון Vercel (חינם): https://vercel.com/signup — **תירשם עם GitHub**
- Node.js מותקן על המחשב: https://nodejs.org (הורד את ה-LTS)
- Git מותקן: https://git-scm.com/downloads

---

## שלב 1 — חלץ את הפרויקט

חלץ את הקובץ `ai-pricing-site.zip` לתיקייה במחשב שלך.
למשל: `D:\AI\CODE\ai-pricing-site\`

---

## שלב 2 — בדיקה מקומית

פתח CMD או Terminal בתיקיית הפרויקט:

```bash
cd D:\AI\CODE\ai-pricing-site
npm install
npm run dev
```

פתח בדפדפן: http://localhost:5173
ותראה את המחשבון עובד.

**Ctrl+C** לעצור את השרת המקומי.

---

## שלב 3 — צור repo חדש ב-GitHub

1. לך ל: https://github.com/new
2. שם ה-repo: `ai-pricing-calculator`
3. סמן **Public**
4. **אל תסמן** Add README / .gitignore (כבר יש לנו)
5. לחץ **Create repository**

---

## שלב 4 — העלה את הקוד ל-GitHub

חזור ל-CMD בתיקיית הפרויקט והרץ:

```bash
git init
git add .
git commit -m "Initial commit - AI pricing calculator MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-pricing-calculator.git
git push -u origin main
```

**חשוב:** החלף `YOUR_USERNAME` בשם המשתמש שלך ב-GitHub.

---

## שלב 5 — חבר ל-Vercel

1. לך ל: https://vercel.com/new
2. תראה את ה-repo שזה עתה יצרת — לחץ **Import**
3. Vercel יזהה אוטומטית שזה Vite + React
4. הגדרות ברירת מחדל — **אל תשנה כלום**
5. לחץ **Deploy**
6. תוך ~30 שניות האתר יהיה חי!

תקבל כתובת כמו: `ai-pricing-calculator.vercel.app`

---

## שלב 6 — חבר דומיין מותאם (אופציונלי)

1. קנה דומיין (למשל ב-Namecheap / Porkbun — ~$10/שנה)
2. ב-Vercel: **Project Settings** → **Domains** → הוסף את הדומיין שלך
3. Vercel ייתן לך DNS records (CNAME או A record)
4. הוסף אותם בלוח הניהול של הדומיין שלך
5. SSL (HTTPS) מתקבל אוטומטית

---

## שלב 7 — Google Search Console

1. לך ל: https://search.google.com/search-console
2. **Add Property** → הכנס את הדומיין שלך
3. בחר **URL prefix** method
4. העתק את קוד ה-verification
5. הדבק אותו ב-`index.html` בשורה:
   ```html
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```
6. Push לגיטהאב — Vercel ידפלי אוטומטית
7. חזור ל-Search Console ולחץ **Verify**

---

## שלב 8 — Google AdSense

1. לך ל: https://www.google.com/adsense
2. הירשם עם חשבון Google
3. הוסף את הדומיין שלך
4. תקבל קוד AdSense — הדבק אותו ב-`index.html` בשורה:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
5. Push לגיטהאב
6. AdSense בודקים את האתר — אישור תוך 1-14 ימים

**טיפ:** AdSense דורש תוכן מספיק. כדאי להוסיף 3-5 פוסטי בלוג לפני ההגשה.

---

## עדכונים עתידיים

כל שינוי שתעשה בקוד ותעלה ל-GitHub, Vercel ידפלי אוטומטית:

```bash
git add .
git commit -m "Update model pricing"
git push
```

זהו! תוך 30 שניות הגרסה החדשה חיה.

---

## מבנה הפרויקט

```
ai-pricing-site/
├── index.html          ← SEO meta tags + AdSense code
├── package.json        ← dependencies
├── vite.config.js      ← Vite configuration
├── public/
│   └── robots.txt      ← SEO crawling rules
└── src/
    ├── main.jsx        ← React entry point
    ├── index.css       ← Global styles
    └── App.jsx         ← The calculator (main component)
```
