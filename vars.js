export var save = window.localStorage;
export var global = {
    seed: 1,
    resource: {},
    evolution: {},
    tech: {},
    city: {},
    space: {},
    civic: { free: 0 },
    race: {},
    genes: {},
    stats: {
        start: Date.now(),
        days: 0,
        tdays: 0
    },
    event: 200
};
export var vues = {};
export var poppers = {};
export var breakdown = {
    c: {},
    p: {}
};
export var p_on = {};
export var red_on = {};
export var moon_on = {};
export var belt_on = {};
export var quantium_level = 0;
export var achieve_level = 0;
export function set_qlevel(q_level){
    quantium_level = q_level;
}
export function set_alevel(a_level){
    achieve_level = a_level;
} 

Math.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Math.seed = 2;
Math.seededRandom = function(min, max) {
    max = max || 1;
    min = min || 0;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
    global.seed = Math.seed;
    return min + rnd * (max - min);
}

var global_data = save.getItem('evolved') || false;
if (global_data) {
    // Load pre-existing game data
    let saveState = JSON.parse(LZString.decompressFromUTF16(global_data));
    if (saveState){
        global = saveState;
        Math.seed = global.seed;
    }
    else {
        newGameData();
    }
}
else {
    newGameData();
}

if (!global['version']){
    global['version'] = '0.2.0';
}

if (convertVersion(global['version']) < 4003 && global.stats['achieve']){
    Object.keys(global.stats.achieve).forEach(function (key){
        global.stats.achieve[key] = 1;
    });
}

if (convertVersion(global['version']) < 4001 && global['city'] && global.city['factory'] && !global.city.factory['Nano']){
    global.city.factory['Nano'] = 0;
}

if (convertVersion(global['version']) < 3004 && global['settings'] && global.settings['space'] && global.settings.space.belt){
    global.space['space_station'] = { count: 0, on: 0, support: 0, s_max: 0 };
}

if (convertVersion(global['version']) < 3002 && global['space']){
    if (global.tech['space'] && global.tech['space'] >= 4){
        if (!global.space['living_quarters']){
            global.space['living_quarters'] = { count: 0, on: 0 };
        }
        if (!global.space['garage']){
            global.space['garage'] = { count: 0 };
        }
        if (!global.space['red_mine']){
            global.space['red_mine'] = { count: 0, on: 0 };
        }
        if (!global.space['fabrication']){
            global.space['fabrication'] = { count: 0, on: 0 };
        }
        if (!global.space['laboratory']){
            global.space['laboratory'] = { count: 0, on: 0 };
        }
    }
    
    if (global.tech['space'] && global.tech['space'] >= 3){
        if (!global.space['iridium_mine']){
            global.space['iridium_mine'] = { count: 0, on: 0 };
        }
        if (!global.space['helium_mine']){
            global.space['helium_mine'] = { count: 0, on: 0 };
        }
    }

    if (global.tech['hell']){
        if (!global.space['geothermal']){
            global.space['geothermal'] = { count: 0, on: 0 };
        }
    }
}

if (convertVersion(global['version']) < 2065 && global.race !== undefined && global.race.species === 'sporgar'){
    delete global.race['crafty'];
    delete global.race['hydrophilic'];
    global.race['infectious'] = 1;
    global.race['parasite'] = 1;
    if (!global.tech['military'] && global.tech['primitive'] && global.tech['primitive'] >= 3){
        global.civic['garrison'].display = true;
        global.settings.showCivic = true;
        global.city['garrison'] = { count: 0 };
    }
}

if (convertVersion(global['version']) === 2062 && global.civic.taxes !== undefined){
    if (global.civic.taxes.tax_rate == 2){
        global.civic.taxes.tax_rate = 20;
    }
}

if (convertVersion(global['version']) < 2062 && global.civic.taxes !== undefined){
    switch(Number(global.civic.taxes.tax_rate)){
        case 0:
            global.civic.taxes.tax_rate = 0;
            break;
        case 1:
            global.civic.taxes.tax_rate = 10;
            break;
        case 2:
            global.civic.taxes.tax_rate = 20;
            break;
        case 3:
            global.civic.taxes.tax_rate = 30;
            break;
        case 4:
            global.civic.taxes.tax_rate = 40;
            break;
        case 5:
            global.civic.taxes.tax_rate = 50;
            break;
    }
}
if (convertVersion(global['version']) < 2060){
    Object.keys(global.resource).forEach(function (res){
        if (global.resource[res].crates){
            global.resource[res].crates = Math.ceil(global.resource[res].crates / 5);
        }
        if (global.resource[res].containers){
            global.resource[res].containers = Math.ceil(global.resource[res].containers / 5);
        }
    });
}

global['version'] = '0.4.24';

if (global.civic['cement_worker'] && global.civic.cement_worker.impact === 0.25){
    global.civic.cement_worker.impact = 0.4;
}

$('#topBar .version > a').html('v'+global.version);

if (!global['settings']){
    global['settings'] = {
        civTabs: 0,
        showEvolve: true,
        showCity: false,
        showIndustry: false,
        showResearch: false,
        showCivic: false,
        showMarket: false,
        showGenetics: false,
        showSpace: false,
        showAchieve: false,
        animated: true,
        disableReset: false,
        theme: 'dark',
        locale: 'en-us',
    }
}

if (!global.settings['space']){
    global.settings['space'] = {
        home: true,
        moon: false,
        red: false,
        hell: false,
        sun: false,
        gas: false,
        gas_moon: false,
        belt: false,
        dwarf: false,
        blackhole: false
    }
}

if (!global['space']){
    global['space'] = {};
}

if (!global['starDock']){
    global['starDock'] = {};
}

if (!global.settings['showAchieve']){
    global.settings['showAchieve'] = false;
}
if (!global.settings['resTabs']){
    global.settings['resTabs'] = 0;
}
if (!global.settings['locale']){
    global.settings['locale'] = 'en-us';
}
if (typeof global.settings.mKeys === 'undefined'){
    global.settings['mKeys'] = true;
}

if (!global.stats['reset']){
    global.stats['reset'] = 0;
}
if (!global.stats['plasmid']){
    global.stats['plasmid'] = 0;
}
if (!global.stats['phage']){
    global.stats['phage'] = 0;
}
if (!global.stats['starved']){
    global.stats['starved'] = 0;
}
if (!global.stats['tstarved']){
    global.stats['tstarved'] = 0;
}
if (!global.stats['died']){
    global.stats['died'] = 0;
}
if (!global.stats['tdied']){
    global.stats['tdied'] = 0;
}
if (!global.stats['know']){
    global.stats['know'] = 0;
}
if (!global.stats['tknow']){
    global.stats['tknow'] = 0;
}
if (!global.stats['portals']){
    global.stats['portals'] = global.stats['achieve'] && global.stats.achieve['doomed'] ? 1 : 0;
}

if (!global['lastMsg']){
    global['lastMsg'] = false;
}

if (!global.race['seeded']){
    global.race['seeded'] = false;
}
if (!global.race['Plasmid']){
    global.race['Plasmid'] = { count: 0 };
}
if (!global.race['Phage']){
    global.race['Phage'] = { count: 0 };
}
if (!global.race['deterioration']){
    global.race['deterioration'] = 0;
}
if (!global.race['gene_fortify']){
    global.race['gene_fortify'] = 0;
}

if (!global.race['old_gods']){
    global.race['old_gods'] = 'none';
}

if (!global.race['evil'] && global.race['immoral']){
    delete global.race['immoral'];
}

$('html').addClass(global.settings.theme);

if (!global.city['morale']){
    global.city['morale'] = {
        current: 0,
        unemployed: 0,
        stress: 0,
        entertain: 0,
        leadership: 0,
        season: 0,
        weather: 0,
        warmonger: 0,
    };
}

if (!global.city.morale['unemployed']){
    global.city.morale['unemployed'] = 0;
}

if (!global.city.morale['leadership']){
    global.city.morale['leadership'] = 0;
}

if (!global.city.morale['warmonger']){
    global.city.morale['warmonger'] = 0;
}

if (!global.city.morale['tax']){
    global.city.morale['tax'] = 0;
}

if (!global.city['calendar']){
    global.city['calendar'] = {
        day: 0,
        year: 0,
        season: 0,
        weather: 2,
        temp: 1,
        moon: 0,
        wind: 0,
        orbit: 365
    };
}

if (!global.city.calendar['season']){
    global.city.calendar['season'] = 0;
}

if (!global.city.calendar['moon']){
    global.city.calendar['moon'] = 0;
}

if (!global.city.calendar['wind']){
    global.city.calendar['wind'] = 0;
}

if (!global.city['powered']){
    global.city['powered'] = false;
    global.city['power'] = 0;
}

if (!global.city['biome']){
    global.city['biome'] = 'grassland';
}

if (!global.city['geology']){
    global.city['geology'] = {};
}

if (!global.city['market']){
    global.city['market'] = {
        qty: 10,
        mtrade: 0,
        trade: 0,
        active: false
    };
}

if (global.city['foundry'] && !global.city.foundry['Mythril']){
    global.city.foundry['Mythril'] = 0;
}

if (!global.settings['arpa']){
    global.settings['arpa'] = {
        arpaTabs: 0,
        physics: true,
        genetics: false
    };
}

if (!global.settings.arpa['crispr']){
    global.settings.arpa['crispr'] = false;
}

if (!global['arpa']){
    global['arpa'] = {};
}

if (global.city['factory']){
    if (!global.city.factory['Lux']){
        global.city.factory['Lux'] = 0;
    }
    if (!global.city.factory['Alloy']){
        global.city.factory['Alloy'] = 0;
    }
    if (!global.city.factory['Polymer']){
        global.city.factory['Polymer'] = 0;
    }
}

if (!global.race['mutation']){
    global.race['mutation'] = 0;
}

if (global.race['old_gods'] && global.race['old_gods'] != 'none'){
    global.genes['old_gods'] = 1;
}
else {
    delete global.genes['old_gods'];
}

global.settings.animated = true;
global.settings.disableReset = false;

if (global.lastMsg){
    messageQueue(global.lastMsg.m, global.lastMsg.c);
}

if (global['arpa'] && global.arpa['launch_facility'] && global.arpa.launch_facility.rank > 0 && !global.tech['space']){
    global.tech['space'] = 1;
}

function newGameData(){
    global['race'] = { species : 'protoplasm', gods: 'none', old_gods: 'none', seeded: false };
    Math.seed = Math.rand(0,10000);
    global.seed = Math.seed;
    global['new'] = true;
}

export function messageQueue(msg,color){
    color = color || 'warning';
    var new_message = $('<p class="has-text-'+color+'">'+msg+'</p>');
    $('#msgQueue').prepend(new_message);
    global.lastMsg = { m: msg, c: color };
    if ($('#msgQueue').children().length > 30){
        $('#msgQueue').children().last().remove();
    }
}

export function modRes(res,val){
    let count = global.resource[res].amount + val;
    let success = true;
    if (count > global.resource[res].max && global.resource[res].max != -1){
        count = global.resource[res].max;
    }
    else if (count < 0){
        count = 0;
        success = false;
    }
    if (!Number.isNaN(count)){
        global.resource[res].amount = count;
        global.resource[res].delta += val;
    }
    return success;
}

export var shiftIsPressed = false;
export var cntrlIsPressed = false;
export var altIsPressed = false;
$(document).keydown(function(e){
    cntrlIsPressed = e.ctrlKey ? true : false;
    shiftIsPressed = e.shiftKey ? true : false;
    altIsPressed = e.altKey ? true : false;
});
$(document).keyup(function(e){
    cntrlIsPressed = e.ctrlKey ? true : false;
    shiftIsPressed = e.shiftKey ? true : false;
    altIsPressed = e.altKey ? true : false;
});

window.onmousemove = function(e){
    cntrlIsPressed = e.ctrlKey ? true : false;
    shiftIsPressed = e.shiftKey ? true : false;
    altIsPressed = e.altKey ? true : false;
}

export var keyMultiplierNumber = 1;
export function keyMultiplier(){
    let number = 1;
    if (global.settings['mKeys']){
        if (cntrlIsPressed){
            number *= 10;
        }
        if (shiftIsPressed){
            number *= 25;
        }
        if (altIsPressed){
            number *= 100;
        }
    }
    keyMultiplierNumber = number;
    $('.craft').each(function(e){
        if (typeof $(this).data('val') === 'number'){
            $(this).html(sizeApproximation($(this).data('val') * number,1));
        }
    });
    return number;
}

function convertVersion(version){
    let vNum = version.split('.',3);
    vNum[0] *= 100000;
    vNum[1] *= 1000;
    return Number(vNum[0]) + Number(vNum[1]) + Number(vNum[2]);
}

function resizeGame(){
    if ($(window).width() >= 1400 && $('#msgQueue:not(.right)')){
        let queue = $('#msgQueue').detach();
        queue.addClass('right');
        queue.removeClass('has-text-info');
        $('#queueColumn').addClass('is-one-quarter');
        $('#queueColumn').append(queue);
        $('#mainColumn').removeClass('is-three-quarters');
        $('#mainColumn').addClass('is-half');
    }
    else if ($(window).width() < 1400 && $('#msgQueue').hasClass('right')){
        let queue = $('#msgQueue').detach();
        queue.removeClass('right');
        queue.addClass('has-text-info');
        $('#queueColumn').removeClass('is-one-quarter');
        $('#sideQueue').append(queue);
        $('#mainColumn').removeClass('is-half');
        $('#mainColumn').addClass('is-three-quarters');
    }
}

export function sizeApproximation(value,precision,fixed){
    if (value <= 9999){
        return +value.toFixed(precision);
    }
    else if (value <= 1000000){
        return fixed ? +(value / 1000).toFixed(1) + 'K' : (Math.floor(value / 100) / 10) + 'K';
    }
    else if (value <= 1000000000){
        return fixed ? +(value / 1000000).toFixed(1) + 'M' : (Math.floor(value / 10000) / 100) + 'M';
    }
    else if (value <= 1000000000000){
        return fixed ? +(value / 1000000000).toFixed(1) + 'G' : (Math.floor(value / 10000000) / 100) + 'G';
    }
    else if (value <= 1000000000000000){
        return fixed ? +(value / 1000000000000).toFixed(1) + 'T' : (Math.floor(value / 10000000000) / 100) + 'T';
    }
    else if (value <= 1000000000000000000){
        return fixed ? +(value / 1000000000000000).toFixed(1) + 'P' : (Math.floor(value / 10000000000000) / 100) + 'P';
    }
    else if (value <= 1000000000000000000000){
        return fixed ? +(value / 1000000000000000000).toFixed(1) + 'E' : (Math.floor(value / 10000000000000000) / 100) + 'E';
    }
    else if (value <= 1000000000000000000000000){
        return fixed ? +(value / 1000000000000000000000).toFixed(1) + 'Z' : (Math.floor(value / 10000000000000000000) / 100) + 'Z';
    }
    else {
        return fixed ? +(value / 1000000000000000000000000).toFixed(1) + 'Y' : (Math.floor(value / 10000000000000000000000) / 100) + 'Y';
    }
}

$(window).resize(function(){
    resizeGame();
});

resizeGame();

window.exportGame = function exportGame(){
    $('#importExport').val(LZString.compressToBase64(JSON.stringify(global)));
    $('#importExport').select();
    document.execCommand('copy');
}

window.importGame = function importGame(){
    if ($('#importExport').val().length > 0){
        let saveState = JSON.parse(LZString.decompressFromBase64($('#importExport').val()));
        if (saveState && 'evolution' in saveState && 'settings' in saveState && 'stats' in saveState && 'plasmid' in saveState.stats){
            global = saveState;
            save.setItem('evolved',LZString.compressToUTF16(JSON.stringify(global)));
            window.location.reload();
        }
    }
}

// executes a hard reset
window.reset = function reset(){
    localStorage.removeItem('evolved');
    global = null;
    window.location.reload();
}

// executes a soft reset
window.soft_reset = function reset(){
    Object.keys(vues).forEach(function (v){
        vues[v].$destroy();
    });

    global.space = {};
    let replace = {
        species : 'protoplasm', 
        Plasmid: { count: global.race.Plasmid.count },
        Phage: { count: global.race.Phage.count },
        seeded: global.race.seeded,
        probes: global.race.probes,
        seed: global.race.seed,
    }
    if (global.race['gods']){
        replace['gods'] = global.race.gods;
    }
    if (global.race['old_gods']){
        replace['old_gods'] = global.race.old_gods;
    }
    if (global.race['rapid_mutation'] && global.race['rapid_mutation'] > 0){
        replace['rapid_mutation'] = global.race['rapid_mutation'];
    }
    if (global.race['ancient_ruins'] && global.race['rapid_mutation'] > 0){
        replace['ancient_ruins'] = global.race['ancient_ruins'];
    }
    global['race'] = replace;

    let orbit = global.city.calendar.orbit;
    let biome = global.city.biome;
    global.city = {
        calendar: {
            day: 0,
            year: 0,
            weather: 2,
            temp: 1,
            moon: 0,
            wind: 0,
            orbit: orbit
        },
        biome: biome
    };

    global.stats.days = 0;
    global.stats.know = 0;
    global.stats.starved = 0;
    global.stats.died = 0;

    global.space = {};
    global.civic = { free: 0 };
    global.resource = {};
    global.evolution = {};

    if (global.tech['theology'] && global.tech['theology'] >= 1){
        global.tech = { theology: 1 };
    }
    else {
        global.tech = {};
    }

    global.event = 100;
    global.settings.civTabs = 0;
    global.settings.showEvolve = true;
    global.settings.showCity = false;
    global.settings.showIndustry = false;
    global.settings.showResearch = false;
    global.settings.showCivic = false;
    global.settings.showMarket = false;
    global.settings.showGenetics = false;
    global.settings.showSpace = false;
    global.settings.space.home = true;
    global.settings.space.moon = false;
    global.settings.space.red = false;
    global.settings.space.hell = false;
    global.settings.space.sun = false;
    global.settings.space.gas = false;
    global.settings.space.gas_moon = false;
    global.settings.space.belt = false;
    global.settings.space.dwarf = false;
    global.settings.space.blackhole = false;
    global.settings.arpa = false;
    global.settings.resTabs = 0;
    global.settings.disableReset = false;
    global.arpa = {};
    global.lastMsg = false;
    global.new = true;
    Math.seed = Math.rand(0,10000);

    save.setItem('evolved',LZString.compressToUTF16(JSON.stringify(global)));
    window.location.reload();
}
