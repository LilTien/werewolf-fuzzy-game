import DefaultAvatar from "@/assets/avatar/avatar.png";

export const nightResultConfig = {
    "werewolf-kill": {
        title: ({ target }) =>
            `${target.name} was killed`,

        description: ({ target }) =>
            `During the night, ${target.name} (${target.role}) was attacked by the Werewolf.`,

        image: DefaultAvatar,
    },

    "doctor-save": {
        title: ({ target }) =>
            `${target.name} was saved`,

        description: ({ target }) =>
            `The Doctor protected ${target.name}. They survived the night.`,

        image: DefaultAvatar,
    },

    "knight-kill": {
        title: ({ target }) =>
            `${target.name} was executed`,

        description: ({ target }) =>
            `The Knight struck down ${target.name} (${target.role}).`,

        image: DefaultAvatar,
    },

    "wrong-kill": {
        title: ({ target }) =>
            `The Knight was punished`,

        description: ({ target }) =>
            `The Knight killed ${target.name}(${target.role}). The Knight also died.`,

        image: DefaultAvatar,
    },

    "reveal": {
        title: ({ target }) =>
            `${target.name}'s role revealed`,

        description: ({ target }) =>
            `${target.name} is a ${target.role}.`,

        image: DefaultAvatar,
    },

    "vote-eliminate": {
        title: ({ target }) => `${target.name} was executed`,
        description: ({ target }) =>
            `The village voted to eliminate ${target.name} (${target.role}).`,
        image: DefaultAvatar,
    },
};