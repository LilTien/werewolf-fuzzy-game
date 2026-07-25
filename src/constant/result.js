import DefaultAvatar from "@/assets/avatar/avatar.png";
import WerewolfScratch from '@/assets/avatar/werewolf_scratch.png'

export const nightResultConfig = {
    "werewolf-kill": {
        title: ({ target }) =>
            `${target.name} was killed`,

        description: ({ target }) =>
            `During the night, ${target.name} (${target.role}) was attacked by the Werewolf.`,

        image: WerewolfScratch,
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
        title: () =>
            "The Knight was punished",

        description: ({ target }) =>
            `${target.name} was innocent. As punishment for killing the wrong person, the Knight also died.`,

        image: DefaultAvatar,
    },

    "reveal": {
        title: ({ target }) =>
            `${target.name}'s role was revealed`,

        description: ({ target }) =>
            `${target.name} is the ${target.role}.`,

        image: DefaultAvatar,
    },

    "vote-eliminate": {
        title: ({ target }) =>
            `${target.name} was executed`,

        description: ({ target }) =>
            `The village voted to eliminate ${target.name} (${target.role}).`,

        image: DefaultAvatar,
    },

    "seer-reveal": {
        title: () =>
            "A Vision Appears",

        description: ({ target }) =>
            `Your vision reveals that ${target.name} is the ${target.role}.`,

        image: DefaultAvatar,
    },

    "shaman-reveal": {
        title: () =>
            "The Spirits Whisper",

        description: ({ target }) =>
            `The spirits reveal that ${target.name} is the ${target.role}.`,

        image: DefaultAvatar,
    },
};