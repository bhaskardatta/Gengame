# Product Requirements Document (PRD)
## Project: PhishNet 3D (Gen Game)

### 1. Executive Summary
**PhishNet 3D** is an immersive, web-based educational game designed to teach cybersecurity awareness through interactive gameplay. Players assume the role of a corporate employee in a 3D office environment, tasked with identifying and reporting phishing attempts while verifying the legitimacy of digital communications. The game leverages a "game-within-a-game" concept, featuring a fully functional interactive virtual operating system.

### 2. Core Gameplay Loop
1.  **Spawn**: Player starts in a high-fidelity 3D corporate office.
2.  **Navigate**: Use WASD + Mouse to explore the environment.
3.  **Interact**: Locate the workstation and sit down (Enter Virtual OS).
4.  **Task**: Access the simulated "Mail" application to review incoming emails.
5.  **Analyze**: Inspect sender addresses, subject lines, and content for red flags.
6.  **Decision**: Mark emails as "Safe" or "Phishing".
7.  **Progress**: Correct decisions earn points; mistakes simulate security breaches.

### 3. Key Features

#### 3.1. 3D Environment (The "World")
-   **Engine**: React Three Fiber (Three.js).
-   **Controls**: First-person shooter (FPS) style controls (Pointer Lock).
-   **Physics**: Basic collision detection to prevent walking through walls/furniture.
-   **Aesthetics**: Modern, clean, "Cyber-Futurist" office design with dynamic lighting and shadows.

#### 3.2. Virtual Operating System (The "Game")
-   **Overlay System**: A 2D React DOM overlay that activates when the player "sits".
-   **Desktop Environment**:
    -   Taskbar with Start Menu and Clock.
    -   Draggable/Minimizable Windows.
    -   Dynamic Wallpaper (CSS Gradient/Image).
-   **Applications**:
    -   **CorpMail**: The core gameplay hub for email analysis.
    -   **Terminal**: For advanced system commands and "hacking" mini-games.
    -   **Intranet Browser**: To verify external links (simulated).
    -   **Settings**: To adjust game volume/graphics.

#### 3.3. Technical Architecture
-   **Framework**: Next.js 16 (App Router) with Turbopack.
-   **State Management**: Zustand (Global stores for Game State and OS State).
-   **Styling**: TailwindCSS for the UI overlay.
-   **Performance**: Dynamic imports with `ssr: false` for heavy 3D components.

### 4. User Interface (UI) & Experience (UX)
-   **HUD (Standing)**: Minimalist crosshair, "Press E to Interact" prompts, Build Info watermark.
-   **OS (Sitting)**: Glassmorphism aesthetic, responsive window management, high-contrast readable text.
-   **Feedback**: Instant visual/audio feedback for correct/incorrect actions (e.g., screen gloms red on virus infection).

### 5. Future Roadmap (Phase 2)
-   **Multiplayer**: Co-op defense mode.
-   **Scenario Editor**: Allow educators to create custom phishing campaigns.
-   **Leaderboards**: Global high scores for accuracy and speed.
-   **Mobile Support**: Touch controls for the 3D environment.
