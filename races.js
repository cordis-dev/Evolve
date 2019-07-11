import { global } from './vars.js';
import { loc } from './locale.js';

export const races = {
    protoplasm: {
        name: 'Protoplasm',
        desc: loc('race_protoplasm'),
        type: 'organism',
        home: 'Prehistoric'
    },
    human: {
        name: 'Human',
        desc: loc('race_human'),
        type: 'humanoid',
        home: 'Terra',
        entity: loc('race_human_entity'),
        traits: {
            creative: 1,
            diverse: 1
        },
        solar: {
            red: 'Mars',
            hell: 'Mercury',
            gas: 'Jupiter',
            gas_moon: 'Ganymede',
            dwarf: 'Ceres',
        }
    },
    elven: {
        name: 'Elf',
        desc: loc('race_elven'),
        type: 'humanoid',
        home: 'Valinor',
        entity: loc('race_elven_entity'),
        traits: { 
            studious: 1,
            arrogant: 1
        },
        solar: {
            red: 'Aman',
            hell: 'Eremandu',
            gas: 'Elenion',
            gas_moon: 'Tirion',
            dwarf: 'Naugrim',
        }
    },
    orc: {
        name: 'Orc',
        desc: loc('race_orc'),
        type: 'humanoid',
        home: 'Roneard',
        entity: loc('race_orc_entity'),
        traits: { 
            brute: 1,
            angry: 1
        },
        solar: {
            red: 'Krom',
            hell: 'Mordor',
            gas: 'Crush',
            gas_moon: 'Hammerfell',
            dwarf: 'Mace',
        }
    },
    cath: {
        name: 'Cath',
        desc: loc('race_cath'),
        type: 'animal',
        home: 'Cathar',
        entity: loc('race_cath_entity'),
        traits: { 
            lazy: 1,
            carnivore: 1
        },
        solar: {
            red: 'Tabbi',
            hell: 'Vac',
            gas: 'Garth',
            gas_moon: 'Purrth',
            dwarf: 'Kith',
        }
    },
    wolven: {
        name: 'Wolven',
        desc: loc('race_wolven'),
        type: 'animal',
        home: 'Wolvar',
        entity: loc('race_wolven_entity'),
        traits: { 
            pack_mentality: 1,
            tracker: 1
        },
        solar: {
            red: 'Pack',
            hell: 'Howl',
            gas: 'Rayet',
            gas_moon: 'Fang',
            dwarf: 'Runt',
        }
    },
    centaur: {
        name: 'Centaur',
        desc: loc('race_centaur'),
        type: 'animal',
        home: 'Sagittarius',
        entity: loc('race_centaur_entity'),
        traits: {
            beast_of_burden: 1,
            herbivore: 1
        },
        solar: {
            red: 'Chiron',
            hell: 'Hydra',
            gas: 'Barnard',
            gas_moon: 'Hay',
            dwarf: 'Pony',
        }
    },
    kobold: {
        name: 'Kobold',
        desc: loc('race_kobold'),
        type: 'small',
        home: 'Wax',
        entity: loc('race_kobold_entity'),
        traits: {
            pack_rat: 1,
            paranoid: 1
        },
        solar: {
            red: 'Wick',
            hell: 'Melt',
            gas: 'Horde',
            gas_moon: 'Task',
            dwarf: 'Satchel',
        }
    },
    goblin: {
        name: 'Goblin',
        desc: loc('race_goblin'),
        type: 'small',
        home: 'Crassus',
        entity: loc('race_goblin_entity'),
        traits: { 
            greedy: 1,
            merchant: 1
        },
        solar: {
            red: 'Cixi',
            hell: 'Sixtus',
            gas: 'Ponzi',
            gas_moon: 'Tweed',
            dwarf: 'Marcos',
        }
    },
    gnome: {
        name: 'Gnome',
        desc: loc('race_gnome'),
        type: 'small',
        home: 'Lawn',
        entity: loc('race_gnome_entity'),
        traits: { 
            smart: 1,
            puny: 1
        },
        solar: {
            red: 'Shire',
            hell: 'Boot',
            gas: 'Dwarf',
            gas_moon: 'Trogg',
            dwarf: 'Napoleon',
        }
    },
    orge: {
        name: 'Ogre',
        desc: loc('race_ogre'),
        type: 'giant',
        home: 'Mourn',
        entity: loc('race_ogre_entity'),
        traits: { 
            dumb: 1,
            tough: 1
        },
        solar: {
            red: 'Latva',
            hell: 'Maw',
            gas: 'Tanoth',
            gas_moon: 'Goria',
            dwarf: 'Grok',
        }
    },
    cyclops: {
        name: 'Cyclops',
        desc: loc('race_cyclops'),
        type: 'giant',
        home: 'Unus',
        entity: loc('race_cyclops_entity'),
        traits: {
            nearsighted: 1,
            intelligent: 1
        },
        solar: {
            red: 'Hesiod',
            hell: 'Phemus',
            gas: 'Balor',
            gas_moon: 'Jian',
            dwarf: 'Sokhor',
        }
    },
    troll: {
        name: 'Troll',
        desc: loc('race_troll'),
        type: 'giant',
        home: 'Brücke',
        entity: loc('race_troll_entity'),
        traits: {
            regenerative: 1,
            gluttony: 1
        },
        solar: {
            red: 'Mojo',
            hell: 'Sulfide',
            gas: 'Voodoo',
            gas_moon: 'Hex',
            dwarf: 'Shadow',
        }
    },
    tortoisan: {
        name: 'Tortoisan',
        desc: loc('race_tortoisan'),
        type: 'reptilian',
        home: 'Splinter',
        entity: loc('race_tortoisan_entity'),
        traits: { 
            slow: 1,
            armored: 1
        },
        solar: {
            red: 'Rock',
            hell: 'Shade',
            gas: 'Ooze',
            gas_moon: 'Shred',
            dwarf: 'Shell',
        }
    },
    gecko: {
        name: 'Gecko',
        desc: loc('race_gecko'),
        type: 'reptilian',
        home: 'Ijsabom',
        entity: loc('race_gecko_entity'),
        traits: {
            optimistic: 1,
            chameleon: 1
        },
        solar: {
            red: 'Setae',
            hell: 'Claim',
            gas: 'Godzilla',
            gas_moon: 'Gekkota',
            dwarf: 'Ackie',
        }
    },
    slitheryn: {
        name: 'Slitheryn',
        desc: loc('race_slitheryn'),
        type: 'reptilian',
        home: 'Viper',
        entity: loc('race_slitheryn_entity'),
        traits: {
            slow_digestion: 1,
            hard_of_hearing: 1
        },
        solar: {
            red: 'Cobra',
            hell: 'Ecdysis',
            gas: 'Serpens',
            gas_moon: 'Python',
            dwarf: 'Boa',
        }
    },
    arraak: {
        name: 'Arraak',
        desc: loc('race_arraak'),
        type: 'avian',
        home: 'Daphne',
        entity: loc('race_arraak_entity'),
        traits: {
            resourceful: 1,
            selenophobia: 1
        },
        solar: {
            red: 'Hitch',
            hell: 'Flock',
            gas: 'Down',
            gas_moon: 'Peck',
            dwarf: 'Chick',
        }
    },
    pterodacti: {
        name: 'Pterodacti',
        desc: loc('race_pterodacti'),
        type: 'avian',
        home: 'Crichton',
        entity: loc('race_pterodacti_entity'),
        traits: {
            leathery: 1,
            pessimistic: 1
        },
        solar: {
            red: 'Jurassic',
            hell: 'Prey',
            gas: 'Andromeda',
            gas_moon: 'Sphere',
            dwarf: 'Micro',
        }
    },
    dracnid: {
        name: 'Dracnid',
        desc: loc('race_dracnid'),
        type: 'avian',
        home: 'Draco',
        entity: loc('race_dracnid_entity'),
        traits: {
            hoarder: 1,
            solitary: 1
        },
        solar: {
            red: 'Onyx',
            hell: 'Slayer',
            gas: 'Ancalagon',
            gas_moon: 'Wyrm',
            dwarf: 'Drake',
        }
    },
    entish: {
        name: 'Ent',
        desc: loc('race_entish'),
        type: 'plant',
        home: 'Fangorn',
        entity: loc('race_entish_entity'),
        traits: {
            kindling_kindred: 1,
            pyrophobia: 1
        },
        solar: {
            red: 'Entmoot',
            hell: 'Orthanc',
            gas: 'Yavanna',
            gas_moon: 'Onodrim',
            dwarf: 'Branch',
        }
    },
    cacti: {
        name: 'Cacti',
        desc: loc('race_cacti'),
        type: 'plant',
        home: 'Bikanel',
        entity: loc('race_cacti_entity'),
        traits: {
            hyper: 1,
            skittish: 1
        },
        solar: {
            red: 'Corel',
            hell: 'Ruin',
            gas: 'Saguaro',
            gas_moon: 'Cholla',
            dwarf: 'Thorn',
        }
    },
    sporgar: {
        name: 'Sporgar',
        desc: loc('race_sporgar'),
        type: 'fungi',
        home: 'Zanger',
        entity: loc('race_sporgar_entity'),
        traits: {
            infectious: 1,
            parasite: 1
        },
        solar: {
            red: 'Ophio',
            hell: 'Cymbo',
            gas: 'Tyrant',
            gas_moon: 'Nemesis',
            dwarf: 'Whesker',
        }
    },
    shroomi: {
        name: 'Shroomi',
        desc: loc('race_shroomi'),
        type: 'fungi',
        home: 'Armillaria',
        entity: loc('race_shroomi_entity'),
        traits: {
            toxic: 1,
            nyctophilia: 1
        },
        solar: {
            red: 'Bloom',
            hell: 'Polypore',
            gas: 'Psilocybin',
            gas_moon: 'Skullcap',
            dwarf: 'Crimini',
        }
    },
    mantis: {
        name: 'Mantis',
        desc: loc('race_mantis'),
        type: 'insectoid',
        home: 'Chryssalid',
        entity: loc('race_mantis_entity'),
        traits: {
            fraile: 1,
            malnutrition: 1
        },
        solar: {
            red: 'Nineveh',
            hell: 'Molt',
            gas: 'Devil',
            gas_moon: 'Ghost',
            dwarf: 'Empusa',
        }
    },
    scorpid: {
        name: 'Scorpid',
        desc: loc('race_scorpid'),
        type: 'insectoid',
        home: 'Scorpio',
        entity: loc('race_scorpid_entity'),
        traits: {
            claws: 1,
            atrophy: 1
        },
        solar: {
            red: 'Pincer',
            hell: 'Boil',
            gas: 'Emperor',
            gas_moon: 'Utescorpio',
            dwarf: 'Leiurus',
        }
    },
    antid: {
        name: 'Antid',
        desc: loc('race_antid'),
        type: 'insectoid',
        home: 'Menzel',
        entity: loc('race_antid_entity'),
        traits: {
            hivemind: 1,
            tunneler: 1
        },
        solar: {
            red: 'Hill',
            hell: 'Fluva',
            gas: 'Thorax',
            gas_moon: 'Pharaoh',
            dwarf: 'Odorous',
        }
    },
    sharkin: {
        name: 'Sharkin',
        desc: loc('race_sharkin'),
        type: 'aquatic',
        home: 'Baidam',
        entity: loc('race_sharkin_entity'),
        traits: {
            frenzy: 1,
            apex_predator: 1
        },
        solar: {
            red: 'Mako',
            hell: 'Hammerhead',
            gas: 'Whale',
            gas_moon: 'Bull',
            dwarf: 'Thresher',
        }
    },
    octigoran: {
        name: 'Octigoran',
        desc: loc('race_octigoran'),
        type: 'aquatic',
        home: 'Cetus',
        entity: loc('race_octigoran_entity'),
        traits: {
            invertebrate: 1,
            suction_grip: 1
        },
        solar: {
            red: 'Kraken',
            hell: 'Siren',
            gas: 'Godzilla',
            gas_moon: 'Moby',
            dwarf: 'Jaws',
        }
    },
    balorg: {
        name: 'Balorg',
        desc: loc('race_balorg'),
        type: 'demonic',
        home: 'Abyss',
        entity: loc('race_balorg_entity'),
        traits: {
            fiery: 1,
            terrifying: 1
        },
        solar: {
            red: 'Azzagrat',
            hell: 'Smaragd',
            gas: 'Thanatos',
            gas_moon: 'Shedaklah',
            dwarf: 'Belistor',
        }
    },
    imp: {
        name: 'Imp',
        desc: loc('race_imp'),
        type: 'demonic',
        home: 'Baator',
        entity: loc('race_imp_entity'),
        traits: {
            compact: 1,
            conniving: 1,
            pathetic: 1,
        },
        solar: {
            red: 'Avernus',
            hell: 'Dis',
            gas: 'Minauros',
            gas_moon: 'Phlegethos',
            dwarf: 'Stygia',
        }
    }
};

export const genus_traits = {
    humanoid: {
        adaptable: 1,
        xenophobic: 1
    },
    animal: {
        beast: 1,
        cautious: 1
    },
    small: {
        small: 1,
        weak: 1
    },
    giant: {
        large: 1,
        strong: 1
    },
    reptilian: {
        cold_blooded: 1,
        scales: 1
    },
    avian: {
        hollow_bones: 1,
        rigid: 1
    },
    insectoid: {
        fast_growth: 1,
        high_metabolism: 1
    },
    plant: {
        photosynth: 1,
        asymmetrical: 1
    },
    fungi: {
        spores: 1,
        spongy: 1
    },
    aquatic: {
        submerged: 1,
        low_light: 1
    },
    demonic: {
        immoral: 1,
        evil: 1
    }
};

export const traits = {
    adaptable: { // Genetic Mutations occur faster from gene tampering
        desc: loc('trait_adaptable'),
        type: 'genus',
    },
    xenophobic: { // Trade posts suffer a -1 penalty per post
        desc: loc('trait_xenophobic'),
        type: 'genus',
    },
    beast: { // Hunting improved when it's windy
        desc: loc('trait_beast'),
        type: 'genus',
    },
    cautious: { // Rain reduces combat rating
        desc: loc('trait_cautious'),
        type: 'genus',
    },
    small: { // Reduces cost creep multipliers by 0.01
        desc: loc('trait_small'),
        type: 'genus',
    },
    weak: { // Lumberjacks, miners, and quarry workers are 10% less effective
        desc: loc('trait_weak'),
        type: 'genus',
    },
    large: { // Increases cost creep multipliers by 0.01
        desc: loc('trait_large'),
        type: 'genus',
    },
    strong: { // Increased manual resource gain
        desc: loc('trait_strong'),
        type: 'genus',
    },
    cold_blooded: { // Weather affects productivity
        desc: loc('trait_cold_blooded'),
        type: 'genus',
    },
    scales: { // Minor decrease of soldiers killed in combat
        desc: loc('trait_scales'),
        type: 'genus',
    },
    hollow_bones: { // Less Crafted Materials Needed
        desc: loc('trait_hollow_bones'),
        type: 'genus',
    },
    rigid: { // Crafting production lowered slightly
        desc: loc('trait_rigid'),
        type: 'genus',
    },
    fast_growth: { // Greatly increases odds of population growth each cycle
        desc: loc('trait_fast_growth'),
        type: 'genus',
    },
    high_metabolism: { // Food requirements increased by 10%
        desc: loc('trait_high_metabolism'),
        type: 'genus',
    },
    photosynth: { // Reduces food requirements dependant on sunshine.
        desc: loc('trait_photosynth'),
        type: 'genus',
    },
    asymmetrical: { // Trade selling prices are slightly worse then normal
        desc: loc('trait_asymmetrical'),
        type: 'genus',
    },
    spores: { // Birthrate increased when it's windy
        desc: loc('trait_spores'),
        type: 'genus',
    },
    spongy: { // Birthrate decreased when it's raining
        desc: loc('trait_spongy'),
        type: 'genus',
    },
    submerged: { // Immune to weather effects
        desc: loc('trait_submerged'),
        type: 'genus',
    },
    low_light: { // Farming effectiveness decreased
        desc: loc('trait_low_light'),
        type: 'genus',
    },
    immoral: { // Warmonger is a bonus instead of a penalty
        desc: loc('trait_immoral'),
        type: 'genus',
    },
    evil: { // You are pure evil
        desc: loc('trait_evil'),
        type: 'genus',
    },
    creative: { // A.R.P.A. Projects are cheaper
        desc: loc('trait_creative'),
        type: 'major',
    },
    diverse: { // Training soldiers takes longer
        desc: loc('trait_diverse'),
        type: 'major',
    },
    studious: { // Professors generate an extra 0.25 Knowledge per second
        desc: loc('trait_studious'),
        type: 'major',
    },
    arrogant: { // Market prices are higher
        desc: loc('trait_arrogant'),
        type: 'major',
    },
    brute: { // Recruitment costs are 1/2 price
        desc: loc('trait_brute'),
        type: 'major',
    },
    angry: { // When hungry you get hangry, low food penalty is more severe
        desc: loc('trait_angry'),
        type: 'major',
    },
    lazy: { // All production is lowered when the temperature is hot
        desc: loc('trait_lazy'),
        type: 'major',
    },
    carnivore: { // No agriculture tech tree path, however unemployed citizens now act as hunters.
        desc: loc('trait_carnivore'),
        type: 'major',
    },
    pack_mentality: { // Cabins cost more, but cottages cost less.
        desc: loc('trait_pack_mentality'),
        type: 'major',
    },
    tracker: { // 10% increased gains from hunting
        desc: loc('trait_tracker'),
        type: 'major',
    },
    beast_of_burden: { // Gains more loot during raids
        desc: loc('trait_beast_of_burden'),
        type: 'major',
    },
    herbivore: { // No food is gained from hunting
        desc: loc('trait_herbivore'),
        type: 'major',
    },
    pack_rat: { // Storage space is increased
        desc: loc('trait_pack_rat'),
        type: 'major',
    },
    paranoid: { // Bank capacity reduced by 10%
        desc: loc('trait_paranoid'),
        type: 'major',
    },
    greedy: { // Lowers income from taxes
        desc: loc('trait_greedy'),
        type: 'major',
    },
    merchant: { // Better commodity selling prices
        desc: loc('trait_merchant'),
        type: 'major',
    },
    smart: { // Knowledge costs reduced by 10%
        desc: loc('trait_smart'),
        type: 'major',
    },
    puny: { // Lowers minium bound for army score roll
        desc: loc('trait_puny'),
        type: 'major',
    },
    dumb: { // Knowledge costs increased by 5%
        desc: loc('trait_dumb'),
        type: 'major',
    },
    tough: { // Mining output increased by 25%
        desc: loc('trait_tough'),
        type: 'major',
    },
    nearsighted: { // Libraries are less effective
        desc: loc('trait_nearsighted'),
        type: 'major',
    },
    intelligent: { // Professors and Scientists add a global production bonus
        desc: loc('trait_intelligent'),
        type: 'major',
    },
    regenerative: { // Wounded soldiers heal 4x as fast
        desc: loc('trait_regenerative'),
        type: 'major',
    },
    gluttony: { // Eats 25% more food per rank
        desc: loc('trait_gluttony'),
        type: 'major',
    },
    slow: { // The game moves at a 10% slower pace
        desc: loc('trait_slow'),
        type: 'major',
    },
    armored: { // Less soldiers die in combat
        desc: loc('trait_armored'),
        type: 'major',
    },
    optimistic: { // Minor reduction to stress
        desc: loc('trait_optimistic'),
        type: 'major',
    },
    chameleon: { // Barracks have less soldiers
        desc: loc('trait_chameleon'),
        type: 'major',
    },
    slow_digestion: { // Your race is more resilient to starvation
        desc: loc('trait_slow_digestion'),
        type: 'major',
    },
    hard_of_hearing: { // University science cap gain reduced by 5%
        desc: loc('trait_hard_of_hearing'),
        type: 'major',
    },
    resourceful: { // Crafting costs are reduced slightly
        desc: loc('trait_resourceful'),
        type: 'major',
    },
    selenophobia: { // Moon phase directly affects productivity, on average this is slightly negative
        desc: loc('trait_selenophobia'),
        type: 'major',
    },
    leathery: { // Morale penalty from some weather conditions are reduced.
        desc: loc('trait_leathery'),
        type: 'major',
    },
    pessimistic: { // Minor increase to stress
        desc: loc('trait_pessimistic'),
        type: 'major',
    },
    hoarder: { // Banks can store 20% more money
        desc: loc('trait_hoarder'),
        type: 'major',
    },
    solitary: { // Cabins are cheaper however cottages cost more
        desc: loc('trait_solitary'),
        type: 'major',
    },
    kindling_kindred: { // Lumber is no longer a resource, however other costs are increased for anything that would have used lumber to compensate.
        desc: loc('trait_kindling_kindred'),
        type: 'major',
    },
    pyrophobia: { // Smelter productivity is reduced
        desc: loc('trait_pyrophobia'),
        type: 'major',
    },
    hyper: { // The game moves at a 5% faster pace
        desc: loc('trait_hyper'),
        type: 'major',
    },
    skittish: { // Thunderstorms lower all production
        desc: loc('trait_skittish'),
        type: 'major',
    },
    infectious: { // Attacking has a chance to infect other creatures and grow your population
        desc: loc('trait_infectious'),
        type: 'major',
    },
    parasite: { // You can only reproduce by infecting victims, spores sometimes find a victim when it's windy
        desc: loc('trait_parasite'),
        type: 'major',
    },
    toxic: { // Factory type jobs are more productive
        desc: loc('trait_toxic'),
        type: 'major',
    },
    nyctophilia: { // Productivity is lost when it is sunny
        desc: loc('trait_nyctophilia'),
        type: 'major',
    },
    frail: { // More soldiers die in combat
        desc: loc('trait_frail'),
        type: 'major',
    },
    malnutrition: { // The rationing penalty is weaker
        desc: loc('trait_malnutrition'),
        type: 'major',
    },
    claws: { // Raises maximum bound for army score roll
        desc: loc('trait_claws'),
        type: 'major',
    },
    atrophy: { // More prone to starvation
        desc: loc('trait_atrophy'),
        type: 'major',
    },
    hivemind: { // Jobs with low citizen counts assigned to them have reduced output, but those with high numbers have increased output. 
        desc: loc('trait_hivemind'),
        type: 'major',
    },
    tunneler: { // Mines and Coal Mines are cheaper. 
        desc: loc('trait_tunneler'),
        type: 'major',
    },
    frenzy: { // Combat causes a temporary increase in morale
        desc: loc('trait_frenzy'),
        type: 'major',
    },
    apex_predator: { // Hunting and Combat ratings are significantly higher, but you can't use armor
        desc: loc('trait_apex_predator'),
        type: 'major',
    },
    invertebrate: { // You have no bones
        desc: loc('trait_invertebrate'),
        type: 'major',
    },
    suction_grip: { // Global productivity boost
        desc: loc('trait_suction_grip'),
        type: 'major',
    },
    fiery: { // Major war bonus
        desc: loc('trait_fiery'),
        type: 'major',
    },
    terrifying: { // No one will trade with you
        desc: loc('trait_terrifying'),
        type: 'major',
    },
    compact: { // You hardly take up any space at all
        desc: loc('trait_compact'),
        type: 'major',
    },
    conniving: { // Better trade deals
        desc: loc('trait_conniving'),
        type: 'major',
    },
    pathetic: { // You suck at combat
        desc: loc('trait_pathetic'),
        type: 'major',
    },
    tactical: { // War Bonus
        desc: loc('trait_tactical'),
        type: 'minor',
    },
    analytical: { // Science Bonus
        desc: loc('trait_analytical'),
        type: 'minor',
    },
    promiscuous: { // Population Growth Bonus
        desc: loc('trait_promiscuous'),
        type: 'minor',
    },
    resilient: { // Coal Mining Bonus
        desc: loc('trait_resilient'),
        type: 'minor',
    },
    cunning: { // Hunting Bonus
        desc: loc('trait_cunning'),
        type: 'minor',
    },
    hardy: { // Factory Woker Bonus
        desc: loc('trait_hardy'),
        type: 'minor',
    },
    ambidextrous: { // Crafting Bonus
        desc: loc('trait_ambidextrous'),
        type: 'minor',
    },
    industrious: { // Miner Bonus
        desc: loc('trait_industrious'),
        type: 'minor',
    },
    content: { // Morale Bonus
        desc: loc('trait_content'),
        type: 'minor',
    },
};

/*
types: farmer, miner, lumberjack, science, factory, army, hunting
*/
export function racialTrait(workers,type){
    let modifier = 1; 
    if (global.race['hivemind'] && type !== 'farmer'){
        if (workers <= 10){
            modifier *= (workers * 0.05) + 0.5;
        }
        else {
            modifier *= 1 + (1 - (0.98 ** (workers - 10)));
        }
    }
    if(global.race['cold_blooded'] && type !== 'army' && type !== 'factory' && type !== 'science'){
        switch(global.city.calendar.temp){
            case 0:
                modifier *= 0.8;
                break;
            case 2:
                modifier *= 1.1;
                break;
            default:
                modifier *= 1;
                break;
        }
        switch(global.city.calendar.weather){
            case 0:
                modifier *= 0.8;
                break;
            case 2:
                modifier *= 1.1;
                break;
            default:
                modifier *= 1;
                break;
        }
    }
    if (global.race['weak'] && (type === 'miner' || type === 'lumberjack')){
        modifier *= 0.9;
    }
    if (global.race['hydrophilic'] && global.city.calendar.weather === 0 && global.city.calendar.temp > 0 && type !== 'factory'){
        modifier *= 0.75;
    }
    if (global.race['toxic'] && type === 'factory'){
        modifier *= 1.25;
    }
    if (global.race['hardy'] && type === 'factory'){
        modifier *= 1 + (global.race['hardy'] / 100);
    }
    if (global.race['analytical'] && type === 'science'){
        modifier *= 1 + (global.race['analytical'] / 100);
    }
    return modifier;
}

export function randomMinorTrait(){
    let trait_list = [];
    Object.keys(traits).forEach(function (t){
        if (traits[t].type === 'minor'){
            trait_list.push(t);
        }
    });
    let trait = trait_list[Math.floor(Math.seededRandom(0,trait_list.length))];
    if (global.race[trait]){
        global.race[trait]++;
    }
    else {
        global.race[trait] = 1;
    }
}

export const biomes = {
    grassland: loc('biome_grassland'),
    oceanic: loc('biome_oceanic'),
    forest: loc('biome_forest'),
    desert: loc('biome_desert'),
    volcanic: loc('biome_volcanic'),
    tundra: loc('biome_tundra'),
    hellscape: loc('biome_hellscape')
};
