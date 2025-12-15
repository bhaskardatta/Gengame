# SATARK AI 🛡️

**Satark AI** is an immersive, 3D gamified platform designed to train users in identifying and neutralizing modern cybersecurity threats. Unlike static training modules, Satark places the player in a first-person virtual office environment, simulating a realistic workday where they must distinguish between legitimate communications and sophisticated social engineering attacks.

Built with **Next.js 14** and **React Three Fiber**, and powered by **Llama-3 (via Groq)**, the platform generates infinite, culturally relevant threat scenarios tailored to the Indian digital landscape.

![Project Banner](public/project_banner_placeholder.png) 
*(Note: Replace with actual screenshot)*

## ⚡ Core Features

### 🎮 Immersive 3D Environment
-   **First-Person Interaction**: Navigate a fully rendered 3D office space.
-   **Virtual Desktop**: Sit at your desk to access a simulated Operating System.
-   **Dynamic Atmosphere**: Day/night cycles and environmental storytelling.

### 🧠 AI-Driven Threat Engine
-   **Infinite Scenarios**: No hardcoded templates. The AI generates unique Phishing (Email) and Smishing (SMS) attacks every session.
-   **Indian Context**: Scenarios focuses on relevant themes: UPI frauds (GPay/PhonePe), Income Tax refunds, KYC updates, and Traffic Challans.
-   **Mixed Reality**: The engine balances legitimate messages with scams (50/50 split) to test true discernment, not just paranoia.

### 🛡️ The Digital Guardian
-   **RAG-Enabled Analysis**: An in-game AI agent capable of analyzing email headers, URLs, and text patterns.
-   **Educational Feedback**: Immediate, detailed explanations on *why* a decision was correct or incorrect (e.g., "The sender domain `hdfc-kyc.net` is a spoof of `hdfcbank.com`").

### 🖥️ Virtual OS Apps
-   **Mail Client**: Auto-fetching inbox with read states and report actions.
-   **Messages**: Mobile interface for SMS interaction and smishing detection.
-   **Browser**: Simulated Intranet portal with mock phishing education modules.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
-   **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (@react-three/fiber)
-   **Physics**: Cannon.js (@react-three/cannon)
-   **AI & LLM**: [Groq SDK](https://groq.com/) (Llama-3.3-70b-versatile)
-   **State Management**: Zustand
-   **Styling**: Tailwind CSS
-   **Markdown**: React Markdown (for structured AI responses)

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   A [Groq API Key](https://console.groq.com/) (Free tier available)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/bhaskardatta/Gengame.git
    cd PhishNet-3D
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=gsk_your_actual_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to launch the simulation.

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── apps/           # In-game OS Apps (Mail, Browser, Guardian, Messages)
│   │   ├── game/           # 3D R3F Components (Scene, Player, Office, GamingSetup)
│   │   └── os/             # 2D Virtual Desktop Interface
│   ├── lib/
│   │   └── ai.ts           # Groq Client & Prompt Engineering Logic
│   ├── stores/             # Global State (Game progression, OS window state)
│   └── app/
│       └── api/genai/      # Next.js Server Actions for secure AI calls
```

## 🔐 Privacy & Security
This project uses AI to generate simulated phishing content for educational purposes only.
-   **No Personal Data**: The game does not collect or store user PII.
-   **Safe Sandbox**: All links and domains within the game are fictitious and contained within the simulation.

## 📜 License
MIT License. Free to fork and use for educational cybersecurity initiatives.
