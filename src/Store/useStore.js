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
    updateRelation: (
        observerId,
        targetId,
        updates
    ) =>
        set((state) => ({
            game: {
                ...state.game,

                players: state.game.players.map((player) => {

                    if (player.id !== observerId)
                        return player;

                    return {
                        ...player,

                        relations: {
                            ...player.relations,

                            [targetId]: {
                                ...player.relations[targetId],
                                ...updates,
                            },
                        },
                    };
                }),
            },
    })),
  updateSpoken: (playerId, spoken) => set((state) => ({
    game: {
        ...state.game,
        players: state.game.players.map((player) => {
            if(player.id !== playerId) return player

            return {
                ...player,
                hasSpoken: spoken
            }
        })
    }
  })),
  setPhase: (phase) => set((state) => ({
    game: {
        ...state.game,
        phase,
    }
  })),
  setPlayer: (players) => set({players}),
  nextDay: () => set((state) => ({day: state.day +1})),
  votePlayer: (voterId, targetId) => set((state) => ( {
    game: {
        ...state.game,
        players: state.game.players.map((player) => {
            if(player.id === voterId)
                return player;

            return {
                ...player,
                votedFor: targetId,
                hasVoted: true
            }
        })
    }
  }))

}));

export default useStore