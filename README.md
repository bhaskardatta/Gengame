# PhishNet 3D (Gen Game) 🛡️

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-Next.js_16_%7C_Three.js_%7C_Zustand-blue)

A next-generation 3D educational game that gamifies cybersecurity training. Built with **Next.js** and **React Three Fiber**, it blends a first-person 3D exploration experience with a fully functional 2D virtual operating system.

![Game Screenshot](https://via.placeholder.com/800x450?text=PhishNet+3D+Gameplay)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/bhaskardatta/gengame.git
    cd phishnet-3d
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Controls

| Action | Control | Note |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` | Standard FPS movement |
| **Look** | Mouse | Active when clicking game window |
| **Sit/Interact** | Click Chair | Enter Virtual OS mode |
| **Use OS** | Mouse | Standard desktop interaction |
| **Stand Up** | `ESC` | Exit Virtual OS mode |

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── game/           # 3D Scene components (Player, Room, Computer)
│   ├── os/             # 2D Virtual OS components (Desktop, Windows)
│   └── apps/           # In-game applications (Mail, Browser, Terminal)
├── stores/             # Zustand state management
└── lib/                # Utilities and constants
```

## 🛠️ Tech Stack

-   **Frontend Framework**: [Next.js 16](https://nextjs.org/) (Turbopack)
-   **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (@react-three/fiber)
-   **Helpers**: [Drei](https://github.com/pmndrs/drei) (@react-three/drei)
-   **Physics**: [Cannon](https://github.com/pmndrs/use-cannon) (@react-three/cannon)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)
-   **State**: [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch: `git checkout -b feature/amazing-feature`.
3.  Commit your changes: `git commit -m 'Add amazing feature'`.
4.  Push to the branch: `git push origin feature/amazing-feature`.
5.  Open a Pull Request.

---
© 2025 Baskar Datta. All Rights Reserved.
