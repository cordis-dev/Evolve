import { global, vues, keyMultiplier, modRes, poppers, breakdown, sizeApproximation, p_on, red_on, achieve_level } from './vars.js';
import { races } from './races.js';
import { loc } from './locale.js'

export const resource_values = {
    Food: 5,
    Lumber: 5,
    Stone: 5,
    Furs: 8,
    Copper: 25,
    Iron: 40,
    Aluminium: 50,
    Cement: 15,
    Coal: 20,
    Oil: 75,
    Uranium: 550,
    Steel: 100,
    Titanium: 150,
    Alloy: 350,
    Polymer: 250,
    Iridium: 420,
    //Deuterium: 450,
    Helium_3: 620,
    Elerium: 2000,
    Neutronium: 1500,
    Nano_Tube: 750,
};

export const tradeRatio = {
    Food: 2,
    Lumber: 2,
    Stone: 2,
    Furs: 1,
    Copper: 1,
    Iron: 1,
    Aluminium: 1,
    Cement: 1,
    Coal: 1,
    Oil: 0.5,
    Uranium: 0.25,
    Steel: 0.5,
    Titanium: 0.25,
    Alloy: 0.2,
    Polymer: 0.2,
    Iridium: 0.1,
    Helium_3: 0.1,
    Elerium: 0.1,
    Neutronium: 0.1,
    Nano_Tube: 0.1,
}

export const craftCost = {
    Plywood: [{ r: 'Lumber', a: 100 }],
    Brick: [{ r: 'Cement', a: 40 }],
    Bronze: [{ r: 'Copper', a: 80 }],
    Wrought_Iron: [{ r: 'Iron', a: 80 }],
    Sheet_Metal: [{ r: 'Aluminium', a: 120 }],
    Mythril: [{ r: 'Iridium', a: 100 },{ r: 'Alloy', a: 250 }],
};

export function craftingRatio(res){
    let skill = global.tech['foundry'] >= 5 ? (global.tech['foundry'] >= 8 ? 0.08 : 0.05) : 0.03;
    let multiplier = global.tech['foundry'] >= 2 ? 1 + (global.city.foundry.count * skill) : 1;
    if (global.tech['foundry'] >= 3 && global.city.foundry[res] > 1){
        multiplier += (global.city.foundry[res] - 1) * 0.03;
    }
    if (global.tech['foundry'] >= 4 && res === 'Plywood' && global.city['sawmill']){
        multiplier += global.city['sawmill'].count * 0.02;
    }
    if (global.tech['foundry'] >= 6 && res === 'Brick'){
        multiplier += global.city['foundry'].count * 0.02;
    }
    if (global.tech['foundry'] >= 7){
        multiplier += p_on['factory'] * 0.05;
        if (global.tech['mars'] >= 4){
            multiplier += p_on['red_factory'] * 0.05;
        }
    }
    if (global.space['fabrication']){
        multiplier += red_on['fabrication'] * global.civic.colonist.workers * 0.02;
    }
    if (global.race['crafty']){
        multiplier += 0.03;
    }
    if (global.race['ambidextrous']){
        multiplier += (global.race['ambidextrous'] / 100);
    }
    if (global.race['rigid']){
        multiplier -= 0.01;
    }
    if (global.race.Plasmid.count > 0){
        multiplier *= plasmidBonus() / 8 + 1;
    }
    if (global.race['no_plasmid']){
        if (global.city['temple'] && global.city['temple'].count){
            let temple_bonus = global.tech['anthropology'] && global.tech['anthropology'] >= 1 ? 0.016 : 0.01;
            if (global.tech['fanaticism'] && global.tech['fanaticism'] >= 2){
                temple_bonus += global.civic.professor.workers * 0.0004;
            }
            multiplier *= 1 + (global.city.temple.count * temple_bonus / 4);
        }
    }
    if (global.genes['challenge'] && global.genes['challenge'] >= 2){
        multiplier *= 1 + (achieve_level * 0.0025);
    }
    return multiplier;
}

// Sets up resource definitions
export function defineResources(){
    if (global.race.species === 'protoplasm'){
        loadResource('RNA',100,1,false);
        loadResource('DNA',100,1,false);
    }
    else {
        initMarket();
        loadResource('Money',1000,1,false,false,'success');
        loadResource(races[global.race.species].name,0,0,false,false,'warning');
        loadResource('Knowledge',100,1,false,false,'warning');
        loadResource('Crates',0,0,false,false,'warning');
        loadResource('Containers',0,0,false,false,'warning');
        loadResource('Food',250,1,true,true);
        loadResource('Lumber',200,1,true,true);
        loadResource('Stone',200,1,true,true);
        loadResource('Furs',100,1,true,true);
        loadResource('Copper',100,1,true,true);
        loadResource('Iron',100,1,true,true);
        loadResource('Aluminium',50,1,true,true);
        loadResource('Cement',100,1,true,true);
        loadResource('Coal',50,1,true,true);
        loadResource('Oil',0,1,true,false);
        loadResource('Uranium',10,1,true,false);
        loadResource('Steel',50,1,true,true);
        loadResource('Titanium',50,1,true,true);
        loadResource('Alloy',50,1,true,true);
        loadResource('Polymer',50,1,true,true);
        loadResource('Iridium',0,1,true,true);
        //loadResource('Deuterium',0,1,true,false);
        loadResource('Helium_3',0,1,true,false);
        loadResource('Neutronium',0,1,false,false,'special');
        loadResource('Elerium',1,1,false,false,'special');
        loadResource('Nano_Tube',0,1,false,false,'special');
        loadResource('Plywood',-1,0,false,false,'danger');
        loadResource('Brick',-1,0,false,false,'danger');
        loadResource('Bronze',-1,0,false,false,'danger');
        loadResource('Wrought_Iron',-1,0,false,false,'danger');
        loadResource('Sheet_Metal',-1,0,false,false,'danger');
        loadResource('Mythril',-1,0,false,false,'danger');
        loadRouteCounter();
    }
    loadSpecialResource('Plasmid');
    loadSpecialResource('Phage');
}

// Load resource function
// This function defines each resource, loads saved values from localStorage
// And it creates Vue binds for various resource values
function loadResource(name,max,rate,tradable,stackable,color){
    color = color || 'info';
    if (!global['resource'][name]){
        global['resource'][name] = {
            name: name === races[global.race.species].name ? name : (name === 'Money' ? '$' : loc(`resource_${name}_name`)),
            display: false,
            value: resource_values[name],
            amount: 0,
            crates: 0,
            diff: 0,
            delta: 0,
            max: max,
            rate: rate
        };
    }
    else {
        global['resource'][name].name = name === races[global.race.species].name? name : (name === 'Money' ? '$' : loc(`resource_${name}_name`));
    }

    if (global.race['evil']){
        switch(name){
            case 'Lumber':
                global['resource'][name].name = 'Bones';
                break;
            case 'Furs':
                global['resource'][name].name = 'Flesh';
                break;
            case 'Food':
                global['resource'][name].name = 'Souls';
                break;
            case 'Plywood':
                global['resource'][name].name = 'Boneweave';
                break;
        }
    }

    if (vues[`res_${name}`]){
        vues[`res_${name}`].$destroy();
    }

    global['resource'][name]['stackable'] = stackable;
    if (!global['resource'][name]['crates']){
        global['resource'][name]['crates'] = 0;
    }
    if (!global['resource'][name]['containers']){
        global['resource'][name]['containers'] = 0;
    }
    if (!global['resource'][name]['delta']){
        global['resource'][name]['delta'] = 0;
    }
    if (!global['resource'][name]['trade'] && tradable){
        global['resource'][name]['trade'] = 0;
    }

    var res_container;
    if (global.resource[name].max === -1){
        res_container = $(`<div id="res${name}" class="resource crafted" v-show="display"><h3 class="res has-text-${color}">{{ name | namespace }}</h3><span id="cnt${name}" class="count">{{ amount | diffSize }}</span></div>`);
    }
    else {
        res_container = $(`<div id="res${name}" class="resource" v-show="display"><h3 class="res has-text-${color}">{{ name | namespace }}</h3><span id="cnt${name}" class="count">{{ amount | size }} / {{ max | size }}</span></div>`);
    }

    if (stackable){
        res_container.append($(`<span><span id="con${name}" v-if="showTrigger()" class="interact has-text-success" @click="trigModal">+</span></span>`));
    }
    else if (max !== -1){
        res_container.append($('<span></span>'));
    }
    
    if (rate !== 0){
        res_container.append($(`<span id="inc${name}" class="diff" :aria-label="resRate('${name}')">{{ diff | diffSize }} /s</span>`));
    }
    else if (max === -1 && !global.race['no_craft']){
        let craft = $('<span class="craftable"></span>');
        res_container.append(craft);

        let inc = [1,5];
        for (let i=0; i<inc.length; i++){
            craft.append($(`<span id="inc${name}${inc[i]}" @mouseover="hover('${name}',${inc[i]})" @mouseout="unhover('${name}',${inc[i]})"><a @click="craft('${name}',${inc[i]})" aria-label="craft ${inc[i]} ${name}">+<span class="craft" data-val="${inc[i]}">${inc[i]}</span></a></span>`));
        }
        craft.append($(`<span id="inc${name}A"><a @click="craft('${name}','A')" aria-label="craft max ${name}">+A</a></span>`));
    }
    else {
        res_container.append($(`<span></span>`));
    }
    
    $('#resources').append(res_container);

    var modal = {
            template: '<div id="modalBox" class="modalBox"></div>'
        };
    
    vues[`res_${name}`] = new Vue({
        data: global['resource'][name], 
        filters: {
            size: function (value){
                return sizeApproximation(value,0);
            },
            diffSize: function (value){
                return sizeApproximation(value,2);
            },
            namespace(val){
                return val.replace("_", " ");
            }
        },
        methods: {
            resRate(n){
                let diff = sizeApproximation(global.resource[n].diff,2);
                return `${n} ${diff} per second`;
            },
            trigModal(){
                this.$modal.open({
                    parent: this,
                    component: modal
                });
                
                var checkExist = setInterval(function(){
                   if ($('#modalBox').length > 0) {
                      clearInterval(checkExist);
                      drawModal(name,color);
                   }
                }, 50);
            },
            showTrigger(){
                return global.resource.Crates.display;
            },
            craft(res,vol){
                let craft_bonus = craftingRatio(res);
                let volume = Math.floor(global.resource[craftCost[res][0].r].amount / craftCost[res][0].a);
                for (let i=1; i<craftCost[res].length; i++){
                    let temp = Math.floor(global.resource[craftCost[res][i].r].amount / craftCost[res][i].a);
                    if (temp < volume){
                        volume = temp;
                    }
                }
                if (vol !== 'A'){
                    let total = vol * keyMultiplier();
                    if (total < volume){
                        volume = total;
                    }
                }
                for (let i=0; i<craftCost[res].length; i++){
                    let num = volume * craftCost[res][i].a;
                    global.resource[craftCost[res][i].r].amount -= num;
                }
                global.resource[res].amount += volume * craft_bonus;
            },
            craftCost(res,vol){
                let costs = '';
                for (let i=0; i<craftCost[res].length; i++){
                    let num = vol * craftCost[res][i].a * keyMultiplier();
                    costs = costs + `<div>${global.resource[craftCost[res][i].r].name} ${num}</div>`;
                }
                return costs;
            },
            hover(res,vol){
                var popper = $(`<div id="popRes${res}${vol}" class="popper has-background-light has-text-dark"></div>`);
                $('#main').append(popper);

                let bonus = (craftingRatio(res) * 100).toFixed(0);
                popper.append($(`<div>+${bonus}% Crafted ${global.resource[res].name}</div>`));

                for (let i=0; i<craftCost[res].length; i++){
                    let num = typeof vol === 'number' ? vol * craftCost[res][i].a : vol;
                    popper.append($(`<div>${global.resource[craftCost[res][i].r].name} <span class="craft" data-val="${num}">${num}</span></div>`));
                }

                popper.show();
                poppers[`r${res}${vol}`] = new Popper($(`#inc${res}${vol}`),popper);
            },
            unhover(res,vol){
                $(`#popRes${res}${vol}`).hide();
                poppers[`r${res}${vol}`].destroy();
                $(`#popRes${res}${vol}`).remove();
            }
        }
    });
    vues[`res_${name}`].$mount(`#res${name}`);

    breakdownPopover(`cnt${name}`,name,'c');

    if (stackable){
        $(`#con${name}`).on('mouseover',function(){
            var popper = $(`<div id="popContainer${name}" class="popper has-background-light has-text-dark"></div>`);
            $('#main').append(popper);
            popper.append($(`<div>Crates ${global.resource[name].crates}</div>`));
            if (global.tech['steel_container']){
                popper.append($(`<div>Containers ${global.resource[name].containers}</div>`));
            }
            popper.show();
            poppers[name] = new Popper($(`#con${name}`),popper);
        });
        $(`#con${name}`).on('mouseout',function(){
            $(`#popContainer${name}`).hide();
            poppers[name].destroy();
            $(`#popContainer${name}`).remove();
        });
    }

    if (name !== races[global.race.species].name && name !== 'Crates' && name !== 'Containers'){
        breakdownPopover(`inc${name}`,name,'p');
    }

    if (tradable){
        var market_item = $(`<div id="market-${name}" class="market-item" v-show="r.display"></div>`);
        $('#market').append(market_item);
        marketItem(`market_${name}`,`#market-${name}`,market_item,name,color,true);
    }
}

function loadSpecialResource(name,color) {
    if ($(`#res${name}`).length){
        let bind = $(`#res${name}`);
        bind.detach;
        $('#resources').append(bind);
        return;
    }

    color = color || 'special';
    
    var res_container = $(`<div id="res${name}" class="resource" v-show="count"><span class="res has-text-${color}">${name}</span><span class="count">{{ count }}</span></div>`);
   
    $('#resources').append(res_container);
    
    vues[`res_${name}`] = new Vue({
        data: global.race[name]
    });
    vues[`res_${name}`].$mount(`#res${name}`);
}

function marketItem(vue,mount,market_item,name,color,full){
    if (full){
        market_item.append($(`<h3 class="res has-text-${color}">{{ r.name | namespace }}</h3>`));
    }

    if (!global.race['no_trade']){
        market_item.append($(`<span class="buy"><span class="has-text-success">${loc('resource_market_buy')}</span></span>`));
        market_item.append($(`<span role="button" class="order" @click="purchase('${name}')">\${{ r.value | buy }}</span>`));
        
        market_item.append($(`<span class="sell"><span class="has-text-danger">${loc('resource_market_sell')}</span></span>`));
        market_item.append($(`<span role="button" class="order" @click="sell('${name}')">\${{ r.value | sell }}</span>`));
    }

    if (full){
        let trade = $(`<span class="trade" v-show="m.active"><span class="has-text-warning">${loc('resource_market_routes')}</span></span>`);
        market_item.append(trade);
        trade.append($(`<b-tooltip :label="aBuy('${name}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="import ${name}" class="sub has-text-success" @click="autoBuy('${name}')"><span class="route">+</span></span></b-tooltip>`));
        trade.append($(`<span class="current">{{ r.trade | trade }}</span>`));
        trade.append($(`<b-tooltip :label="aSell('${name}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="export ${name}" class="add has-text-danger" @click="autoSell('${name}')"><span class="route">-</span></span></b-tooltip>`));
        tradeRouteColor(name);
    }
    
    vues[vue] = new Vue({
        data: { 
            r: global.resource[name],
            m: global.city.market
        },
        methods: {
            aSell(res){
                let unit = tradeRatio[res] === 1 ? loc('resource_market_unit') : loc('resource_market_units');
                let price = tradeSellPrice(res);
                return loc('resource_market_auto_sell_desc',[tradeRatio[res],unit,price]);
            },
            aBuy(res){
                let unit = tradeRatio[res] === 1 ? loc('resource_market_unit') : loc('resource_market_units');
                let price = tradeBuyPrice(res);
                return loc('resource_market_auto_buy_desc',[tradeRatio[res],unit,price]);
            },
            purchase(res){
                if (!global.race['no_trade']){
                    let qty = Number(vues['market_qty'].qty);
                    let value = global.race['arrogant'] ? Math.round(global.resource[res].value * 1.1) : global.resource[res].value;
                    if (global.race['conniving']){
                        value *= 0.95;
                    } 
                    var price = Math.round(value * qty);
                    if (global.resource.Money.amount >= price){
                        global.resource[res].amount += qty;
                        global.resource.Money.amount -= price;
                        
                        global.resource[res].value += Number((qty / Math.rand(1000,10000)).toFixed(2));
                    }
                }
            },
            sell(res){
                if (!global.race['no_trade']){
                    var qty = Number(vues['market_qty'].qty);
                    if (global.resource[res].amount >= qty){
                        let divide = global.race['merchant'] ? 3 : (global.race['asymmetrical'] ? 5 : 4);
                        if (global.race['conniving']){
                            divide -= 0.5;
                        } 
                        let price = Math.round(global.resource[res].value * qty / divide);
                        global.resource[res].amount -= qty;
                        global.resource.Money.amount += price;
                        
                        global.resource[res].value -= Number((qty / Math.rand(1000,10000)).toFixed(2));
                        if (global.resource[res].value < Number(resource_values[res] / 2)){
                            global.resource[res].value = Number(resource_values[res] / 2);
                        }
                    }
                }
            },
            autoBuy(res){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if (global.resource[res].trade >= 0){
                        if (global.city.market.trade < global.city.market.mtrade){
                            global.city.market.trade++;
                            global.resource[res].trade++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        global.city.market.trade--;
                        global.resource[res].trade++;
                    }
                }
                tradeRouteColor(res);
            },
            autoSell(res){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if (global.resource[res].trade <= 0){
                        if (global.city.market.trade < global.city.market.mtrade){
                            global.city.market.trade++;
                            global.resource[res].trade--;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        global.city.market.trade--;
                        global.resource[res].trade--;
                    }
                }
                tradeRouteColor(res);
            }
        },
        filters: {
            buy(value){
                if (global.race['arrogant']){
                    value = Math.round(value * 1.1);
                }
                return sizeApproximation(value * vues['market_qty'].qty,0);
            },
            sell(value){
                let divide = global.race['merchant'] ? 3 : (global.race['asymmetrical'] ? 5 : 4);
                return sizeApproximation(value * vues['market_qty'].qty / divide,0);
            },
            trade(val){
                if (val < 0){
                    val = 0 - val;
                    return `-${val}`;
                }
                else if (val > 0){
                    return `+${val}`;
                }
                else {
                    return 0;
                }
            },
            namespace(val){
                return val.replace("_", " ");
            }
        }
    });
    vues[vue].$mount(mount);
}

export function tradeSellPrice(res){
    let divide = global.race['merchant'] ? 3 : (global.race['asymmetrical'] ? 5 : 4);
    if (global.race['conniving']){
        divide--;
    }
    let price = Math.round(global.resource[res].value * tradeRatio[res] / divide);
    
    if (global.city['wharf']){
        price = Math.round(price * (1 + (global.city['wharf'].count * 0.01)));
    }
    if (global.space['gps'] && global.space['gps'].count > 3){
        price = Math.round(price * (1 + (global.space['gps'].count * 0.01)));
    }
    return price;
}

export function tradeBuyPrice(res){
    let rate = global.race['arrogant'] ? Math.round(global.resource[res].value * 1.1) : global.resource[res].value;
    if (global.race['conniving']){
        rate *= 0.9;
    }    
    let price = Math.round(rate * tradeRatio[res]);

    if (global.city['wharf']){
        price = Math.round(price * (0.99 ** global.city['wharf'].count));
    }
    if (global.space['gps'] && global.space['gps'].count > 3){
        price = Math.round(price * (0.99 ** global.space['gps'].count));
    }
    return price;
}

function breakdownPopover(id,name,type){
    $(`#${id}`).on('mouseover',function(){
        
        var popper = $(`<div id="resBreak${id}" class="popper has-background-light has-text-dark"></div>`);
        $('#main').append(popper);
        let bd = $(`<div class="resBreakdown"><div class="has-text-info">{{ res.name | namespace }}</div></div>`);

        if (breakdown[type][name]){
            let types = [name,'Global'];
            for (var i = 0; i < types.length; i++){
                let t = types[i];
                if (breakdown[type][t]){
                    Object.keys(breakdown[type][t]).forEach(function (mod){
                        let raw = breakdown[type][t][mod];
                        let val = parseFloat(raw.slice(0,-1));
                        if (val != 0 && !isNaN(val)){
                            let type = val > 0 ? 'success' : 'danger';
                            let label = mod.replace("_"," ");
                            bd.append(`<div class="resBD"><span>${label}</span><span class="has-text-${type}">{{ ${t}['${mod}'] | translate }}</span></div>`);
                        }
                    });
                }
            }
        }

        if (breakdown[type].consume && breakdown[type].consume[name]){
            Object.keys(breakdown[type].consume[name]).forEach(function (mod){
                let val = breakdown[type].consume[name][mod];
                if (val != 0 && !isNaN(val)){
                    let type = val > 0 ? 'success' : 'danger';
                    let label = mod.replace("_"," ");
                    bd.append(`<div class="resBD"><span>${label}</span><span class="has-text-${type}">{{ consume.${name}['${mod}'] | fix | translate }}</span></div>`);
                }
            });
        }

        if (type === 'p'){
            let dir = global['resource'][name].diff > 0 ? 'success' : 'danger';
            bd.append(`<div class="rate"><span>{{ res.diff | direction }}</span><span class="has-text-${dir}">{{ res.amount | counter }}</span></div>`);
        }

        popper.append(bd);
        popper.show();
        poppers[type+name] = new Popper($(`#${id}`),popper);

        vues[`res_${id}_temp`] = new Vue({
            data: {
                'Global': breakdown[type]['Global'],
                [name]: breakdown[type][name],
                'consume': breakdown[type]['consume'],
                res: global['resource'][name]
            }, 
            filters: {
                translate(raw){
                    let type = raw[raw.length -1];
                    let val = parseFloat(raw.slice(0,-1));
                    val = +(val).toFixed(2);
                    let suffix = type === '%' ? '%' : '';
                    if (val > 0){
                        return '+' + sizeApproximation(val,2) + suffix;
                    }
                    else if (val < 0){
                        return sizeApproximation(val,2) + suffix;
                    }
                },
                fix(val){
                    return val + 'v';
                },
                counter(val){
                    let rate = global['resource'][name].diff;
                    let time = 0;
                    if (rate < 0){
                        rate *= -1;
                        time = +(val / rate).toFixed(0);
                    }
                    else {
                        let gap = global['resource'][name].max - val;
                        time = +(gap / rate).toFixed(0);
                    }

                    if (time === Infinity || Number.isNaN(time)){
                        return 'Never';
                    }
                    
                    if (time > 60){
                        let secs = time % 60;
                        let mins = (time - secs) / 60;
                        if (mins >= 60){
                            let r = mins % 60;
                            let hours = (mins - r) / 60;
                            return `${hours}h ${r}m`;
                        }
                        else {
                            return `${mins}m ${secs}s`;
                        }
                    }
                    else {
                        return `${time}s`;
                    }
                },
                direction(val){
                    return val >= 0 ? 'To Full' : 'To Empty';
                },
                namespace(name){
                    return name.replace("_"," ");
                }
            }
        });
        vues[`res_${id}_temp`].$mount(`#resBreak${id} > div`);
    });
    $(`#${id}`).on('mouseout',function(){
        $(`#resBreak${id}`).hide();
        if (poppers[type+name]){
            poppers[type+name].destroy();
        }
        $(`#resBreak${id}`).remove();
        vues[`res_${id}_temp`].$destroy();
    });
}

function loadRouteCounter(){
    let no_market = global.race['no_trade'] ? ' nt' : '';
    var market_item = $(`<div id="tradeTotal" v-show="active" class="market-item"><span class="tradeTotal${no_market}"><span class="has-text-warning">${loc('resource_market_trade_routes')}</span> {{ trade }} / {{ mtrade }}</span></div>`);
    $('#market').append(market_item);
    vues['market_totals'] = new Vue({
        data: global.city.market
    });
    vues['market_totals'].$mount('#tradeTotal');
}

function tradeRouteColor(res){
    $(`#market-${res} .trade .current`).removeClass('has-text-warning');
    $(`#market-${res} .trade .current`).removeClass('has-text-danger');
    $(`#market-${res} .trade .current`).removeClass('has-text-success');
    if (global.resource[res].trade > 0){
        $(`#market-${res} .trade .current`).addClass('has-text-success');
    }
    else if (global.resource[res].trade < 0){
        $(`#market-${res} .trade .current`).addClass('has-text-danger');
    }
    else {
        $(`#market-${res} .trade .current`).addClass('has-text-warning');
    }
}

function drawModal(name,color){
    $('#modalBox').append($('<p id="modalBoxTitle" class="has-text-warning modalTitle">{{ name }} - {{ amount | size }}/{{ max | size }}</p>'));
    
    let body = $('<div class="modalBody"></div>');
    $('#modalBox').append(body);
    
    vues['modalCrates'] = new Vue({
        data: { 
            crates: global['resource']['Crates'],
            res: global['resource'][name],
        },
        methods: {
            buildCrateLabel: function(){
                let material = global.race['kindling_kindred'] ? global.resource.Stone.name : global.resource.Plywood.name;
                let cost = global.race['kindling_kindred'] ? 200 : 10
                return loc('resource_modal_crate_construct_desc',[cost,material]);
            },
            removeCrateLabel: function(){
                let cap = crateValue();
                return loc('resource_modal_crate_unassign_desc',[cap]);
            },
            addCrateLabel: function(){
                let cap = crateValue();
                return loc('resource_modal_crate_assign_desc',[cap]);
            },
            buildCrate: function(){
                let keyMutipler = keyMultiplier();
                let material = global.race['kindling_kindred'] ? 'Stone' : 'Plywood';
                let cost = global.race['kindling_kindred'] ? 200 : 10;
                if (keyMutipler + global.resource.Crates.amount > global.resource.Crates.max){
                    keyMutipler = global.resource.Crates.max - global.resource.Crates.amount;
                }
                if (global.resource[material].amount < cost * keyMutipler){
                    keyMutipler = Math.floor(global.resource[material].amount / cost);
                }
                if (global.resource[material].amount >= (cost * keyMutipler) && global.resource.Crates.amount < global.resource.Crates.max){
                    modRes(material,-(cost * keyMutipler));
                    global.resource.Crates.amount += keyMutipler;
                }
            },
            removeCrate: function(res){
                let keyMutipler = keyMultiplier();
                let cap = crateValue();
                if (keyMutipler > global.resource[res].crates){
                    keyMutipler = global.resource[res].crates;
                }
                if (keyMutipler > 0){
                    global.resource.Crates.amount += keyMutipler;
                    global.resource.Crates.max += keyMutipler;
                    global.resource[res].crates -= keyMutipler;
                    global.resource[res].max -= (cap * keyMutipler);
                }
            },
            addCrate: function(res){
                let keyMutipler = keyMultiplier();
                let cap = crateValue();
                if (keyMutipler > global.resource.Crates.amount){
                    keyMutipler = global.resource.Crates.amount;
                }
                if (keyMutipler > 0){
                    global.resource.Crates.amount -= keyMutipler;
                    global.resource.Crates.max -= keyMutipler;
                    global.resource[res].crates += keyMutipler;
                    global.resource[res].max += (cap * keyMutipler);
                }
            }
        }
    });
    
    let crates = $('<div id="modalCrates" class="crates"></div>');
    body.append(crates);
    
    crates.append($(`<div class="crateHead"><span>${loc('resource_modal_crate_owned')} {{ crates.amount }}/{{ crates.max }}</span><span>${loc('resource_modal_crate_assigned')} {{ res.crates }}</span></div>`));
    
    let buildCrate = $(`<b-tooltip :label="buildCrateLabel()" position="is-bottom" animated><button class="button" @click="buildCrate()">${loc('resource_modal_crate_construct')}</button></b-tooltip>`);
    let removeCrate = $(`<b-tooltip :label="removeCrateLabel()" position="is-bottom" animated><button class="button" @click="removeCrate('${name}')">${loc('resource_modal_crate_unassign')}</button></b-tooltip>`);
    let addCrate = $(`<b-tooltip :label="addCrateLabel()" position="is-bottom" animated><button class="button" @click="addCrate('${name}')">${loc('resource_modal_crate_assign')}</button></b-tooltip>`);
    
    crates.append(buildCrate);
    crates.append(removeCrate);
    crates.append(addCrate);
    
    vues['modalCrates'].$mount('#modalCrates');
    
    if (global.city['warehouse'] && global.city['warehouse'].count > 0){
        vues['modalContainer'] = new Vue({
            data: { 
                containers: global['resource']['Containers'],
                res: global['resource'][name],
            },
            methods: {
                buildContainerLabel: function(){
                    return loc('resource_modal_container_construct_desc');
                },
                removeContainerLabel: function(){
                    let cap = containerValue();
                    return loc('resource_modal_container_unassign_desc',[cap]);
                },
                addContainerLabel: function(){
                    let cap = containerValue();
                    return loc('resource_modal_container_assign_desc',[cap]);
                },
                buildContainer: function(){
                    let keyMutipler = keyMultiplier();
                    if (keyMutipler + global.resource.Containers.amount > global.resource.Containers.max){
                        keyMutipler = global.resource.Containers.max - global.resource.Containers.amount;
                    }
                    if (global.resource['Steel'].amount < 125 * keyMutipler){
                        keyMutipler = Math.floor(global.resource['Steel'].amount / 125);
                    }
                    if (global.resource['Steel'].amount >= (125 * keyMutipler) && global.resource.Containers.amount < global.resource.Containers.max){
                        modRes('Steel',-(125 * keyMutipler));
                        global.resource.Containers.amount += keyMutipler;
                    }
                },
                removeContainer: function(res){
                    let keyMutipler = keyMultiplier();
                    let cap = containerValue();
                    if (keyMutipler > global.resource[res].containers){
                        keyMutipler = global.resource[res].containers;
                    }
                    if (keyMutipler > 0){
                        global.resource.Containers.amount += keyMutipler;
                        global.resource.Containers.max += keyMutipler;
                        global.resource[res].containers -= keyMutipler;
                        global.resource[res].max -= (cap * keyMutipler);
                    }
                },
                addContainer: function(res){
                    let keyMutipler = keyMultiplier();
                    let cap = containerValue();
                    if (keyMutipler > global.resource.Containers.amount){
                        keyMutipler = global.resource.Containers.amount;
                    }
                    if (keyMutipler > 0){
                        global.resource.Containers.amount -= keyMutipler;
                        global.resource.Containers.max -= keyMutipler;
                        global.resource[res].containers += keyMutipler;
                        global.resource[res].max += (cap * keyMutipler);
                    }
                }
            }
        });
        
        let containers = $('<div id="modalContainers" class="crates divide"></div>');
        body.append(containers);
        
        containers.append($(`<div class="crateHead"><span>${loc('resource_modal_container_owned')} {{ containers.amount }}/{{ containers.max }}</span><span>${loc('resource_modal_container_assigned')} {{ res.containers }}</span></div>`));
        
        let position = global.race['terrifying'] ? 'is-top' : 'is-bottom';

        let buildContainer = $(`<b-tooltip :label="buildContainerLabel()" position="${position}" animated><button class="button" @click="buildContainer()">${loc('resource_modal_container_construct')}</button></b-tooltip>`);
        let removeContainer = $(`<b-tooltip :label="removeContainerLabel()" position="${position}" animated><button class="button" @click="removeContainer('${name}')">${loc('resource_modal_container_unassign')}</button></b-tooltip>`);
        let addContainer = $(`<b-tooltip :label="addContainerLabel()" position="${position}" animated><button class="button" @click="addContainer('${name}')">${loc('resource_modal_container_assign')}</button></b-tooltip>`);
        
        containers.append(buildContainer);
        containers.append(removeContainer);
        containers.append(addContainer);
        
        vues['modalContainer'].$mount('#modalContainers');
    }

    vues[`modal_res_${name}`] = new Vue({
        data: global['resource'][name], 
        filters: {
            size: function (value){
                return sizeApproximation(value,0);
            },
            diffSize: function (value){
                return sizeApproximation(value,2);
            }
        }
    });
    vues[`modal_res_${name}`].$mount('#modalBoxTitle');
    
    if (global.tech['currency'] && global.tech['currency'] >= 2){
        var market_item = $(`<div id="pop_market" class="market-item" v-show="r.display"></div>`);
        body.append(market_item);
        marketItem(`pop_market_${name}`,'#pop_market',market_item,name,color,false);
    }
}

export function crateValue(){
    let create_value = global.tech['container'] && global.tech['container'] >= 2 ? 500 : 350;
    if (global.race['pack_rat']){
        create_value += global.tech.container >= 2 ? 50 : 25;
    }
    if (global.tech['container'] && global.tech['container'] >= 4){
        create_value += global.tech['container'] >= 5 ? 500 : 250;
    }
    create_value *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole * 0.05) : 1;
    return spatialReasoning(Math.round(create_value));
}

export function containerValue(){
    let container_value = global.tech['steel_container'] && global.tech['steel_container'] >= 3 ? 1200 : 800;
    if (global.race['pack_rat']){
        container_value += global.tech.steel_container >= 3 ? 100 : 50;
    }
    if (global.tech['steel_container'] && global.tech['steel_container'] >= 4){
        container_value += 400;
    }
    container_value *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole * 0.05) : 1;
    return spatialReasoning(Math.round(container_value));
}

export function initMarket(){
    let market = $(`<div id="market-qty" class="market-header"><h2 class="is-sr-only">${loc('resource_market')}</h2</div>`);
    $('#market').empty();
    $('#market').append(market);
    loadMarket();
}

export function loadMarket(){
    let market = $('#market-qty');
    market.empty();

    if (vues['market_qty']){
        vues['market_qty'].$destroy();
    }

    if (!global.race['no_trade']){
        market.append($(`<h3 class="is-sr-only">${loc('resource_trade_qty')}</h3>`));
        market.append($('<b-radio v-model="qty" native-value="10">10x</b-radio>'));
        market.append($('<b-radio v-model="qty" native-value="25">25x</b-radio>'));
        market.append($('<b-radio v-model="qty" native-value="100">100x</b-radio>'));
        if (global.tech['currency'] >= 4){
            market.append($('<b-radio v-model="qty" native-value="250">250x</b-radio>'));
            market.append($('<b-radio v-model="qty" native-value="1000">1000x</b-radio>'));
            market.append($('<b-radio v-model="qty" native-value="2500">2500x</b-radio>'));
        }
        if (global.tech['currency'] >= 6){
            market.append($('<b-radio v-model="qty" native-value="10000">10000x</b-radio>'));
            market.append($('<b-radio v-model="qty" native-value="25000">25000x</b-radio>'));
        }
    }

    vues['market_qty'] = new Vue({
        data: global.city.market
    });
    vues['market_qty'].$mount('#market-qty');
}

export function spatialReasoning(value){
    let plasmids = global.race.Plasmid.count;
    if (global.race['no_plasmid']){
        plasmids = global.race.mutation > global.race.Plasmid.count ? global.race.Plasmid.count : global.race.mutation;
    }
    if (global.genes['store'] && global.genes['store'] >= 4){
        plasmids += global.race.Phage.count;
    }
    if (global.genes['store'] && !global.race['no_plasmid']){
        let divisor = global.genes.store >= 2 ? (global.genes.store >= 3 ? 1250 : 1666) : 2500;
        value *= 1 + (plasmids / divisor);
        value = Math.round(value);
    }
    return value;
}

export function plasmidBonus(){
    let plasmid_bonus = 0;
    let plasmids = global.race['no_plasmid'] ? global.race.mutation : global.race.Plasmid.count;
    if (plasmids > global.race.Plasmid.count){
        plasmids = global.race.Plasmid.count;
    }
    if (global.race['decayed']){
        plasmids -= Math.round((global.stats.days - global.race.decayed) / (300 + global.race.gene_fortify * 25)); 
    }
    let p_cap = 250 + global.race.Phage.count;
    if (plasmids > p_cap){
        plasmid_bonus = (Math.log10(p_cap) / 3.85) + ((Math.log(plasmids + 1 - p_cap) / Math.LN2 / 250));
    }
    else {
        plasmid_bonus = Math.log10(plasmids + 1) / 3.85;
    }
    if (global.city['temple'] && global.city['temple'].count && !global.race['no_plasmid']){
        let temple_bonus = global.tech['anthropology'] && global.tech['anthropology'] >= 1 ? 0.08 : 0.05;
        if (global.tech['fanaticism'] && global.tech['fanaticism'] >= 2){
            temple_bonus += global.civic.professor.workers * 0.002;
        }
        plasmid_bonus *= 1 + (global.city.temple.count * temple_bonus);
    }
    return plasmid_bonus;
}
