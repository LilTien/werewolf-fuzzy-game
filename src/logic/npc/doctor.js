import { getMostTrusted } from "@/utils/trust";
export function doctorAI(npc, players) {

    return getMostTrusted(npc, players);

}