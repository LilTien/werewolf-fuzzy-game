import { create } from 'zustand'
import { generatePlayers } from '@/utils/generatePlayers';

const useStore = create((set) => ({
  // 1. Initial State
  game: {
      phase: "Start",
      day: 1,
      players: [],
      discussionMessage: [],
      voteResult: null,
      gameLog: [],
      winner: null,
      mode: "",
  },

  initializeGame: (playerName, mode) => set({
        game: {
            phase: "Discussion",
            day: 1,
            players: generatePlayers(playerName, 8),
            discussionMessage: [],
            voteResult: null,
            gameLog: [],
            winner: null,
            mode: mode
        }

    }),
  setPlayer: (players) => set({players}),
  nextDay: () => set((state) => ({day: state.day +1})),

}));

export default useStore