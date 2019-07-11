import { global, vues, keyMultiplier, poppers } from './vars.js';
import { loc } from './locale.js';
import { racialTrait, races } from './races.js';
import { craftingRatio, craftCost } from './resources.js';

export const job_desc = {
    farmer: function(){
        let multiplier = (global.tech['hoe'] && global.tech['hoe'] > 0 ? global.tech['hoe'] * (1/3) : 0) + 1;
        if (global.tech.agriculture >= 7){
            multiplier *= 1.1;
        }
        multiplier *= racialTrait(global.civic.farmer.workers,'farmer');
        let impact = global.city.biome === 'grassland' ? (global.civic.farmer.impact * 1.1) : global.civic.farmer.impact;
        let gain = +(impact * multiplier).toFixed(1);
        return loc('job_farmer',[gain]);
    },
    lumberjack: function(){
        let multiplier = (global.tech['axe'] && global.tech['axe'] > 0 ? (global.tech['axe'] - 1) * 0.35 : 0) + 1;
        multiplier *= racialTrait(global.civic.lumberjack.workers,'lumberjack');
        let impact = global.city.biome === 'forest' ? (global.civic.lumberjack.impact * 1.1) : global.civic.lumberjack.impact;
        let gain = +(impact * multiplier).toFixed(1);
        return loc('job_lumberjack',[gain]);
    },
    quarry_worker: function(){
        let multiplier = (global.tech['hammer'] && global.tech['hammer'] > 0 ? global.tech['hammer'] * 0.4 : 0) + 1;
        multiplier *= racialTrait(global.civic.quarry_worker.workers,'miner');
        if (global.tech['explosives'] && global.tech['explosives'] >= 2){
            multiplier *= global.tech['explosives'] >= 3 ? 1.75 : 1.5;
        }
        let gain = +(global.civic.quarry_worker.impact * multiplier).toFixed(1);
        return loc('job_quarry_worker',[gain]);
    },
    miner: function(){
        if (global.tech['mining'] >= 3){
            return loc('job_miner2');
        }
        else {
            return loc('job_miner1');
        }
    },
    coal_miner: function(){
        if (global.tech['uranium']){
            return loc('job_coal_miner2');
        }
        else {
            return loc('job_coal_miner1');
        }
    },
    craftsman: function(){
        return loc('job_craftsman');
    },
    cement_worker: function(){
        let impact = global.tech['cement'] >= 4 ? 1.2 : 1;
        let cement_multiplier = racialTrait(global.civic.quarry_worker.workers,'factory');
        let gain = global.civic.cement_worker.impact * impact * cement_multiplier;
        gain = +(gain).toFixed(2);
        return loc('job_cement_worker',[gain]);
    },
    banker: function(){
        let interest = global.civic.banker.impact * 100;
        if (global.tech['banking'] >= 10){
            interest += 2 * global.tech['stock_exchange'];
        }
        return loc('job_banker',[interest]);
    },
    entertainer: function(){
        let morale = global.tech['theatre'];
        return loc('job_entertainer',[morale]);
    },
    professor: function(){
        let impact = +(global.race['studious'] ? global.civic.professor.impact + 0.25 : global.civic.professor.impact).toFixed(2);
        if (global.tech['science'] && global.tech['science'] >= 3){
            impact += global.city.library.count * 0.01;
        }
        impact *= racialTrait(global.civic.professor.workers,'science');
        if (global.tech['anthropology'] && global.tech['anthropology'] >= 3){
            impact *= 1 + (global.city.temple.count * 0.05);
        }
        impact = +impact.toFixed(2);
        return loc('job_professor',[impact]);
    },
    scientist: function(){
        let impact = global.civic.scientist.impact;
        impact *= racialTrait(global.civic.scientist.workers,'science');
        if (global.tech['science'] >= 6 && global.city['wardenclyffe']){
            impact *= 1 + (global.civic.professor.workers * global.city['wardenclyffe'].on * 0.01);
        }
        if (global.space['satellite']){
            impact *= 1 + (global.space.satellite.count * 0.01);
        }
        impact = +impact.toFixed(2);
        return loc('job_scientist',[impact]);
    },
    colonist(){
        return loc('job_colonist',[races[global.race.species].solar.red]);
    },
    space_miner(){
        return loc('job_space_miner');
    }
}

// Sets up jobs in civics tab
export function defineJobs(){
    $('#civics').append($(`<h2 class="is-sr-only">${loc('civics_jobs')}</h2><div class="tile is-child"><div id="jobs" class="tile is-child"></div><div id="foundry" class="tile is-child"></div></div>`));
    loadUnemployed();
    loadJob('farmer','Farmer',1.35);
    loadJob('lumberjack','Lumberjack',1);
    loadJob('quarry_worker','Quarry Worker',1);
    loadJob('miner','Miner',1);
    loadJob('coal_miner','Coal Miner',0.2);
    loadJob('craftsman','Craftsman',1);
    loadJob('cement_worker','Cement Plant Worker',0.4);
    loadJob('entertainer','Entertainer',1);
    loadJob('professor','Professor',0.5);
    loadJob('scientist','Scientist',1);
    loadJob('banker','Banker',0.1);
    loadJob('colonist','Colonist',1);
    loadJob('space_miner','Space Miner',1);
    loadFoundry();
}

function loadUnemployed(){
    let color = 'warning';
    
    let id = 'civ-free';
    let civ_container = $(`<div id="${id}" class="job"></div>`);
    let job = global.race['carnivore'] || global.race['evil'] ? loc('job_hunter1') : loc('job_unemployed1');
    let job_label = $(`<div class="job_label"><h3 class="has-text-${color}">${job}</h3><span class="count">{{ free }}</span></div>`);
    civ_container.append(job_label);
    $('#jobs').append(civ_container);
    
    vues['civ_free'] = new Vue({
        data: global.civic,
    });
    vues['civ_free'].$mount(`#${id}`);
    
    $(`#${id} .job_label`).on('mouseover',function(){
            let text = global.race['carnivore'] || global.race['evil'] ? (global.race['evil'] ? loc('job_evil_hunter') : loc('job_hunter2')) : loc('job_unemployed2');
            var popper = $(`<div id="pop${id}" class="popper has-background-light has-text-dark">${text}</div>`);
            $('#main').append(popper);
            popper.show();
            poppers[id] = new Popper($(`#${id} .job_label`),popper);
        });
    $(`#${id} .job_label`).on('mouseout',function(){
            $(`#pop${id}`).hide();
            poppers[id].destroy();
            $(`#pop${id}`).remove();
        });
}

function loadJob(job, name, impact, color){
    color = color || 'info';
    if (!global['civic'][job]){
        global['civic'][job] = {
            job: job,
            name: name,
            display: false,
            workers: 0,
            max: 0,
            impact: impact
        };
    }

    global.civic[job].impact = impact;
    
    if (job === 'craftsman'){
        return;
    }

    var id = 'civ-' + job;
    
    var civ_container = $(`<div id="${id}" v-show="display" class="job"></div>`);
    var controls = $('<div class="controls"></div>');
    if (job === 'farmer' || job === 'lumberjack' || job === 'quarry_worker'){
        let job_label = $(`<div class="job_label"><h3 class="has-text-${color}">{{ name }}</h3><span class="count">{{ workers }}</span></div>`);
        civ_container.append(job_label);
    }
    else {
        let job_label = $(`<div class="job_label"><h3 class="has-text-${color}">{{ name }}</h3><span class="count">{{ workers }} / {{ max }}</span></div>`);
        civ_container.append(job_label);
    }
    civ_container.append(controls);
    $('#jobs').append(civ_container);
    
    var sub = $(`<span role="button" aria-label="remove ${job}" class="sub" @click="sub">&laquo;</span>`);
    var add = $(`<span role="button" aria-label="add ${job}" class="add" @click="add">&raquo;</span>`);
    
    controls.append(sub);
    controls.append(add);
    
    vues[`civ_+${job}`] = new Vue({
        data: global.civic[job],
        methods: {
            add(){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if ((global['civic'][job].max === -1 || global.civic[job].workers < global['civic'][job].max) && global.civic.free > 0){
                        global.civic[job].workers++;
                        global.civic.free--;
                    }
                    else {
                        break;
                    }
                }
            },
            sub(){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if (global.civic[job].workers > 0){
                        global.civic[job].workers--;
                        global.civic.free++;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    });
    vues[`civ_+${job}`].$mount(`#${id}`);
    
    $(`#${id} .job_label`).on('mouseover',function(){
            var popper = $(`<div id="pop${id}" class="popper has-background-light has-text-dark"></div>`);
            $('#main').append(popper);
            popper.html(job_desc[job]());
            popper.show();
            poppers[id] = new Popper($(`#${id} .job_label`),popper);
        });
    $(`#${id} .job_label`).on('mouseout',function(){
            $(`#pop${id}`).hide();
            poppers[id].destroy();
            $(`#pop${id}`).remove();
        });
}

export function loadFoundry(){
    if (vues['foundry']){
        vues['foundry'].$destroy();
    }
    $('#foundry').empty();
    if (global.city['foundry']){
        var foundry = $(`<div class="job"><div class="foundry job_label"><h3 class="has-text-warning">${loc('craftsman_assigned')}</h3><span class="count">{{ f.crafting }} / {{ c.max }}</span></div></div>`);
        $('#foundry').append(foundry);

        let list = ['Plywood','Brick','Wrought_Iron','Sheet_Metal','Mythril'];
        for (let i=0; i<list.length; i++){
            let res = list[i];
            if (global.resource[res].display){
                let name = global.resource[res].name;
                let resource = $(`<div class="job"></div>`);
                $('#foundry').append(resource);

                let controls = $('<div class="controls"></div>');
                let job_label = $(`<div id="craft${res}" class="job_label" @mouseover="hover('${res}')" @mouseout="unhover('${res}')"><h3 class="has-text-danger">${name}</h3><span class="count">{{ f.${res} }}</span></div>`);
                resource.append(job_label);
                resource.append(controls);
                $('#foundry').append(resource);
                
                let sub = $(`<span role="button" aria-label="remove ${res} craftsman" class="sub" @click="sub('${res}')">&laquo;</span>`);
                let add = $(`<span role="button" aria-label="add ${res} craftsman" class="add" @click="add('${res}')">&raquo;</span>`);
                
                controls.append(sub);
                controls.append(add);
            }
        }
        vues['foundry'] = new Vue({
            data: {
                f: global.city.foundry,
                c: global.civic.craftsman
            },
            methods: {
                add(res){
                    let keyMult = keyMultiplier();
                    for (let i=0; i<keyMult; i++){
                        if (global.city.foundry.crafting < global.civic.craftsman.max && global.civic.free > 0){
                            global.civic.craftsman.workers++;
                            global.city.foundry.crafting++;
                            global.city.foundry[res]++;
                            global.civic.free--;
                        }
                        else {
                            break;
                        }
                    }
                },
                sub(res){
                    let keyMult = keyMultiplier();
                    for (let i=0; i<keyMult; i++){
                        if (global.city.foundry[res] > 0){
                            global.city.foundry[res]--;
                            global.civic.craftsman.workers--;
                            global.city.foundry.crafting--;
                            global.civic.free++;
                        }
                        else {
                            break;
                        }
                    }
                },
                hover(res){
                    var popper = $(`<div id="popCraft${res}" class="popper has-background-light has-text-dark"></div>`);
                    $('#main').append(popper);
                    let name = global.resource[res].name;
                    let multiplier = craftingRatio(res);
                    if (global.tech['v_train']){
                        multiplier *= 2;
                    }
                    if (global.genes['crafty']){
                        multiplier *= 1 + ((global.genes.crafty - 1) * 0.5);
                    }
                    let final = +(global.city.foundry[res] * multiplier).toFixed(2);
                    let bonus = (multiplier * 100).toFixed(0);

                    popper.append($(`<div>+${bonus}% Craftsman ${name}</div>`));
                    popper.append($(`<div>+${final} ${name}/cycle</div>`));
                    for (let i=0; i<craftCost[res].length; i++){
                        let cost = +(craftCost[res][i].a * global.city.foundry[res]).toFixed(2);
                        popper.append($(`<div>-${cost} ${global.resource[craftCost[res][i].r].name}/cycle<div>`));
                    }
    
                    popper.show();
                    poppers[`cr${res}`] = new Popper($(`#craft${res}`),popper);
                },
                unhover(res){
                    $(`#popCraft${res}`).hide();
                    poppers[`cr${res}`].destroy();
                    $(`#popCraft${res}`).remove();
                }
            }
        });
        vues['foundry'].$mount(`#foundry`);

        $(`#foundry .foundry`).on('mouseover',function(){
            var popper = $(`<div id="popFoundry" class="popper has-background-light has-text-dark"></div>`);
            $('#main').append(popper);
            if (global.genes['crafty']){
                popper.html(loc('job_craftsman2'));
            }
            else {
                popper.html(loc('job_craftsman1'));
            }
            popper.show();
            poppers['popFoundry'] = new Popper($(`#foundry .foundry`),popper);
        });
        $(`#foundry .foundry`).on('mouseout',function(){
            $(`#popFoundry`).hide();
            poppers['popFoundry'].destroy();
            $(`#popFoundry`).remove();
        });
    }
}
