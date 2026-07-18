import { getMostSuspicious } from "@/utils/trust";

export function werewolfAI(npc, players, shamanReveal) {

    // Future:
    // Prioritize shaman reveal here.
    const notShaman = players.filter((player) => player.role !== 'shaman');
    if(shamanReveal.length > 0){
        for(const reveal of shamanReveal){
            if (reveal.targetRole === "knight"|| reveal.targetRole === "doctor" || reveal.targetRole === "seer"  ){
                return reveal.target
            }
        }
    }
    return getMostSuspicious(npc, notShaman);
}