interface projectData {
    name: string
    start: number
    routerKey: string
    description: string
    type: string
    color: string
}

export const projects = [
    {
        name: "Escape the Spreading Fire",
        start: 1721204294033,
        routerKey: "projects-fireEscape",
        description: "Employing Double BFS algorithm and Binary Search, find the maximum time a man can stay that he can safely reach the safehouse locating at bottom-right corner of the room from the top-left corner (0,0) of the room with spreading fire and wall obstacles.",
        type: "algorithm",
        color: "#ffdcda"
    },
    {
        name: "Reversi",
        start: 1721204394033,
        routerKey: "projects-reversi",
        description: "Discover how the Monte Carlo Algorithm powers an intelligent AI for Reversi (Othello). This blog breaks down the algorithm's principles, guides you through its implementation, and offers an interactive demo to play against the algorithm. Explore how Monte Carlo simulations enhance game strategy and decision-making.",
        type: "algorithm",
        color: "#ffdcda"
    },
]; 

export type { projectData }