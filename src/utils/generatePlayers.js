import npcNames from "@/constant/npcNames";
import roles from "@/constant/roles";

const avatarPositions = [
  { top: "35%", left: "40%" },
  { top: "45%", left: "40%" },
  { top: "52%", left: "38%" },
  { top: "58%", left: "43%" },
  { top: "60%", left: "50%" },
  { top: "57%", left: "58%" },
  { top: "50%", left: "60%" },
  { top: "43%", left: "57%" },
];

export function generatePlayers(playerName, totalPlayer = 8) {
    const players = [];
    
    // 1. Create a true COPY of the roles array so we don't destroy the original
    const availableRoles = [...roles]; 

    // Helper function to pick and remove a random role
    const getAndRemoveRandomRole = () => {
        if (availableRoles.length === 0) return roles[1].value; // Fallback if you run out
        
        // 2. Multiply by exact length (no +1) to stay within array bounds
        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        
        // Splice returns an array of removed items, we take the first one [0]
        return availableRoles.splice(randomIndex, 1)[0].value;
    };
    // 3. Assign role to the Human Player
    players.push({
        id: 0,
        name: playerName,
        role: getAndRemoveRandomRole(),
        isHuman: true,
        alive: true ,
        hasSpoken: false,
        position: { top: "40%", left: "49%" }
    });

    // 4. Assign roles to NPCs
    for (let i = 1; i < totalPlayer; i++) {
        players.push({
            id: i,
            name: npcNames[i - 1] || `NPC ${i}`, 
            role: getAndRemoveRandomRole(),
            isHuman: false,
            alive: true,
            hasSpoken: false,
            position: avatarPositions[i]
        });
    }

    //5. assign relationship into all npc
    for(const player of players){
        player.relations = {}

        for(const target of players){
            if(player.id === target.id) continue;

            player.relations[target.id] = {
                suspicion: Math.floor(Math.random() * 11),
                voteErraticness : 0,
                previousLies: 0,
                aggression: 0
            }

        }
    }

    return players;
}