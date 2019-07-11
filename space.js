import { global, vues, poppers, messageQueue, p_on, belt_on, quantium_level } from './vars.js';
import { unlockAchieve } from './achieve.js';
import { races } from './races.js';
import { spatialReasoning } from './resources.js';
import { loadFoundry } from './jobs.js';
import { payCosts, setAction } from './actions.js';
import { loc } from './locale.js';

const spaceProjects = {
    spc_home: {
        info: {
            name(){
                return races[global.race.species].home;
            },
            desc: loc('space_home_info_desc'),
        },
        test_launch: {
            id: 'space-test_launch',
            title: loc('space_home_test_launch_title'),
            desc: loc('space_home_test_launch_desc'),
            reqs: { space: 1 },
            grant: ['space',2],
            cost: {
                Money(){ return 100000; },
                Oil(){ return 7500; }
            },
            effect: loc('space_home_test_launch_effect'),
            action(){
                if (payCosts(spaceProjects.spc_home.test_launch.cost)){
                    global.space['satellite'] = { count: 0 };
                    messageQueue(loc('space_home_test_launch_action'),'success');
                    return true;
                }
                return false;
            }
        },
        satellite: {
            id: 'space-satellite',
            title: loc('space_home_satellite_title'),
            desc: loc('space_home_satellite_desc'),
            reqs: { space: 2 },
            cost: {
                Money(){ return costMultiplier('satellite', 75000, 1.25); },
                Knowledge(){ return costMultiplier('satellite', 40000, 1.25); },
                Oil(){ return costMultiplier('satellite', fuel_adjust(3200), 1.25); },
                Alloy(){ return costMultiplier('satellite', 10000, 1.25); }
            },
            effect: `<div>${loc('plus_max_resource',[750,loc('resource_Knowledge_name')])}</div><div>${loc('space_home_satellite_effect2',[global.race['evil'] ? loc('city_babel_title') : loc('city_wardenclyffe')])}</div><div>${loc('space_home_satellite_effect3')}</div>`,
            action(){
                if (payCosts(spaceProjects.spc_home.satellite.cost)){
                    incrementStruct('satellite');
                    global['resource']['Knowledge'].max += 750;
                    return true;
                }
                return false;
            }
        },
        gps: {
            id: 'space-gps',
            title: loc('space_home_gps_title'),
            desc(){
                if (global.space['gps'].count < 4){
                    return `<div>${loc('space_home_gps_desc')}</div><div class="has-text-special">${loc('space_home_gps_desc_req')}</div>`;
                }
                else {
                    return `<div>${loc('space_home_gps_desc')}</div>`;
                }
            },
            reqs: { satellite: 1 },
            not_trait: ['terrifying'],
            cost: {
                Money(){ return costMultiplier('gps', 75000, 1.18); },
                Knowledge(){ return costMultiplier('gps', 50000, 1.18); },
                Copper(){ return costMultiplier('gps', 6500, 1.18); },
                Oil(){ return costMultiplier('gps', fuel_adjust(3500), 1.18); },
                Titanium(){ return costMultiplier('gps', 8000, 1.18); }
            },
            effect(){
                if (global.space['gps'].count < 4){
                    return loc('space_home_gps_effect_req');
                }
                else {
                    return loc('space_home_gps_effect');
                }
            },
            action(){
                if (payCosts(spaceProjects.spc_home.gps.cost)){
                    incrementStruct('gps');
                    return true;
                }
                return false;
            }
        },
        propellant_depot: {
            id: 'space-propellant_depot',
            title: loc('space_home_propellant_depot_title'),
            desc: loc('space_home_propellant_depot_desc'),
            reqs: { space_explore: 1 },
            cost: {
                Money(){ return costMultiplier('propellant_depot', 55000, 1.35); },
                Aluminium(){ return costMultiplier('propellant_depot', 22000, 1.35); },
                Oil(){ return costMultiplier('propellant_depot', fuel_adjust(5500), 1.35); },
            },
            effect(){
                let oil = spatialReasoning(1250) * (global.tech['world_control'] ? 1.5 : 1);
                if (global.resource['Helium_3'].display){
                    let helium = spatialReasoning(1000) * (global.tech['world_control'] ? 1.5 : 1);
                    return `<div>${loc('plus_max_resource',[oil,loc('resource_Oil_name')])}</div><div>${loc('plus_max_resource',[helium,loc('resource_Helium_3_name')])}</div>`;
                }
                return `<div>${loc('plus_max_resource',[oil,loc('resource_Oil_name')])}</div>`;
            },
            action(){
                if (payCosts(spaceProjects.spc_home.propellant_depot.cost)){
                    incrementStruct('propellant_depot');
                    global['resource']['Oil'].max += spatialReasoning(1250) * (global.tech['world_control'] ? 1.5 : 1);
                    if (global.resource['Helium_3'].display){
                        global['resource']['Helium_3'].max += spatialReasoning(1000) * (global.tech['world_control'] ? 1.5 : 1);
                    }
                    return true;
                }
                return false;
            }
        },
        nav_beacon: {
            id: 'space-nav_beacon',
            title: loc('space_home_nav_beacon_title'),
            desc: `<div>${loc('space_home_nav_beacon_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`,
            reqs: { luna: 2 },
            cost: {
                Money(){ return costMultiplier('nav_beacon', 75000, 1.32); },
                Copper(){ return costMultiplier('nav_beacon', 38000, 1.32); },
                Aluminium(){ return costMultiplier('nav_beacon', 44000, 1.32); },
                Oil(){ return costMultiplier('nav_beacon', fuel_adjust(12500), 1.32); },
                Iridium(){ return costMultiplier('nav_beacon', 1200, 1.32); }
            },
            powered: 2,
            effect(){
                return `<div>${loc('space_home_nav_beacon_effect1')}</div><div>${loc('space_home_nav_beacon_effect2')}</div>`;
            },
            action(){
                if (payCosts(spaceProjects.spc_home.nav_beacon.cost)){
                    incrementStruct('nav_beacon');
                    if (global.city.powered && global.city.power >= spaceProjects.spc_home.nav_beacon.powered){
                        global.space.nav_beacon.on++;
                    }
                    return true;
                }
                return false;
            }
        },
    },
    spc_moon: {
        info: {
            name: loc('space_moon_info_name'),
            desc(){
                let home = races[global.race.species].home;
                return loc('space_moon_info_desc',[home]);
            },
            support: 'moon_base',
        },
        moon_mission: {
            id: 'space-moon_mission',
            title: loc('space_moon_mission_title'),
            desc: loc('space_moon_mission_desc'),
            reqs: { space: 2, space_explore: 2 },
            grant: ['space',3],
            cost: { 
                Oil(){ return +fuel_adjust(12000).toFixed(0); }
            },
            effect: loc('space_moon_mission_effect'),
            action(){
                if (payCosts(spaceProjects.spc_moon.moon_mission.cost)){
                    messageQueue(loc('space_moon_mission_action'),'success');
                    global.space['iridium_mine'] = { count: 0, on: 0 };
                    global.space['helium_mine'] = { count: 0, on: 0 };
                    return true;
                }
                return false;
            }
        },
        moon_base: {
            id: 'space-moon_base',
            title: loc('space_moon_base_title'),
            desc: `<div>${loc('space_moon_base_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`,
            reqs: { space: 3 },
            cost: {
                Money(){ return costMultiplier('moon_base', 22000, 1.32); },
                Cement(){ return costMultiplier('moon_base', 18000, 1.32); },
                Alloy(){ return costMultiplier('moon_base', 7800, 1.32); },
                Polymer(){ return costMultiplier('moon_base', 12500, 1.32); }
            },
            effect(){
                let iridium = spatialReasoning(500);
                let oil = +(fuel_adjust(2)).toFixed(2);
                return `<div>${loc('space_moon_base_effect1')}</div><div>${loc('plus_max_resource',[iridium,loc('resource_Iridium_name')])}</div><div>${loc('space_moon_base_effect3',[oil,spaceProjects.spc_moon.moon_base.powered])}</div>`;
            },
            support: 2,
            powered: 4,
            refresh: true,
            action(){
                if (payCosts(spaceProjects.spc_moon.moon_base.cost)){
                    incrementStruct('moon_base');
                    global.resource.Iridium.display = true;
                    global.resource['Helium_3'].display = true;
                    if (global.city.power >= 5){
                        global.space['moon_base'].on++;
                    }
                    if (global.space['moon_base'].count === 1){
                        global.tech['moon'] = 1;
                    }
                    if (!global.tech['luna']){
                        global.tech['luna'] = 1;
                    }
                    return true;
                }
                return false;
            }
        },
        iridium_mine: {
            id: 'space-iridium_mine',
            title: loc('space_moon_iridium_mine_title'),
            desc: `<div>${loc('space_moon_iridium_mine_desc')}</div><div class="has-text-special">${loc('space_support',[loc('space_moon_info_name')])}</div>`,
            reqs: { space: 3, luna: 1 },
            cost: {
                Money(){ return costMultiplier('iridium_mine', 42000, 1.35); },
                Lumber(){ return costMultiplier('iridium_mine', 9000, 1.35); },
                Titanium(){ return costMultiplier('iridium_mine', 17500, 1.35); }
            },
            effect(){
                let iridium = +(0.035 * zigguratBonus()).toFixed(3);
                return `<div>${loc('space_used_support',[loc('space_moon_info_name')])}</div><div>${loc('space_moon_iridium_mine_effect',[iridium])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_moon.iridium_mine.cost)){
                    incrementStruct('iridium_mine');
                    if (!global.resource['Mythril'].display){
                        global.resource['Mythril'].display = true;
                        loadFoundry();
                    }
                    if (global.space.moon_base.support < global.space.moon_base.s_max){
                        global.space['iridium_mine'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        helium_mine: {
            id: 'space-helium_mine',
            title: loc('space_moon_helium_mine_title'),
            desc: `<div>${loc('space_moon_helium_mine_desc')}</div><div class="has-text-special">${loc('space_support',[loc('space_moon_info_name')])}</div>`, //TODO: the description here was separated in two div's
            reqs: { space: 3, luna: 1 },
            cost: {
                Money(){ return costMultiplier('helium_mine', 38000, 1.35); },
                Aluminium(){ return costMultiplier('helium_mine', 9000, 1.35); },
                Steel(){ return costMultiplier('helium_mine', 17500, 1.35); }
            },
            effect(){
                let storage = spatialReasoning(100);
                let helium = +(0.18 * zigguratBonus()).toFixed(3);
                return `<div>${loc('space_used_support',[loc('space_moon_info_name')])}</div><div>${loc('space_moon_helium_mine_effect',[helium])}</div><div>${loc('plus_max_resource',[storage,loc('resource_Helium_3_name')])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_moon.helium_mine.cost)){
                    incrementStruct('helium_mine');
                    if (global.space.moon_base.support < global.space.moon_base.s_max){
                        global.space['helium_mine'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        observatory: {
            id: 'space-observatory',
            title: loc('space_moon_observatory_title'),
            desc: `<div>${loc('space_moon_observatory_desc')}</div><div class="has-text-special">${loc('space_support',[loc('space_moon_info_name')])}</div>`,
            reqs: { science: 9, luna: 1 },
            cost: {
                Money(){ return costMultiplier('observatory', 200000, 1.3); },
                Knowledge(){ return costMultiplier('observatory', 69000, 1.3); },
                Stone(){ return costMultiplier('observatory', 125000, 1.3); },
                Iron(){ return costMultiplier('observatory', 65000, 1.3); },
                Iridium(){ return costMultiplier('observatory', 1250, 1.3); }
            },
            effect(){
                return `<div>${loc('space_used_support',[loc('space_moon_info_name')])}</div><div>${loc('plus_max_resource',[5000,loc('resource_Knowledge_name')])}</div><div>${loc('space_moon_observatory_effect2')}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_moon.observatory.cost)){
                    incrementStruct('observatory');
                    if (global.space.moon_base.support < global.space.moon_base.s_max){
                        global.space['observatory'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
    },
    spc_red: {
        info: {
            name(){
                return races[global.race.species].solar.red;
            },
            desc(){
                return loc('space_red_info_desc',[races[global.race.species].solar.red]);
            },
            support: 'spaceport',
        },
        red_mission: {
            id: 'space-red_mission',
            title(){
                return loc('space_mission_title',[races[global.race.species].solar.red]);
            },
            desc(){
                return loc('space_mission_desc',[races[global.race.species].solar.red]);
            },
            reqs: { space: 3, space_explore: 3 },
            grant: ['space',4],
            cost: { 
                Helium_3(){ return +fuel_adjust(4500).toFixed(0); }
            },
            effect(){
                return loc('space_red_mission_effect',[races[global.race.species].solar.red]);
            },
            action(){
                if (payCosts(spaceProjects.spc_red.red_mission.cost)){
                    messageQueue(loc('space_red_mission_action',[races[global.race.species].solar.red]),'success');
                    global.space['living_quarters'] = { count: 0, on: 0 };
                    global.space['garage'] = { count: 0 };
                    global.space['red_mine'] = { count: 0, on: 0 };
                    global.space['fabrication'] = { count: 0, on: 0 };
                    return true;
                }
                return false;
            }
        },
        spaceport: {
            id: 'space-spaceport',
            title: loc('space_red_spaceport_title'),
            desc: `<div>${loc('space_red_spaceport_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`,
            reqs: { space: 4 },
            cost: {
                Money(){ return costMultiplier('spaceport', 47500, 1.32); },
                Iridium(){ return costMultiplier('spaceport', 1750, 1.32); },
                Mythril(){ return costMultiplier('spaceport', 25, 1.32); },
                Titanium(){ return costMultiplier('spaceport', 22500, 1.32); }
            },
            effect(){
                let helium = +(fuel_adjust(1.25)).toFixed(2);
                return `<div>${loc('space_red_spaceport_effect1',[races[global.race.species].solar.red])}</div><div>${loc('space_red_spaceport_effect2',[helium,spaceProjects.spc_red.spaceport.powered])}</div><div>${loc('space_red_spaceport_effect3')}</div>`;
            },
            support: 3,
            powered: 5,
            refresh: true,
            action(){
                if (payCosts(spaceProjects.spc_red.spaceport.cost)){
                    incrementStruct('spaceport');
                    if (global.city.power >= 5){
                        global.space['spaceport'].on++;
                    }
                    if (!global.tech['mars']){
                        global.tech['mars'] = 1;
                    }
                    return true;
                }
                return false;
            }
        },
        red_tower: {
            id: 'space-red_tower',
            title: loc('space_red_tower_title'),
            desc(){
                return `<div>${loc('space_red_tower_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { mars: 3 },
            cost: {
                Money(){ return costMultiplier('red_tower', 225000, 1.28); },
                Iron(){ return costMultiplier('red_tower', 22000, 1.28); },
                Cement(){ return costMultiplier('red_tower', 15000, 1.28); },
                Alloy(){ return costMultiplier('red_tower', 8000, 1.28); },
            },
            effect(){
                return `<div>${loc('space_red_tower_effect1',[races[global.race.species].solar.red])}</div><div>${loc('space_red_tower_effect2')}</div>`;
            },
            powered: 2,
            action(){
                if (payCosts(spaceProjects.spc_red.red_tower.cost)){
                    incrementStruct('red_tower');
                    if (global.city.power >= 2){
                        global.space['red_tower'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        living_quarters: {
            id: 'space-living_quarters',
            title: loc('space_red_living_quarters_title'),
            desc(){
                return `<div>${loc('space_red_living_quarters_desc')}</div><div class="has-text-special">${loc('space_support',[races[global.race.species].solar.red])}</div>`;
            },
            reqs: { mars: 1 },
            cost: {
                Money(){ return costMultiplier('living_quarters', house_adjust(38000), 1.28); },
                Steel(){ return costMultiplier('living_quarters', house_adjust(15000), 1.28); },
                Polymer(){ return costMultiplier('living_quarters', house_adjust(9500), 1.28); }
            },
            effect(){
                return `<div>${loc('space_used_support',[races[global.race.species].solar.red])}</div><div>${loc('plus_max_resource',[1,loc('colonist')])}</div><div>${loc('plus_max_resource',[1,loc('citizen')])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_red.living_quarters.cost)){
                    incrementStruct('living_quarters');
                    global.civic.colonist.display = true;
                    if (global.space.spaceport.support < global.space.spaceport.s_max){
                        global.space['living_quarters'].on++;
                        global['resource'][races[global.race.species].name].max += 1;
                    }
                    return true;
                }
                return false;
            }
        },
        garage: {
            id: 'space-garage',
            title: loc('space_red_garage_title'),
            desc(){
                return `<div>${loc('space_red_garage_desc')}</div>`;
            },
            reqs: { mars: 1 },
            cost: {
                Money(){ return costMultiplier('garage', 75000, 1.28); },
                Iron(){ return costMultiplier('garage', 12000, 1.28); },
                Brick(){ return costMultiplier('garage', 3000, 1.28); },
                Sheet_Metal(){ return costMultiplier('garage', 1500, 1.28); }
            },
            effect(){
                let multiplier = global.tech['particles'] >= 4 ? 1 + (global.tech['supercollider'] / 20) : 1;
                let containers = global.tech['particles'] >= 4 ? 20 + global.tech['supercollider'] : 20;
                if (global.tech['world_control']){
                    multiplier *= global.tech['world_control'] ? 2 : 1;
                    containers += 10;
                }
                multiplier *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole * 0.05) : 1;
                let copper = +(spatialReasoning(6500) * multiplier).toFixed(0);
                let iron = +(spatialReasoning(5500) * multiplier).toFixed(0);
                let cement = +(spatialReasoning(6000) * multiplier).toFixed(0);
                let steel = +(spatialReasoning(4500) * multiplier).toFixed(0);
                let titanium = +(spatialReasoning(3500) * multiplier).toFixed(0);
                let alloy = +(spatialReasoning(2500) * multiplier).toFixed(0);
                
                let desc = `<div>${loc('plus_max_resource',[containers,loc('resource_Containers_name')])}</div><div>${loc('plus_max_resource',[copper,global.resource.Copper.name])}</div><div>${loc('plus_max_resource',[iron,global.resource.Iron.name])}</div><div>${loc('plus_max_resource',[cement,global.resource.Cement.name])}</div><div>${loc('plus_max_resource',[steel,global.resource.Steel.name])}</div><div>${loc('plus_max_resource',[titanium,global.resource.Titanium.name])}</div><div>${loc('plus_max_resource',[alloy,global.resource.Alloy.name])}</div>`;
                if (global.resource.Nano_Tube.display){
                    let nano = +(spatialReasoning(25000) * multiplier).toFixed(0);
                    desc = desc + `<div>${loc('plus_max_resource',[nano,global.resource.Nano_Tube.name])}</div>`
                }
                if (global.resource.Neutronium.display){
                    let neutronium = +(spatialReasoning(125) * multiplier).toFixed(0);
                    desc = desc + `<div>${loc('plus_max_resource',[neutronium,global.resource.Neutronium.name])}</div>`
                }
                return desc;
            },
            action(){
                if (payCosts(spaceProjects.spc_red.garage.cost)){
                    incrementStruct('garage');
                    let multiplier = global.tech['particles'] >= 4  ? 1 + (global.tech['supercollider'] / 20) : 1;
                    multiplier *= global.tech['world_control'] ? 2 : 1;
                    multiplier *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole * 0.05) : 1;
                    global['resource']['Copper'].max += (spatialReasoning(6500) * multiplier);
                    global['resource']['Iron'].max += (spatialReasoning(5500) * multiplier);
                    global['resource']['Cement'].max += (spatialReasoning(6000) * multiplier);
                    global['resource']['Steel'].max += (spatialReasoning(4500) * multiplier);
                    global['resource']['Titanium'].max += (spatialReasoning(3500) * multiplier);
                    global['resource']['Alloy'].max += (spatialReasoning(2500) * multiplier);
                    if (global.resource.Neutronium.display){
                        global['resource']['Neutronium'].max += (spatialReasoning(125) * multiplier);
                    }
                    return true;
                }
                return false;
            }
        },
        red_mine: {
            id: 'space-red_mine',
            title: loc('space_red_mine_title'),
            desc(){
                return `<div>${loc('space_red_mine_desc')}</div><div class="has-text-special">${loc('space_support',[races[global.race.species].solar.red])}</div>`;
            },
            reqs: { mars: 1 },
            cost: {
                Money(){ return costMultiplier('red_mine', 50000, 1.32); },
                Lumber(){ return costMultiplier('red_mine', 65000, 1.32); },
                Iron(){ return costMultiplier('red_mine', 33000, 1.32); }
            },
            effect(){
                let copper = +(0.25 * zigguratBonus()).toFixed(3);
                let titanium = +(0.02 * zigguratBonus()).toFixed(3);
                return `<div>${loc('space_used_support',[races[global.race.species].solar.red])}</div><div>${loc('space_red_mine_effect',[copper,global.resource.Copper.name])}</div><div>${loc('space_red_mine_effect',[titanium,global.resource.Titanium.name])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_red.red_mine.cost)){
                    incrementStruct('red_mine');
                    if (global.space.spaceport.support < global.space.spaceport.s_max){
                        global.space['red_mine'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        fabrication: {
            id: 'space-fabrication',
            title: loc('space_red_fabrication_title'),
            desc(){
                return `<div>${loc('space_red_fabrication_desc')}</div><div class="has-text-special">${loc('space_support',[races[global.race.species].solar.red])}</div>`;
            },
            reqs: { mars: 1 },
            cost: {
                Money(){ return costMultiplier('fabrication', 90000, 1.32); },
                Copper(){ return costMultiplier('fabrication', 25000, 1.32); },
                Cement(){ return costMultiplier('fabrication', 12000, 1.32); },
                Wrought_Iron(){ return costMultiplier('fabrication', 1200, 1.32); }
            },
            effect(){
                return `<div>${loc('space_used_support',[races[global.race.species].solar.red])}</div><div>${loc('space_red_fabrication_effect1')}</div><div>${loc('space_red_fabrication_effect2')}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_red.fabrication.cost)){
                    incrementStruct('fabrication');
                    if (global.space.spaceport.support < global.space.spaceport.s_max){
                        global.space['fabrication'].on++;
                        global.civic.craftsman.max++;
                    }
                    return true;
                }
                return false;
            }
        },
        red_factory: {
            id: 'space-red_factory',
            title: loc('space_red_factory_title'),
            desc: `<div>${loc('space_red_factory_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`,
            reqs: { mars: 4 },
            cost: { 
                Money(){ return costMultiplier('red_factory', 75000, 1.32); },
                Brick(){ return costMultiplier('red_factory', 10000, 1.32); },
                Coal(){ return costMultiplier('red_factory', 7500, 1.32); },
                Mythril(){ return costMultiplier('red_factory', 50, 1.32); }
            },
            effect(){
                let desc = `<div>${loc('space_red_factory_effect1')}</div>`;
                if (global.tech['foundry'] >= 7){
                    desc = desc + `<div>${loc('space_red_factory_effect2')}</div>`;
                }
                let helium = +(fuel_adjust(1)).toFixed(2);
                desc = desc + `<div>${loc('space_red_factory_effect3',[helium])}</div>`;
                return desc;
            },
            powered: 3,
            special: true,
            action(){
                if (payCosts(spaceProjects.spc_red.red_factory.cost)){
                    global.space['red_factory'].count++;
                    if (global.city.power > 2){
                        global.space['red_factory'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        biodome: {
            id: 'space-biodome',
            title: loc('space_red_biodome_title'),
            desc(){
                let desc;
                if (global.race['carnivore']){
                    desc = `<div>${loc('space_red_biodome_desc_carn')}</div>`;
                }
                else {
                    desc = `<div>${loc('space_red_biodome_desc',[races[global.race.species].solar.red])}</div>`;
                }
                return `<div>${desc}</div><div class="has-text-special">${loc('space_support',[races[global.race.species].solar.red])}</div>`;
            },
            reqs: { mars: 2 },
            cost: {
                Money(){ return costMultiplier('biodome', 45000, 1.28); },
                Lumber(){ return costMultiplier('biodome', 65000, 1.28); },
                Brick(){ return costMultiplier('biodome', 1000, 1.28); }
            },
            effect(){
                let food = +(2 * zigguratBonus()).toFixed(2);
                return `<div>${loc('space_used_support',[races[global.race.species].solar.red])}</div><div>${loc('space_red_biodome_effect',[food])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_red.biodome.cost)){
                    incrementStruct('biodome');
                    unlockAchieve('colonist');
                    if (global.space.spaceport.support < global.space.spaceport.s_max){
                        global.space['biodome'].on++;
                    }
                    return true;
                }
                return false;
            },
            flair(){
                return global.race['carnivore'] ? loc('space_red_biodome_flair_carn') : loc('space_red_biodome_flair');
            }
        },
        exotic_lab: {
            id: 'space-exotic_lab',
            title: loc('space_red_exotic_lab_title'),
            desc(){
                return `<div>${loc('space_red_exotic_lab_desc')}</div><div class="has-text-special">${loc('space_support',[races[global.race.species].solar.red])}</div>`;
            },
            reqs: { mars: 5 },
            cost: {
                Money(){ return costMultiplier('exotic_lab', 750000, 1.28); },
                Steel(){ return costMultiplier('exotic_lab', 100000, 1.28); },
                Mythril(){ return costMultiplier('exotic_lab', 1000, 1.28); },
                Elerium(){ return costMultiplier('exotic_lab', 20, 1.28) - 4; }
            },
            effect(){
                let elerium = spatialReasoning(10);
                return `<div>${loc('space_used_support',[races[global.race.species].solar.red])}</div><div>${loc('space_red_exotic_lab_effect1',[500])}</div><div>${loc('plus_max_resource',[elerium,loc('resource_Elerium_name')])}</div>`;
            },
            support: -1,
            powered: 1,
            refresh: true,
            action(){
                if (payCosts(spaceProjects.spc_red.exotic_lab.cost)){
                    incrementStruct('exotic_lab');
                    if (global.space.spaceport.support < global.space.spaceport.s_max){
                        global.space['exotic_lab'].on++;
                    }
                    return true;
                }
                return false;
            },
            flair(){
                return `<div>${loc('space_red_exotic_lab_flair1')}</div><div>${loc('space_red_exotic_lab_flair2')}</div>`;
            }
        },
        ziggurat: {
            id: 'space-ziggurat',
            title: loc('space_red_ziggurat_title'),
            desc(){
                return `<div>${loc('space_red_ziggurat_desc',[races[global.race.old_gods.toLowerCase()].entity])}</div>`;
            },
            reqs: { theology: 4 },
            cost: {
                Money(){ return costMultiplier('ziggurat', 600000, 1.28); },
                Stone(){ return costMultiplier('ziggurat', 250000, 1.28); },
                Aluminium(){ return costMultiplier('ziggurat', 70000, 1.28); },
                Mythril(){ return costMultiplier('ziggurat', 250, 1.28); }
            },
            effect(){
                let bonus = global.tech['ancient_study'] ? 0.6 : 0.4;
                return `<div>${loc('space_red_ziggurat_effect',[bonus])}</div></div>`;
            },
            refresh: true,
            action(){
                if (payCosts(spaceProjects.spc_red.ziggurat.cost)){
                    incrementStruct('ziggurat');
                    return true;
                }
                return false;
            }
        },
        space_barracks: {
            id: 'space-space_barracks',
            title: loc('space_red_space_barracks_title'),
            desc(){
                return `<div>${loc('space_red_space_barracks_desc')}</div><div class="has-text-special">${loc('space_red_space_barracks_desc_req')}</div>`;
            },
            reqs: { marines: 1 },
            cost: {
                Money(){ return costMultiplier('space_barracks', 350000, 1.28); },
                Alloy(){ return costMultiplier('space_barracks', 65000, 1.28); },
                Iridium(){ return costMultiplier('space_barracks', 22500, 1.28); },
                Wrought_Iron(){ return costMultiplier('space_barracks', 12500, 1.28); }
            },
            effect(){
                let oil = +fuel_adjust(2).toFixed(2);
                return `<div>${loc('plus_max_soldiers',[2])}</div><div>${loc('space_red_space_barracks_effect2',[oil])}</div><div>${loc('space_red_space_barracks_effect3')}</div>`;
            },
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_red.space_barracks.cost)){
                    incrementStruct('space_barracks');
                    global.space['space_barracks'].on++;
                    return true;
                }
                return false;
            }
        },
    },
    spc_hell: {
        info: {
            name(){
                return races[global.race.species].solar.hell;
            },
            desc(){
                return loc('space_hell_info_desc',[races[global.race.species].solar.hell]);
            },
        },
        hell_mission: {
            id: 'space-hell_mission',
            title(){
                return loc('space_mission_title',[races[global.race.species].solar.hell]);
            },
            desc(){
                return loc('space_mission_desc',[races[global.race.species].solar.hell]);
            },
            reqs: { space: 3, space_explore: 3 },
            grant: ['hell',1],
            cost: { 
                Helium_3(){ return +fuel_adjust(6500).toFixed(0); }
            },
            effect(){
                return loc('space_hell_mission_effect1',[races[global.race.species].solar.hell]);
            },
            action(){
                if (payCosts(spaceProjects.spc_hell.hell_mission.cost)){
                    messageQueue(loc('space_hell_mission_action',[races[global.race.species].solar.hell]),'success');
                    global.space['geothermal'] = { count: 0, on: 0 };
                    return true;
                }
                return false;
            }
        },
        geothermal: {
            id: 'space-geothermal',
            title: loc('space_hell_geothermal_title'),
            desc(){
                return `<div>${loc('space_hell_geothermal_desc')}</div><div class="has-text-special">${loc('space_hell_geothermal_desc_req')}</div>`;
            },
            reqs: { hell: 1 },
            cost: {
                Money(){ return costMultiplier('geothermal', 38000, 1.35); },
                Steel(){ return costMultiplier('geothermal', 15000, 1.35); },
                Polymer(){ return costMultiplier('geothermal', 9500, 1.35); }
            },
            effect(){
                let helium = +(fuel_adjust(0.5)).toFixed(2);
                return loc('space_hell_geothermal_effect1',[helium]);
            },
            powered: -8,
            action(){
                if (payCosts(spaceProjects.spc_hell.geothermal.cost)){
                    incrementStruct('geothermal');
                    global.space['geothermal'].on++;
                    return true;
                }
                return false;
            }
        },
        swarm_plant: {
            id: 'space-swarm_plant',
            title: loc('space_hell_swarm_plant_title'),
            desc(){
                return `<div>${loc('space_hell_swarm_plant_desc')}</div>`;
            },
            reqs: { solar: 4, hell: 1 },
            cost: {
                Money(){ return costMultiplier('swarm_plant', iron_adjust(75000), 1.28); },
                Iron(){ return costMultiplier('swarm_plant', iron_adjust(65000), 1.28); },
                Neutronium(){ return costMultiplier('swarm_plant', 75, 1.28); },
                Brick(){ return costMultiplier('swarm_plant', 2500, 1.28); },
                Mythril(){ return costMultiplier('swarm_plant', 100, 1.28); }
            },
            effect(){
                let reduce = global.tech['swarm'] ? 0.92 : 0.95;
                if (global.tech['swarm'] >= 3){
                    reduce -= quantium_level / 100;
                }
                reduce = +((1 - reduce) * 100).toFixed(2);
                return loc('space_hell_swarm_plant_effect1',[reduce]);
            },
            action(){
                if (payCosts(spaceProjects.spc_hell.swarm_plant.cost)){
                    incrementStruct('swarm_plant');
                    return true;
                }
                return false;
            }
        },
    },
    spc_sun: {
        info: {
            name(){
                return loc('space_sun_info_name');
            },
            desc(){
                return loc('space_sun_info_desc',[races[global.race.species].home]);
            },
            support: 'swarm_control',
        },
        sun_mission: {
            id: 'space-sun_mission',
            title(){
                return loc('space_sun_mission_title');
            },
            desc(){
                return loc('space_sun_mission_desc');
            },
            reqs: { space_explore: 4 },
            grant: ['solar',1],
            cost: { 
                Helium_3(){ return +fuel_adjust(15000).toFixed(0); }
            },
            effect(){
                return loc('space_sun_mission_effect1');
            },
            action(){
                if (payCosts(spaceProjects.spc_sun.sun_mission.cost)){
                    return true;
                }
                return false;
            }
        },
        swarm_control: {
            id: 'space-swarm_control',
            title: loc('space_sun_swarm_control_title'),
            desc(){
                return `<div>${loc('space_sun_swarm_control_desc')}</div>`;
            },
            reqs: { solar: 3 },
            cost: {
                Money(){ return costMultiplier('swarm_control', 100000, 1.3); },
                Knowledge(){ return costMultiplier('swarm_control', 60000, 1.3); },
                Alloy(){ return costMultiplier('swarm_control', 7500, 1.3); },
                Helium_3(){ return costMultiplier('swarm_control', fuel_adjust(2000), 1.3); },
                Mythril(){ return costMultiplier('swarm_control', 250, 1.3); }
            },
            effect(){
                let control = global.tech['swarm'] && global.tech['swarm'] >= 2 ? 6 : 4;
                return loc('space_sun_swarm_control_effect1',[control]);
            },
            support: 6,
            action(){
                if (payCosts(spaceProjects.spc_sun.swarm_control.cost)){
                    incrementStruct('swarm_control');
                    global.space['swarm_control'].s_max += global.tech['swarm'] && global.tech['swarm'] >= 2 ? 6 : 4;
                    return true;
                }
                return false;
            }
        },
        swarm_satellite: {
            id: 'space-swarm_satellite',
            title: loc('space_sun_swarm_satellite_title'),
            desc(){
                return `<div>${loc('space_sun_swarm_satellite_desc')}<div><div class="has-text-special">${loc('space_sun_swarm_satellite_desc_req')}</div>`;
            },
            reqs: { solar: 3 },
            cost: {
                Money(){ return costMultiplier('swarm_satellite', swarm_adjust(50000), 1.18); },
                Copper(){ return costMultiplier('swarm_satellite', swarm_adjust(25000), 1.18); },
                Iridium(){ return costMultiplier('swarm_satellite', swarm_adjust(1500), 1.18); },
                Helium_3(){ return costMultiplier('swarm_satellite', swarm_adjust(fuel_adjust(500)), 1.18); }
            },
            effect(){
                return loc('space_sun_swarm_satellite_effect1');
            },
            support: -1,
            action(){
                if (payCosts(spaceProjects.spc_sun.swarm_satellite.cost)){
                    incrementStruct('swarm_satellite');
                    global.space['swarm_control'].support++;
                    return true;
                }
                return false;
            }
        },
    },
    spc_gas: {
        info: {
            name(){
                return races[global.race.species].solar.gas;
            },
            desc(){
                return loc('space_gas_info_desc',[races[global.race.species].solar.gas, races[global.race.species].home]);
            },
        },
        gas_mission: {
            id: 'space-gas_mission',
            title(){
                return loc('space_mission_title',[races[global.race.species].solar.gas]);
            },
            desc(){
                return loc('space_mission_desc',[races[global.race.species].solar.gas]);
            },
            reqs: { space: 4, space_explore: 4 },
            grant: ['space',5],
            cost: { 
                Helium_3(){ return +fuel_adjust(12500).toFixed(0); }
            },
            effect(){
                return `<div>${loc('space_gas_mission_effect1')}</div><div>${loc('space_gas_mission_effect2',[races[global.race.species].solar.gas])}</div>`;
            },
            action(){
                if (payCosts(spaceProjects.spc_gas.gas_mission.cost)){
                    messageQueue(loc('space_gas_mission_action',[races[global.race.species].solar.gas]),'success');
                    global.settings.space.gas_moon = true;
                    global.settings.space.belt = true;
                    global.space['space_station'] = { count: 0, on: 0, support: 0, s_max: 0 };
                    return true;
                }
                return false;
            }
        },
        gas_mining: {
            id: 'space-gas_mining',
            title: loc('space_gas_mining_title'),
            desc(){
                return `<div>${loc('space_gas_mining_desc')}<div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { gas_giant: 1 },
            cost: {
                Money(){ return costMultiplier('gas_mining', 250000, 1.32); },
                Uranium(){ return costMultiplier('gas_mining', 500, 1.32); },
                Alloy(){ return costMultiplier('gas_mining', 10000, 1.32); },
                Helium_3(){ return costMultiplier('gas_mining', fuel_adjust(2500), 1.32); },
                Mythril(){ return costMultiplier('gas_mining', 25, 1.32); }
            },
            effect(){
                let helium = +((global.tech['helium'] ? 0.65 : 0.5) * zigguratBonus()).toFixed(2);
                return `<div>${loc('space_gas_mining_effect1',[helium])}</div><div>${loc('space_gas_mining_effect2',[spaceProjects.spc_gas.gas_mining.powered])}</div>`;
            },
            powered: 2,
            action(){
                if (payCosts(spaceProjects.spc_gas.gas_mining.cost)){
                    incrementStruct('gas_mining');
                    if (global.city.powered && global.city.power >= 2){
                        global.space.gas_mining.on++;
                    }
                    return true;
                }
                return false;
            }
        },
        gas_storage: {
            id: 'space-gas_storage',
            title(){ return loc('space_gas_storage_title',[races[global.race.species].solar.gas]); },
            desc(){
                return `<div>${loc('space_gas_storage_desc')}<div>`;
            },
            reqs: { gas_giant: 1 },
            cost: {
                Money(){ return costMultiplier('gas_storage', 125000, 1.32); },
                Iridium(){ return costMultiplier('gas_storage', 3000, 1.32); },
                Sheet_Metal(){ return costMultiplier('gas_storage', 2000, 1.32); },
                Helium_3(){ return costMultiplier('gas_storage', fuel_adjust(1000), 1.32); },
            },
            effect(){
                let oil = spatialReasoning(3500) * (global.tech['world_control'] ? 1.5 : 1);
                let helium = spatialReasoning(2500) * (global.tech['world_control'] ? 1.5 : 1);
                let uranium = spatialReasoning(1000) * (global.tech['world_control'] ? 1.5 : 1);
                return `<div>${loc('plus_max_resource',[oil,loc('resource_Oil_name')])}</div><div>${loc('plus_max_resource',[helium,loc('resource_Helium_3_name')])}</div><div>${loc('plus_max_resource',[uranium,loc('resource_Uranium_name')])}</div>`;
            },
            action(){
                if (payCosts(spaceProjects.spc_gas.gas_storage.cost)){
                    incrementStruct('gas_storage');
                    return true;
                }
                return false;
            }
        },
        star_dock: {
            id: 'space-star_dock',
            title(){ return loc('space_gas_star_dock_title'); },
            desc(){
                return `<div>${loc('space_gas_star_dock_desc')}<div><div class="has-text-special">${loc('space_gas_star_dock_desc_req')}</div>`;
            },
            reqs: { genesis: 3 },
            cost: {
                Money(){ return global.space.star_dock.count === 0 ? 1500000 : 0; },
                Steel(){ return global.space.star_dock.count === 0 ? 500000 : 0; },
                Helium_3(){ return global.space.star_dock.count === 0 ? Math.round(fuel_adjust(10000)) : 0; },
                Nano_Tube(){ return global.space.star_dock.count === 0 ? 250000 : 0; },
                Mythril(){ return global.space.star_dock.count === 0 ? 10000 : 0; },
            },
            effect(){
                return `<div>${loc('space_gas_star_dock_effect1')}</div>`;
            },
            special: true,
            action(){
                if (global.space.star_dock.count === 0 && payCosts(spaceProjects.spc_gas.star_dock.cost)){
                    incrementStruct('star_dock');
                    return true;
                }
                return false;
            }
        },
    },
    spc_gas_moon: {
        info: {
            name(){
                return races[global.race.species].solar.gas_moon;
            },
            desc(){
                return loc('space_gas_moon_info_desc',[races[global.race.species].solar.gas_moon,races[global.race.species].solar.gas]);
            },
        },
        gas_moon_mission: {
            id: 'space-gas_moon_mission',
            title(){
                return loc('space_mission_title',[races[global.race.species].solar.gas_moon]);
            },
            desc(){
                return loc('space_mission_desc',[races[global.race.species].solar.gas_moon]);
            },
            reqs: { space: 5 },
            grant: ['space',6],
            cost: { 
                Helium_3(){ return +fuel_adjust(30000).toFixed(0); }
            },
            effect(){
                return loc('space_gas_moon_mission_effect',[races[global.race.species].solar.gas_moon]);
            },
            action(){
                if (payCosts(spaceProjects.spc_gas_moon.gas_moon_mission.cost)){
                    messageQueue(loc('space_gas_moon_mission_action',[races[global.race.species].solar.gas_moon]),'success');
                    global.space['outpost'] = { count: 0, on: 0 };
                    global.tech['gas_moon'] = 1;
                    return true;
                }
                return false;
            }
        },
        outpost: {
            id: 'space-outpost',
            title: loc('space_gas_moon_outpost_title'),
            desc(){
                return `<div>${loc('space_gas_moon_outpost_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { gas_moon: 1 },
            cost: {
                Money(){ return costMultiplier('outpost', 666000, 1.3); },
                Titanium(){ return costMultiplier('outpost', 18000, 1.3); },
                Iridium(){ return costMultiplier('outpost', 2500, 1.3); },
                Helium_3(){ return costMultiplier('outpost', fuel_adjust(6000), 1.3); },
                Mythril(){ return costMultiplier('outpost', 300, 1.3); }
            },
            effect(){
                let neutronium = 0.025;
                if (global.tech['drone']){
                    neutronium *= 1 + (global.space.drone.count * 0.06);
                }
                neutronium = +(neutronium * zigguratBonus()).toFixed(3);
                let max = spatialReasoning(500);
                let oil = +(fuel_adjust(2)).toFixed(2);
                return `<div>${loc('space_gas_moon_outpost_effect1',[neutronium])}</div><div>${loc('plus_max_resource',[max,loc('resource_Neutronium_name')])}</div><div>${loc('space_gas_moon_outpost_effect3',[oil,spaceProjects.spc_gas_moon.outpost.powered])}</div>`;
            },
            powered: 3,
            action(){
                if (payCosts(spaceProjects.spc_gas_moon.outpost.cost)){
                    incrementStruct('outpost');
                    global.resource['Neutronium'].display = true;
                    if (global.city.power >= 3){
                        global.space['outpost'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        drone: {
            id: 'space-drone',
            title: loc('space_gas_moon_drone_title'),
            desc(){
                return `<div>${loc('space_gas_moon_drone_desc')}</div>`;
            },
            reqs: { gas_moon: 1, drone: 1 },
            cost: {
                Money(){ return costMultiplier('drone', 250000, 1.3); },
                Steel(){ return costMultiplier('drone', 20000, 1.3); },
                Neutronium(){ return costMultiplier('drone', 500, 1.3); },
                Elerium(){ return costMultiplier('drone', 25, 1.3); },
                Nano_Tube(){ return costMultiplier('drone', 45000, 1.3); }
            },
            effect(){
                return `<div>${loc('space_gas_moon_drone_effect1')}</div>`;
            },
            action(){
                if (payCosts(spaceProjects.spc_gas_moon.drone.cost)){
                    incrementStruct('drone');
                    return true;
                }
                return false;
            }
        },
        oil_extractor: {
            id: 'space-oil_extractor',
            title: loc('space_gas_moon_oil_extractor_title'),
            desc(){
                return `<div>${loc('space_gas_moon_oil_extractor_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { gas_moon: 2 },
            cost: {
                Money(){ return costMultiplier('oil_extractor', 666000, 1.3); },
                Polymer(){ return costMultiplier('oil_extractor', 7500, 1.3); },
                Helium_3(){ return costMultiplier('oil_extractor', fuel_adjust(2500), 1.3); },
                Wrought_Iron(){ return costMultiplier('oil_extractor', 5000, 1.3); },
            },
            effect(){
                let oil = global.tech['oil'] >= 4 ? 0.48 : 0.4;
                if (global.tech['oil'] >= 7){
                    oil *= 2;
                }
                else if (global.tech['oil'] >= 5){
                    oil *= global.tech['oil'] >= 6 ? 1.75 : 1.25;
                }
                oil = +oil.toFixed(2);
                return loc('space_gas_moon_oil_extractor_effect1',[oil, spaceProjects.spc_gas_moon.oil_extractor.powered]);
            },
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_gas_moon.oil_extractor.cost)){
                    incrementStruct('oil_extractor');
                    if (global.city.power >= 1){
                        global.space['oil_extractor'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
    },
    spc_belt: {
        info: {
            name(){
                return loc('space_belt_info_name');
            },
            desc(){
                return loc('space_belt_info_desc',[races[global.race.species].solar.red,races[global.race.species].solar.gas]);
            },
            support: 'space_station'
        },
        belt_mission: {
            id: 'space-belt_mission',
            title(){
                return loc('space_belt_mission_title');
            },
            desc(){
                return loc('space_belt_mission_desc');
            },
            reqs: { space: 5 },
            grant: ['asteroid',1],
            cost: { 
                Helium_3(){ return +fuel_adjust(25000).toFixed(0); }
            },
            effect(){
                return loc('space_belt_mission_effect1');
            },
            action(){
                if (payCosts(spaceProjects.spc_belt.belt_mission.cost)){
                    messageQueue(loc('space_belt_mission_action'),'success');
                    global.settings.space.dwarf = true;
                    return true;
                }
                return false;
            }
        },
        space_station: {
            id: 'space-space_station',
            title: loc('space_belt_station_title'),
            desc(){
                return `<div>${loc('space_belt_station_desc')}<div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { asteroid: 2 },
            cost: {
                Money(){ return costMultiplier('space_station', 250000, 1.3); },
                Iron(){ return costMultiplier('space_station', 85000, 1.3); },
                Polymer(){ return costMultiplier('space_station', 18000, 1.3); },
                Iridium(){ return costMultiplier('space_station', 2800, 1.28); },
                Helium_3(){ return costMultiplier('space_station', fuel_adjust(2000), 1.3); },
                Mythril(){ return costMultiplier('space_station', 75, 1.25); }
            },
            effect(){
                let helium = +(fuel_adjust(2.5)).toFixed(2);
                let food = 10;
                let elerium_cap = spatialReasoning(5);
                let elerium = global.tech['asteroid'] >= 5 ? `<div>${loc('plus_max_resource',[elerium_cap, loc('resource_Elerium_name')])}</div>` : '';
                return `<div>${loc('plus_max_space_miners',[3])}</div>${elerium}<div>${loc('space_belt_station_effect3',[helium])}</div><div>${loc('space_belt_station_effect4',[food,spaceProjects.spc_belt.space_station.powered])}</div>`;
            },
            support: 3,
            powered: 3,
            refresh: true,
            action(){
                if (payCosts(spaceProjects.spc_belt.space_station.cost)){
                    incrementStruct('space_station');
                    global.civic.space_miner.display = true;
                    if (global.tech['asteroid'] < 3){
                        global.tech['asteroid'] = 3;
                    }
                    if (global.city.power >= 3){
                        global.space.space_station.on++;
                    }
                    return true;
                }
                return false;
            }
        },
        elerium_ship: {
            id: 'space-elerium_ship',
            title: loc('space_belt_elerium_ship_title'),
            desc(){
                return loc('space_belt_elerium_ship_desc');
            },
            reqs: { asteroid: 5 },
            cost: {
                Money(){ return costMultiplier('elerium_ship', 500000, 1.3); },
                Uranium(){ return costMultiplier('elerium_ship', 2500, 1.3); },
                Titanium(){ return costMultiplier('elerium_ship', 10000, 1.3); },
                Mythril(){ return costMultiplier('elerium_ship', 500, 1.3); },
                Helium_3(){ return costMultiplier('elerium_ship', fuel_adjust(5000), 1.3); }
            },
            effect(){
                let elerium = +((global.tech.asteroid >= 6 ? 0.0075 : 0.005) * zigguratBonus()).toFixed(4);
                return `<div>${loc('space_belt_elerium_ship_effect1')}</div><div>${loc('space_belt_elerium_ship_effect2',[elerium])}</div>`;
            },
            support: -2,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_belt.elerium_ship.cost)){
                    incrementStruct('elerium_ship');
                    if (global.space.space_station.support + 1 < global.space.space_station.s_max){
                        global.space['elerium_ship'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        iridium_ship: {
            id: 'space-iridium_ship',
            title: loc('space_belt_iridium_ship_title'),
            desc(){
                return loc('space_belt_iridium_ship_desc');
            },
            reqs: { asteroid: 3 },
            cost: {
                Money(){ return costMultiplier('iridium_ship', 120000, 1.3); },
                Uranium(){ return costMultiplier('iridium_ship', 1000, 1.3); },
                Alloy(){ return costMultiplier('iridium_ship', 48000, 1.3); },
                Iridium(){ return costMultiplier('iridium_ship', 2800, 1.3); },
                Helium_3(){ return costMultiplier('iridium_ship', fuel_adjust(1800), 1.3); }
            },
            effect(){
                let iridium = +((global.tech.asteroid >= 6 ? 0.08 : 0.055) * zigguratBonus()).toFixed(3);
                return `<div>${loc('space_belt_iridium_ship_effect1')}</div><div>${loc('space_belt_iridium_ship_effect2',[iridium])}</div>`;
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_belt.iridium_ship.cost)){
                    incrementStruct('iridium_ship');
                    if (global.space.space_station.support < global.space.space_station.s_max){
                        global.space['iridium_ship'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        iron_ship: {
            id: 'space-iron_ship',
            title: loc('space_belt_iron_ship_title'),
            desc(){
                return loc('space_belt_iron_ship_desc');
            },
            reqs: { asteroid: 3 },
            cost: {
                Money(){ return costMultiplier('iron_ship', 80000, 1.3); },
                Steel(){ return costMultiplier('iron_ship', 42000, 1.3); },
                Aluminium(){ return costMultiplier('iron_ship', 38000, 1.3); },
                Polymer(){ return costMultiplier('iron_ship', 16000, 1.3); },
                Helium_3(){ return costMultiplier('iron_ship', fuel_adjust(1200), 1.3); }
            },
            effect(){
                let iron = +((global.tech.asteroid >= 6 ? 3 : 2) * zigguratBonus()).toFixed(2);
                if (global.tech['solar'] && global.tech['solar'] >= 5){
                    return `<div>${loc('space_belt_iron_ship_effect1')}</div><div>${loc('space_belt_iron_ship_effect2',[iron])}</div><div>${loc('space_belt_iron_ship_effect3')}</div>`;
                }
                else {
                    return `<div>${loc('space_belt_iron_ship_effect1')}</div><div>${loc('space_belt_iron_ship_effect2',[iron])}</div>`;
                }
            },
            support: -1,
            powered: 1,
            action(){
                if (payCosts(spaceProjects.spc_belt.iron_ship.cost)){
                    incrementStruct('iron_ship');
                    if (global.space.space_station.support < global.space.space_station.s_max){
                        global.space['iron_ship'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
    },
    spc_dwarf: {
        info: {
            name(){
                return races[global.race.species].solar.dwarf;
            },
            desc(){
                return loc('space_dwarf_info_desc',[races[global.race.species].solar.dwarf]);
            },
        },
        dwarf_mission: {
            id: 'space-dwarf_mission',
            title(){
                return loc('space_mission_title',[races[global.race.species].solar.dwarf]);
            },
            desc(){
                return loc('space_mission_desc',[races[global.race.species].solar.dwarf]);
            },
            reqs: { asteroid: 1, elerium: 1 },
            grant: ['dwarf',1],
            cost: { 
                Helium_3(){ return +fuel_adjust(45000).toFixed(0); }
            },
            effect(){
                return loc('space_dwarf_mission_effect1',[races[global.race.species].solar.dwarf]);
            },
            action(){
                if (payCosts(spaceProjects.spc_dwarf.dwarf_mission.cost)){
                    messageQueue(loc('space_dwarf_mission_action',[races[global.race.species].solar.dwarf]),'success');
                    global.space['elerium_contain'] = { count: 0, on: 0 };
                    return true;
                }
                return false;
            }
        },
        elerium_contain: {
            id: 'space-elerium_contain',
            title: loc('space_dwarf_elerium_contain_title'),
            desc(){
                return `<div>${loc('space_dwarf_elerium_contain_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { dwarf: 1 },
            cost: {
                Money(){ return costMultiplier('elerium_contain', 800000, 1.28); },
                Cement(){ return costMultiplier('elerium_contain', 120000, 1.28); },
                Iridium(){ return costMultiplier('elerium_contain', 50000, 1.28); },
                Neutronium(){ return costMultiplier('elerium_contain', 250, 1.28); }
            },
            effect(){
                let elerium = spatialReasoning(100);
                return `<div>${loc('plus_max_resource',[elerium,loc('resource_Elerium_name')])}</div><div>${loc('space_dwarf_elerium_contain_effect2',[spaceProjects.spc_dwarf.elerium_contain.powered])}</div>`;
            },
            powered: 6,
            action(){
                if (payCosts(spaceProjects.spc_dwarf.elerium_contain.cost)){
                    incrementStruct('elerium_contain');
                    if (global.city.power >= 6){
                        global.space['elerium_contain'].on++;
                    }
                    return true;
                }
                return false;
            }
        },
        e_reactor: {
            id: 'space-e_reactor',
            title: loc('space_dwarf_reactor_title'),
            desc(){
                return `<div>${loc('space_dwarf_reactor_desc')}</div><div class="has-text-special">${loc('space_dwarf_reactor_desc_req')}</div>`;
            },
            reqs: { elerium: 2 },
            cost: {
                Money(){ return costMultiplier('e_reactor', 1250000, 1.28); },
                Steel(){ return costMultiplier('e_reactor', 350000, 1.28); },
                Neutronium(){ return costMultiplier('e_reactor', 1250, 1.28); },
                Mythril(){ return costMultiplier('e_reactor', 2500, 1.28); }
            },
            effect(){
                let elerium = 0.05;
                let power = spaceProjects.spc_dwarf.e_reactor.powered * -1;
                return `<div>${loc('space_dwarf_reactor_effect1',[power])}</div><div>${loc('space_dwarf_reactor_effect2',[elerium])}</div>`;
            },
            powered: -25,
            action(){
                if (payCosts(spaceProjects.spc_dwarf.e_reactor.cost)){
                    incrementStruct('e_reactor');
                    global.space['e_reactor'].on++;
                    return true;
                }
                return false;
            }
        },
        world_collider: {
            id: 'space-world_collider',
            title: loc('space_dwarf_collider_title'),
            desc(){
                if (global.space.world_collider.count < 1859){
                    return `<div>${loc('space_dwarf_collider_desc')}</div><div class="has-text-special">${loc('space_dwarf_collider_desc_req')}</div>`;
                }
                else {
                    return `<div>${loc('space_dwarf_collider_desc_req')}</div>`;
                }
            },
            reqs: { science: 10 },
            cost: {
                Money(){ return global.space.world_collider.count < 1859 ? 25000 : 0; },
                Copper(){ return global.space.world_collider.count < 1859 ? 750 : 0; },
                Alloy(){ return global.space.world_collider.count < 1859 ? 125 : 0; },
                Neutronium(){ return global.space.world_collider.count < 1859 ? 12 : 0; },
                Elerium(){ return global.space.world_collider.count < 1859 ? 1 : 0; },
                Mythril(){ return global.space.world_collider.count < 1859 ? 10 : 0; }
            },
            effect(){
                if (global.space.world_collider.count < 1859){
                    let remain = 1859 - global.space.world_collider.count;
                    return `<div>${loc('space_dwarf_collider_effect1')}</div><div class="has-text-special">${loc('space_dwarf_collider_effect2',[remain])}</div>`;
                }
                else {
                    return loc('space_dwarf_collider_effect3');
                }
            },
            refresh: true,
            action(){
                if (global.space.world_collider.count < 1859 && payCosts(spaceProjects.spc_dwarf.world_collider.cost)){
                    incrementStruct('world_collider');
                    if (global.space.world_collider.count >= 1859){
                        global.tech['science'] = 11;
                        global.space['world_controller'] = { count: 1, on: 0 };
                    }
                    return true;
                }
                return false;
            },
            flair: loc('space_dwarf_collider_flair')
        },
        world_controller: {
            id: 'space-world_controller',
            title: loc('space_dwarf_controller_title'),
            desc(){
                return `<div>${loc('space_dwarf_controller_desc')}</div><div class="has-text-special">${loc('requires_power')}</div>`;
            },
            reqs: { science: 11 },
            cost: {},
            effect(){
                return `<div>${loc('space_dwarf_controller_effect1')}</div><div>${loc('plus_max_resource',['25%',loc('resource_Knowledge_name')])}</div><div>${loc('space_dwarf_controller_effect3')}</div><div>${loc('space_dwarf_controller_effect4',[spaceProjects.spc_dwarf.world_controller.powered])}</div>`;
            },
            powered: 20,
            action(){
                return false;
            },
            flair: loc('space_dwarf_controller_flair')
        },
    }
};

const structDefinitions = {
    satellite: { count: 0 },
    propellant_depot: { count: 0 },
    gps: { count: 0 },
    nav_beacon: { count: 0, on: 0 },
    moon_base: { count: 0, on: 0, support: 0, s_max: 0 },
    iridium_mine: { count: 0, on: 0 },
    helium_mine: { count: 0, on: 0 },
    observatory: { count: 0, on: 0 },
    spaceport: { count: 0, on: 0, support: 0, s_max: 0 },
    red_tower: { count: 0, on: 0 },
    living_quarters: { count: 0, on: 0 },
    garage: { count: 0 },
    red_mine: { count: 0, on: 0 },
    fabrication: { count: 0, on: 0 },
    red_factory: { count: 0, on: 0 },
    exotic_lab: { count: 0, on: 0 },
    ziggurat: { count: 0 },
    space_barracks: { count: 0, on: 0 },
    biodome: { count: 0, on: 0 },
    laboratory: { count: 0, on: 0 },
    geothermal: { count: 0, on: 0 },
    swarm_plant: { count: 0 },
    swarm_control: { count: 0, support: 0, s_max: 0 },
    swarm_satellite: { count: 0 },
    gas_mining: { count: 0, on: 0 },
    gas_storage: { count: 0 },
    star_dock: { count: 0, ship: 0, probe: 0, template: 'human' },
    outpost: { count: 0, on: 0 },
    drone: { count: 0 },
    oil_extractor: { count: 0, on: 0 },
    space_station: { count: 0, on: 0, support: 0, s_max: 0 },
    iridium_ship: { count: 0, on: 0 },
    elerium_ship: { count: 0, on: 0 },
    iron_ship: { count: 0, on: 0 },
    elerium_contain: { count: 0, on: 0 },
    e_reactor: { count: 0, on: 0 },
    world_collider: { count: 0 },
    world_controller: { count: 0, on: 0 },
};

function incrementStruct(struct){
    if (!global.space[struct]){
        global.space[struct] = structDefinitions[struct];
    }
    global.space[struct].count++;
}

export function spaceTech(){
    return spaceProjects;
}

function checkRequirements(region,action){
    var isMet = true;
    Object.keys(spaceProjects[region][action].reqs).forEach(function (req){
        if (!global.tech[req] || global.tech[req] < spaceProjects[region][action].reqs[req]){
            isMet = false;
        }
    });
    if (isMet && spaceProjects[region][action].grant && (global.tech[spaceProjects[region][action].grant[0]] && global.tech[spaceProjects[region][action].grant[0]] >= spaceProjects[region][action].grant[1])){
        isMet = false;
    }
    return isMet;
}

export function space(){
    let parent = $('#space');
    parent.empty();
    parent.append($(`<h2 class="is-sr-only">${loc('space')}</h2>`));
    if (!global.settings.showSpace){
        return false;
    }

    Object.keys(spaceProjects).forEach(function (region){
        let show = region.replace("spc_","");
        if (global.settings.space[`${show}`]){
            let name = typeof spaceProjects[region].info.name === 'string' ? spaceProjects[region].info.name : spaceProjects[region].info.name();
            let desc = typeof spaceProjects[region].info.desc === 'string' ? spaceProjects[region].info.desc : spaceProjects[region].info.desc();
            
            if (spaceProjects[region].info['support']){
                let support = spaceProjects[region].info['support'];
                parent.append(`<div id="${region}" class="space"><div id="sr${region}"><h3 class="name has-text-warning">${name}</h3> <span v-show="s_max">{{ support }}/{{ s_max }}</span></div></div>`);
                vues[`sr${region}`] = new Vue({
                    data: global.space[support]
                });
                vues[`sr${region}`].$mount(`#sr${region}`);
            }
            else {
                parent.append(`<div id="${region}" class="space"><div><h3 class="name has-text-warning">${name}</h3></div></div>`);
            }
            
            $(`#${region} h3.name`).on('mouseover',function(){
                var popper = $(`<div id="pop${region}" class="popper has-background-light has-text-dark"></div>`);
                $('#main').append(popper);
                
                popper.append($(`<div>${desc}</div>`));
                popper.show();
                poppers[region] = new Popper($(`#${region} h3.name`),popper);
            });
            $(`#${region} h3.name`).on('mouseout',function(){
                $(`#pop${region}`).hide();
                poppers[region].destroy();
                $(`#pop${region}`).remove();
            });

            Object.keys(spaceProjects[region]).forEach(function (tech){
                if (tech !== 'info' && checkRequirements(region,tech)){
                    let c_action = spaceProjects[region][tech];
                    setAction(c_action,'space',tech);
                }
            });
        }
    });
}

function costMultiplier(action,base,mutiplier){
    if (global.genes['creep'] && !global.race['no_crispr']){
        mutiplier -= global.genes['creep'] * 0.01;
    }
    if (global.race['small']){ mutiplier -= 0.005; }
    if (global.race['compact']){ mutiplier -= 0.01; }
    if (mutiplier < 0.01){
        mutiplier = 0.01;
    }
    var count = global.space[action] ? global.space[action].count : 0;
    return Math.round((mutiplier ** count) * base);
}

function house_adjust(res){
    if (global.tech['space_housing']){
        res *= 0.8 ** global.tech['space_housing'];
    }
    return res;
}

export function iron_adjust(res){
    if (global.tech['solar'] && global.tech['solar'] >= 5 && belt_on['iron_ship']){
        res *= 0.95 ** belt_on['iron_ship'];
    }
    return res;
}

export function swarm_adjust(res){
    if (global.space['swarm_plant']){
        let reduce = global.tech['swarm'] ? 0.92 : 0.95;
        if (global.tech['swarm'] >= 3){
            reduce -= quantium_level / 100;
        }
        res *= reduce ** global.space.swarm_plant.count;
    }
    return res;
}

export function fuel_adjust(fuel){
    if (global.city['mass_driver'] && p_on['mass_driver']){
        fuel *= 0.95 ** p_on['mass_driver'];
    }
    return fuel;
}

export function zigguratBonus(){
    let bonus = 1;
    if (global.space['ziggurat'] && global.space['ziggurat'].count > 0){
        let study = global.tech['ancient_study'] ? 0.006 : 0.004;
        bonus += (global.space.ziggurat.count * global.civic.colonist.workers * study);
    }
    return bonus;
}
