
import DoctorCD from '../assets/cards/doctor.png'
import JesterCD from '../assets/cards/jester.png'
import KnightCD from '../assets/cards/knight.png'
import SeerCD from '../assets/cards/seer.png'
import ShamanCD from '../assets/cards/shaman.png'
import TravellerMouseCD from '../assets/cards/travellermouse.png'
import WerewolfCD from '../assets/cards/werewolf.png'


const roles = [
    {
        id: 'werewolf',
        name: 'Werewolf', 
        value: 'werewolf', 
        img: WerewolfCD, 
        evil: true,
        havePower: true,
        action: {
            type: 'kill',
            title: "Choose a player to kill",
            desc: "If no one protect that player, he die",
            button: "Kill"
        }
    },
    {
        id: 'villager',
        name: 'Villager', 
        value: 'villager', img: 
        TravellerMouseCD, 
        evil: false,
        havePower: false,
    },
    {
        id:'shaman' ,
        name: 'Shaman', 
        value: 'shaman', 
        img: ShamanCD, 
        evil: true,
        havePower: true,
        action: {
            type: 'reveal',
            title: "Choose a player to reveal the role",
            desc: "The player you reveal, werewolf can see",
            button: "Reveal"
        }
    },
    {
        id: 'seer',
        name: 'Seer', 
        value: 'seer', 
        img:SeerCD , 
        evil: false,
        havePower: true,
        action: {
            type: 'reveal',
            title: "Choose a player to reveal the role",
            desc: "Only you can see the role for the player",
            button: "Reveal"
        }
    },
    {
        id: 'doctor',
        name: 'Doctor', 
        value: 'doctor', 
        img: DoctorCD, 
        evil: false,
        havePower: true,
        action: {
            type: 'protect',
            title: "Choose a player to protect",
            desc: "You can protect yourself",
            button: "Protect"
        }
    },
    {
        id: 'jester',
        name: 'Jester', 
        value: 'jester', 
        img: JesterCD, 
        evil: false,
        havePower: false,
    },
    {
        id: 'knight',
        name: 'Knight', 
        value: 'knight', 
        img: KnightCD, 
        evil: false,
        havePower: true,
        action: {
            type: 'kill',
            title: "Choose a player to kill",
            desc: "Make sure you kill the right one, if you're wrong, you dead!!",
            button: "Kill"
        }
    },
];

export default roles;