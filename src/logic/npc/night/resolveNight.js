export function resolveNight(players, action) {
    const results = [];

    // Copy every player object so the original Zustand state is not mutated.
    const updatedPlayers = players.map((player) => ({
        ...player,
    }));

    const normalizeTarget = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "skip"
        ) {
            return null;
        }

        return Number(value);
    };

    const werewolfTargetId = normalizeTarget(
        action.werewolf
    );

    const doctorTargetId = normalizeTarget(
        action.doctor
    );

    const knightTargetId = normalizeTarget(
        action.knight
    );

    /*
     * 1. Resolve Knight action independently.
     *
     * The Knight's action should still happen even when the
     * Doctor successfully protects the Werewolf's target.
     */
    if (knightTargetId !== null) {
        const knight = updatedPlayers.find(
            (player) =>
                player.role === "knight" &&
                player.alive
        );

        const knightVictim = updatedPlayers.find(
            (player) =>
                player.id === knightTargetId &&
                player.alive
        );

        if (
            knight &&
            knightVictim &&
            knight.id !== knightVictim.id &&
            knight.ability?.canUse !== false
        ) {
            knightVictim.alive = false;

            results.push({
                type: "knight-kill",
                actor: "knight",
                actorId: knight.id,
                targetId: knightVictim.id,
                targetRole: knightVictim.role,
            });

            const killedEvilRole = [
                "werewolf",
                "shaman",
            ].includes(knightVictim.role);

            // Knight dies when killing a good or neutral role.
            if (!killedEvilRole) {
                knight.alive = false;

                results.push({
                    type: "wrong-kill",
                    actor: "knight",
                    actorId: knight.id,
                    targetId: knight.id,
                    killedPlayerId: knightVictim.id,
                });
            }

            // Knight can only use this power once.
            knight.ability = {
                ...knight.ability,
                canUse: false,
                used: true,
            };
        }
    }

    /*
     * 2. Resolve Werewolf attack.
     */
    if (werewolfTargetId !== null) {
        const werewolf = updatedPlayers.find(
            (player) =>
                player.role === "werewolf" &&
                player.alive
        );

        const victim = updatedPlayers.find(
            (player) =>
                player.id === werewolfTargetId &&
                player.alive
        );

        const invalidTarget =
            !victim ||
            victim.role === "werewolf" ||
            victim.role === "shaman";

        if (werewolf && !invalidTarget) {
            const wasProtected =
                doctorTargetId !== null &&
                doctorTargetId === werewolfTargetId;

            if (wasProtected) {
                results.push({
                    type: "doctor-save",
                    actor: "doctor",
                    targetId: victim.id,
                    targetRole: victim.role,
                });
            } else {
                victim.alive = false;

                results.push({
                    type: "werewolf-kill",
                    actor: "werewolf",
                    actorId: werewolf.id,
                    targetId: victim.id,
                    targetRole: victim.role,
                });
            }
        }
    }

    return {
        players: updatedPlayers,
        results,
    };
}