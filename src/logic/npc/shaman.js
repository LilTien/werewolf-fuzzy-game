import { getMostSuspicious } from "@/utils/trust";

export function shamanAI(npc, players) {

    return getMostSuspicious(npc, players);

}