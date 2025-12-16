export const calculateElo = (
    currentRating: number,
    difficulty: 'Novice' | 'Intermediate' | 'Expert',
    isCorrect: boolean
): number => {
    const K = 32;
    let expectedScore = 0;

    // Simplified expectation based on difficulty vs rating could be added here
    // For now, we assume a standard probability model
    // This is a simplified implementation:
    // If difficulty is high, expected score is lower, so win gives more points.

    let opponentRating = 1000;
    if (difficulty === 'Novice') opponentRating = 800;
    if (difficulty === 'Intermediate') opponentRating = 1200;
    if (difficulty === 'Expert') opponentRating = 1600;

    const expected = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    const actual = isCorrect ? 1 : 0;

    const newRating = Math.round(currentRating + K * (actual - expected));
    return Math.max(0, newRating); // Prevent negative rating
};

export const getLevel = (rating: number): number => {
    if (rating < 800) return 1; // Novice
    if (rating < 1200) return 2; // Apprentice
    if (rating < 1600) return 3; // Adept
    if (rating < 2000) return 4; // Expert
    return 5; // Master
};

export const getLevelTitle = (level: number): string => {
    switch (level) {
        case 1: return "Cyber Novice";
        case 2: return "Security Apprentice";
        case 3: return "Network Adept";
        case 4: return "Digital Expert";
        case 5: return "Cyber Guardian";
        default: return "Unknown";
    }
};
