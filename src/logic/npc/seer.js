import { getMostSuspicious } from "@/utils/trust";

export function seerAI(npc, players) {

    return getMostSuspicious(npc, players);

}