import { getMostSuspicious } from "@/utils/trust";

export function knightAI(npc, players) {

    if (npc.killRemaining <= 0)
        return null;

    // Example: 35% chance to use the skill tonight
    if (Math.random() > 0.35)
        return null;

    return getMostSuspicious(npc, players);

}