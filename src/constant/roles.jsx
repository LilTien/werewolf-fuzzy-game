import BlacksmithCD from '../assets/cards/blacksmith.png'
import DoctorCD from '../assets/cards/doctor.png'
import FarmerrabitCD from '../assets/cards/farmerrabit.png'
import FoxCD from '../assets/cards/fox.png'
import FrogCD from '../assets/cards/frog.png'
import JesterCD from '../assets/cards/jester.png'
import KnightCD from '../assets/cards/knight.png'
import SeerCD from '../assets/cards/seer.png'
import ShamanCD from '../assets/cards/shaman.png'
import TravellerMouseCD from '../assets/cards/travellermouse.png'
import WerewolfCD from '../assets/cards/werewolf.png'


const roles = [
    {id: 'werewolf',name: 'Werewolf', value: 'werewolf', img: WerewolfCD, evil: true},
    {id: 'villager',name: 'Villager', value: 'villager', img: TravellerMouseCD, evil: false},
    {id:'shaman' ,name: 'Shaman', value: 'shaman', img: ShamanCD, evil: true},
    {id: 'seer',name: 'Seer', value: 'seer', img:SeerCD , evil: false},
    {id: 'doctor',name: 'Doctor', value: 'doctor', img: DoctorCD, evil: false},
    {id: 'jester',name: 'Jester', value: 'jester', img: JesterCD, evil: false},
    {id: 'knight',name: 'Knight', value: 'knight', img: KnightCD, evil: false},
];

export default roles;