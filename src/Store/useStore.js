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
      night: {
        action: {
            werewolf: null,
            doctor: null,
            seer: null,
            shaman: null,
            knight: null
        },
        results: [], //this one I will put like {day: 1, werewolf: 3, doctor: 2: knight 1 , jester: 2}
        knowledge: {
            seer: [], //this both will store like [{target: 1, role : 'werewolf'}]
            shaman: [],
        }
      }
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
            mode: mode,
            night: {
                action: {
                    werewolf: null,
                    doctor: null,
                    seer: null,
                    shaman: null,
                    knight: null
                },
                results: [],
                knowledge: {
                    seer: [], //this both will store like [{target: 1, role : 'werewolf'}]
                    shaman: [],
                }
            }
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
  votePlayer: (voterId, targetId) =>
      set((state) => ({
          game: {
              ...state.game,
              players: state.game.players.map((player) => {    
                  // Everyone else stays the same
                  if (player.id !== voterId) {
                      return player;
                  }    
                  // Only the voter is updated
                  return {
                      ...player,
                      votedFor: targetId,
                      hasVoted: true,
                  };
              }),
          },
      })),

    addKnowledge : (role, target, targetRole) => set((state) => ({
        game: {
            ...state.game,
            night: {
                ...state.game.night,
                knowledge: {
                    ...state.game.night.knowledge,
                    [role] : [
                        ...state.game.night.knowledge[role],
                        {target: target, targetRole: targetRole}
                    ]
                }
            }

        }
    })) ,

    resetAction : () => set((state) => ({
        game: {
            ...state.game,
            night: {
                ...state.game.night,
                action: {
                    werewolf: null,
                    doctor: null,
                    seer: null,
                    shaman: null,
                    knight: null
                }
            }
        }
    })),

    nightAction: (role, targetId) =>
    set((state) => ({
        game: {
            ...state.game,

            night: {
                ...state.game.night,
                action: {
                    ...state.game.night.action,
                    [role]: targetId,
                },
            },
        },
    })),

}));

export default useStore