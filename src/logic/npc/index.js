import { werewolfAI } from "./werewolf";
import { doctorAI } from "./doctor";
import { seerAI } from "./seer";
import { shamanAI } from "./shaman";
import { knightAI } from "./knight";

export function npcNightAction(npc, players, shamanReveal) {

    switch (npc.role) {

        case "werewolf":
            return werewolfAI(npc, players, shamanReveal);

        case "doctor":
            return doctorAI(npc, players);

        case "seer":
            return seerAI(npc, players);

        case "shaman":
            return shamanAI(npc, players);

        case "knight":
            return knightAI(npc, players);

        default:
            return null;
    }

}