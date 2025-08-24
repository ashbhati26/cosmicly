Perfect 👌 since you’ve deployed on **Vercel**, let’s write a clean **README.md** tailored for your Astro MVP app. This will make your repo look professional and easy for others (or future you) to run locally.

---

```markdown
# COSMICLY MVP

Astro MVP is a modern web app that provides personalized horoscopes and astrological chat powered by Firebase and Next.js.  
Users can sign up, save their birth details, view daily/weekly/monthly horoscopes, and chat with a simple astrology bot.  

Deployed on **[Vercel](https://vercel.com/)** 🌐

---

## 🚀 Features

- **Authentication** – Sign up / Sign in with Email + Password (Firebase Auth)  
- **Profile** – Save birth details (name, DOB, time, place, timezone, zodiac sign)  
- **Horoscopes** – Daily / Weekly / Monthly predictions (generated with astrology calculations)  
- **Save Reports** – Store horoscope reports per user in Firestore  
- **Realtime Chat** – Simple bot chat about love, career, and health (Firestore `onSnapshot`)  
- **Charts** – Auto-calculated natal chart (Sun, Moon, planets, zodiac signs)  
- **Deployment** – Production-ready and deployed on Vercel  

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion  
- **Auth & DB**: Firebase Authentication + Cloud Firestore  
- **Astrology**: [astronomy-engine](https://github.com/cosinekitty/astronomy) for natal chart & transits  
- **Deployment**: [Vercel](https://vercel.com/)  

---

## 📂 Project Structure

```

src/
app/
(public)/
login/
dashboard/
profile/
horoscope/
chat/
components/
AuthGate.tsx
BirthForm.tsx
HoroscopeCard.tsx
ChatWindow\.tsx
NavShell.tsx
services/
firebase.ts
auth.ts
horoscope.ts
astro.ts
bot.ts
lib/
zodiac.ts

````

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/ashbhati26/astro.git
cd astro
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable:

   * Authentication → **Email/Password**
   * Firestore Database → **Production mode**
3. Copy your Firebase **web config** and paste it into `src/services/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Run locally

```bash
npm run dev
```

Visit → [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm run start
```

---

## 🔐 Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function authed() { return request.auth != null; }

    match /users/{uid} {
      allow read, write: if authed() && request.auth.uid == uid;
    }

    match /horoscopes/{uid}/{docId} {
      allow read, write: if authed() && request.auth.uid == uid;
    }

    match /charts/{uid}/{chartId} {
      allow read, write: if authed() && request.auth.uid == uid;
    }

    match /chats/{roomId} {
      allow read, write: if authed();
      match /messages/{msgId} {
        allow read: if authed();
        allow create: if authed() &&
          (request.resource.data.senderId == request.auth.uid ||
           request.resource.data.senderType == "bot");
        allow update, delete: if false;
      }
    }
  }
}
```

---

## 🌱 Roadmap

* [ ] Add Google OAuth login
* [ ] Replace mock horoscope generation with real API
* [ ] Advanced natal chart + transit interpretations
* [ ] Richer chat with GPT integration
* [ ] Push notifications (daily horoscope reminder)

---

## 🤝 Contributing

PRs and issues are welcome!
Fork this repo and create a pull request with your improvements.

---

## 📜 License

MIT License © 2025 [Ashish Bhati](https://github.com/ashbhati26)

```

---

👉 Do you want me to also include the **Vercel deployment link** in the README (so it’s clickable for testers)? If yes, just share the URL (`astro.vercel.app` or whatever Vercel gave you).
```
