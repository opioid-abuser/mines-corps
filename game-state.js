// Ressources
const resources = {
    crystal: new Decimal(10),
    metal: new Decimal(10),
    deuterium: new Decimal(0),
    energy: new Decimal(0),
    titanite: new Decimal(0)
};

// Compteurs de mines
const minesCount = {
    crystal: 0,
    metal: 0,
    deuterium: 0,
    titanite: 0
};

// Déblocages
let deuteriumUnlocked = false;
let deuteriumStorageLevel = 1;
let powerPlantLevel = 0;
let titaniteUnlocked = false;

// Coûts de base
const BASE_COST_CRYSTAL = 10;
const BASE_COST_METAL = 10;
const BASE_COST_DEUTERIUM = { crystal: 100, metal: 50 };
const BASE_COST_TITANITE = { crystal: 5000, metal: 2500, deuterium: 1000 };
const COST_GROWTH = 1.15;
const COST_GROWTH_DEUTERIUM = 1.65
const COST_GROWTH_TITANITE = 1.66
const DEUTERIUM_PER_MINE = 0.1;
const TITANITE_PER_MINE = 0.05;

// Productions calculées
let crystalProduction = new Decimal(0);
let metalProduction = new Decimal(0);
let deuteriumProduction = new Decimal(0);
let deuteriumConsumption = new Decimal(0);
let energyProduction = new Decimal(0);
let titaniteProduction = new Decimal(0);

// --- Fonctions globales ---
function totalMinesOfType(type) {
    return minesCount[type];
}

function getAllMinesCount() {
    return Object.values(minesCount).reduce((a, b) => a + b, 0);
}

// --- Coûts des mines ---
function getCostCrystalMine() {
    const count = minesCount.crystal;
    const reduction = getUpgradeEffect('costReduction');
    return Decimal.max(1, new Decimal(BASE_COST_CRYSTAL).times(Decimal.pow(COST_GROWTH, count)).times(1 - reduction));
}

function getCostMetalMine() {
    const count = minesCount.metal;
    const reduction = getUpgradeEffect('costReduction');
    return Decimal.max(1, new Decimal(BASE_COST_METAL).times(Decimal.pow(COST_GROWTH, count)).times(1 - reduction));
}

function getCostDeuteriumMine() {
    const count = minesCount.deuterium;
    const reduction = 0;//getUpgradeEffect('costReduction');
    return {
        crystal: Decimal.max(1, new Decimal(BASE_COST_DEUTERIUM.crystal).times(Decimal.pow(COST_GROWTH_DEUTERIUM, count)).times(1 - reduction)),
        metal: Decimal.max(1, new Decimal(BASE_COST_DEUTERIUM.metal).times(Decimal.pow(COST_GROWTH_DEUTERIUM, count)).times(1 - reduction))
    };
}

function getCostTitaniteMine() {
    const count = minesCount.titanite;
    const reduction = getUpgradeEffect('costReduction');
    return {
        crystal: Decimal.max(1, new Decimal(BASE_COST_TITANITE.crystal).times(Decimal.pow(COST_GROWTH_TITANITE, count)).times(1 - reduction)),
        metal: Decimal.max(1, new Decimal(BASE_COST_TITANITE.metal).times(Decimal.pow(COST_GROWTH_TITANITE, count)).times(1 - reduction)),
        deuterium: Decimal.max(1, new Decimal(BASE_COST_TITANITE.deuterium).times(Decimal.pow(COST_GROWTH, count)).times(1 - reduction))
    };
}

// --- Vérifications de déblocage ---
function checkDeuteriumUnlock() {
    if (!deuteriumUnlocked && minesCount.crystal >= 20 && minesCount.metal >= 20) {
        deuteriumUnlocked = true;
    }
}

function checkTitaniteUnlock() {
    if (!titaniteUnlocked && powerPlantLevel >= 10) {
        titaniteUnlocked = true;
    }
}

// --- Automatisations ---
AUTOMATION_COST_ENERGY = new Decimal(1900);
AUTOMATION_COST_TITANITE = new Decimal(2900000);
const automations = [
    {
        id: 'autoCrystal',
        name: 'Mine de cristal',
        desc: 'Achète automatiquement des mines de cristal.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'mine',
        target: 'crystal',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    },
    {
        id: 'autoMetal',
        name: 'Mine de métal',
        desc: 'Achète automatiquement des mines de métal.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'mine',
        target: 'metal',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    },
/*    {
        id: 'autoDeuterium',
        name: 'Mine de deutérium',
        desc: 'Achète automatiquement des mines de deutérium.',
        costEnergy: 100,
        costTitanite: 10,
        type: 'mine',
        target: 'deuterium',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: 'deuteriumUnlocked'
    },*/
    {
        id: 'autoTitanite',
        name: 'Mine de titanite',
        desc: 'Achète automatiquement des mines de titanite.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'mine',
        target: 'titanite',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: 'titaniteUnlocked'
    },
    {
        id: 'autoProdBoost',
        name: 'Productivité',
        desc: 'Améliore automatiquement Productivité.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'upgrade',
        upgradeId: 'prodBoost',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    },
    {
        id: 'autoCostReduction',
        name: 'Forage efficace',
        desc: 'Améliore automatiquement Forage efficace.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'upgrade',
        upgradeId: 'costReduction',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    },
    {
        id: 'autoSynergy',
        name: 'Synergie minière',
        desc: 'Améliore automatiquement Synergie minière.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'upgrade',
        upgradeId: 'synergy',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    },
    {
        id: 'autoPassiveCrystal',
        name: 'Prospection cristal',
        desc: 'Améliore automatiquement Prospection cristal.',
        costEnergy: AUTOMATION_COST_ENERGY,
        costTitanite: AUTOMATION_COST_TITANITE,
        type: 'upgrade',
        upgradeId: 'passiveCrystal',
        unlocked: false,
        active: false,
        lastTick: 0,
        interval: 1000,
        requires: null
    }
];

function buyAutomation(id) {
    const auto = automations.find(a => a.id === id);
    if (!auto || auto.unlocked) return false;
    if (resources.energy.lt(auto.costEnergy) || resources.titanite.lt(auto.costTitanite)) return false;
    resources.energy = resources.energy.sub(auto.costEnergy);
    resources.titanite = resources.titanite.sub(auto.costTitanite);
    auto.unlocked = true;
    return true;
}

function toggleAutomation(id) {
    const auto = automations.find(a => a.id === id);
    if (!auto || !auto.unlocked) return false;
    auto.active = !auto.active;
    return true;
}

function processAutomations(timestamp) {
    for (const auto of automations) {
        if (!auto.unlocked || !auto.active) continue;
        // Vérifier les conditions de déblocage spécifiques (ex: deuteriumUnlocked)
        if (auto.requires === 'deuteriumUnlocked' && !deuteriumUnlocked) continue;
        if (auto.requires === 'titaniteUnlocked' && !titaniteUnlocked) continue;
        if (timestamp - auto.lastTick < automationInterval) continue;
        auto.lastTick = timestamp;

        if (auto.type === 'mine') {
            const target = auto.target;
            let success = false;
            switch (target) {
                case 'crystal':
                    if (resources.crystal.gte(getCostCrystalMine())) {
                        resources.crystal = resources.crystal.sub(getCostCrystalMine());
                        minesCount.crystal++;
                        success = true;
                    }
                    break;
                case 'metal':
                    if (resources.metal.gte(getCostMetalMine())) {
                        resources.metal = resources.metal.sub(getCostMetalMine());
                        minesCount.metal++;
                        success = true;
                    }
                    break;
                case 'deuterium':
                    const costD = getCostDeuteriumMine();
                    if (resources.crystal.gte(costD.crystal) && resources.metal.gte(costD.metal)) {
                        resources.crystal = resources.crystal.sub(costD.crystal);
                        resources.metal = resources.metal.sub(costD.metal);
                        minesCount.deuterium++;
                        success = true;
                    }
                    break;
                case 'titanite':
                    const costT = getCostTitaniteMine();
                    if (resources.crystal.gte(costT.crystal) && resources.metal.gte(costT.metal) && resources.deuterium.gte(costT.deuterium)) {
                        resources.crystal = resources.crystal.sub(costT.crystal);
                        resources.metal = resources.metal.sub(costT.metal);
                        resources.deuterium = resources.deuterium.sub(costT.deuterium);
                        minesCount.titanite++;
                        success = true;
                    }
                    break;
            }
            if (success) {
                recalcProduction();
                checkDeuteriumUnlock();
            }
        } else if (auto.type === 'upgrade') {
            const up = upgradesData.find(u => u.id === auto.upgradeId);
            if (up && up.level < up.maxLevel) {
                const costCrystal = new Decimal(up.baseCostCrystal).times(Decimal.pow(up.costMult, up.level));
                const costMetal = new Decimal(up.baseCostMetal).times(Decimal.pow(up.costMult, up.level));
                if (resources.crystal.gte(costCrystal) && resources.metal.gte(costMetal)) {
                    resources.crystal = resources.crystal.sub(costCrystal);
                    resources.metal = resources.metal.sub(costMetal);
                    up.level++;
                    recalcProduction();
                }
            }
        }
    }
}

// --- Réservoir deutérium ---
function getMaxDeuteriumLevel() {
    const base = (powerPlantLevel >= 10) ? 20 : 10;
    const bonus = getTitaniteUpgradeEffect('deutStorageBoost') || 0;
    return base + bonus;
}

function getMaxDeuterium() {
    const effectiveLevel = Math.min(deuteriumStorageLevel, getMaxDeuteriumLevel());
    let cap = Decimal.floor(Decimal.pow(1.5, effectiveLevel - 1).times(40));
    // bonus succès
    cap = cap.times(1 + achievementBonuses.deuteriumStorage);
    return cap;
}

function getStorageUpgradeCost() {
    const mult = Decimal.pow(1.8, deuteriumStorageLevel - 1);
    return {
        crystal: new Decimal(200).times(mult).floor(),
        metal: new Decimal(100).times(mult).floor()
    };
}

function upgradeDeuteriumStorage() {
    if (deuteriumStorageLevel >= getMaxDeuteriumLevel() || !deuteriumUnlocked) return false;
    const cost = getStorageUpgradeCost();
    if (resources.crystal.lt(cost.crystal) || resources.metal.lt(cost.metal)) return false;
    resources.crystal = resources.crystal.sub(cost.crystal);
    resources.metal = resources.metal.sub(cost.metal);
    deuteriumStorageLevel++;
    resources.deuterium = Decimal.min(resources.deuterium, getMaxDeuterium());
    return true;
}

// --- Centrale électrique ---
function getMaxPowerPlantLevel() {
    const base = 10;
    const bonus = getTitaniteUpgradeEffect('powerPlantMax') || 0;
    return base + bonus;
}

function getDeuteriumConsumption() {
    if (powerPlantLevel === 0) return new Decimal(0);
    return new Decimal(25).times(powerPlantLevel).pow(powerPlantLevel/8);
}

function getEnergyProduction() {
    if (powerPlantLevel === 0) return new Decimal(0);
    let prod = new Decimal(1).times(powerPlantLevel);
    const surcharge = getEnergyUpgradeEffect('overcharge') || 0;
    const titanProd = getTitaniteUpgradeEffect('energyProdBoost') || 0;
    prod = prod.times(1 + surcharge).times(1 + titanProd);
    // Bonus synergie titanite
    const titaniteAmpEffect = getTitaniteUpgradeEffect('titaniteAmp') || 0;
    prod = prod.sqr(1 + titaniteAmpEffect);
    return prod;
}

function getMaxEnergy() {
    if (powerPlantLevel === 0) return new Decimal(0);
    let cap = new Decimal(100).times(powerPlantLevel);
    const storageBonus = getEnergyUpgradeEffect('storage') || 0;
    const titanStorage = getTitaniteUpgradeEffect('energyStorageTitan') || 0;
    cap = cap.times(1 + storageBonus + titanStorage + achievementBonuses.energyStorage);
    return cap;
}

function getPowerPlantCost() {
    const mult = Decimal.pow(2, powerPlantLevel);
    return {
        crystal: new Decimal(500).times(mult).floor(),
        metal: new Decimal(250).times(mult).floor()
    };
}

function canBuyPowerPlant() {
    if (powerPlantLevel >= getMaxPowerPlantLevel()) return false;
    if (!deuteriumUnlocked || deuteriumStorageLevel < 10) return false;
    const cost = getPowerPlantCost();
    return resources.crystal.gte(cost.crystal) && resources.metal.gte(cost.metal);
}

function buyPowerPlant() {
    if (!canBuyPowerPlant()) return false;
    const cost = getPowerPlantCost();
    resources.crystal = resources.crystal.sub(cost.crystal);
    resources.metal = resources.metal.sub(cost.metal);
    powerPlantLevel++;
    recalcProduction();
    resources.energy = Decimal.min(resources.energy, getMaxEnergy());
    checkTitaniteUnlock();
    return true;
}

function downgradePowerPlant() {
    if (powerPlantLevel <= 0) return false;
    powerPlantLevel--;
    recalcProduction();
    resources.energy = Decimal.min(resources.energy, getMaxEnergy());
    return true;
}

// --- Production ---
function recalcProduction() {
    const prodBoost = getUpgradeEffect('prodBoost');
    const synergy = getUpgradeEffect('synergy');
    const passiveCrystal = getUpgradeEffect('passiveCrystal');
    const totalMines = getAllMinesCount();
    const synergyBonus = 1 + synergy * totalMines;
    const perMineBase = 1 + prodBoost;
    const perMetalMineBase = perMineBase * 1.5;

    crystalProduction = new Decimal(minesCount.crystal).add(passiveCrystal).times(perMineBase).times(synergyBonus);
    metalProduction = new Decimal(minesCount.metal).times(perMetalMineBase).times(synergyBonus);
    deuteriumProduction = new Decimal(minesCount.deuterium).times(DEUTERIUM_PER_MINE + prodBoost).times(synergyBonus);
    if (titaniteUnlocked) {
        titaniteProduction = new Decimal(minesCount.titanite).times(TITANITE_PER_MINE + prodBoost).times(synergyBonus);
        const amp = getTitaniteUpgradeEffect('titaniteAmp') || 0;
        titaniteProduction = titaniteProduction.times(1 + amp);
    } else {
        titaniteProduction = new Decimal(0);
    }
    // application des succès
    crystalProduction = crystalProduction.times(1 + achievementBonuses.crystalProd);
    metalProduction = metalProduction.times(1 + achievementBonuses.metalProd);
    deuteriumProduction = deuteriumProduction.times(1 + achievementBonuses.deuteriumProd);
    if (titaniteUnlocked) {
        titaniteProduction = titaniteProduction.times(1 + achievementBonuses.titaniteProd);
    }

    // Amplification énergétique
    const ampEnergy = getEnergyUpgradeEffect('amplification') || 1;
    crystalProduction = crystalProduction.times(ampEnergy);
    metalProduction = metalProduction.times(ampEnergy);

    // Consommation / production d'énergie
    if (powerPlantLevel > 0) {
        deuteriumConsumption = getDeuteriumConsumption();
        energyProduction = getEnergyProduction();
    } else {
        deuteriumConsumption = new Decimal(0);
        energyProduction = new Decimal(0);
    }
}

// --- Fonctions d'accès aux effets d'upgrades ---
function getUpgradeEffect(id) {
    const up = upgradesData.find(u => u.id === id);
    if (up) return up.getEffect(up.level);
    return 0;
}

function getEnergyUpgradeEffect(id) {
    const up = energyUpgradesData.find(u => u.id === id);
    if (up) return up.getEffect();
    return 0;
}

function getTitaniteUpgradeEffect(id) {
    const up = titaniteUpgradesData.find(u => u.id === id);
    if (up) return up.getEffect();
    return 0;
}

// --- Formatage des nombres ---
function formatNumber(dec, precision = 2) {
    if (dec == null) return "0";
    if (!(dec instanceof Decimal)) {
        try { dec = new Decimal(dec); } catch (e) { return "0"; }
    }
    if (!dec) return "0";
    //if (!dec.isFinite() || dec.isNaN()) return "0";
    if (dec.lt(1000)) return dec.toFixed(0);
    const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const log10 = dec.log10();
    let tier = Math.floor(log10 / 3);
    if (tier <= 0) tier = 0;
    if (tier >= suffixes.length) return dec.toExponential(precision);
    const scale = Decimal.pow(10, tier * 3);
    const scaled = dec.div(scale);
    const intPartLength = Math.floor(scaled.log10()) + 1;
    const finalPrecision = Math.max(0, precision - (intPartLength > 1 ? 0 : 1));
    return scaled.toFixed(finalPrecision) + suffixes[tier];
}

// --- Sauvegarde ---
function getSaveData() {
    return {
        resources: {
            crystal: resources.crystal.toString(),
            metal: resources.metal.toString(),
            deuterium: resources.deuterium.toString(),
            energy: resources.energy.toString(),
            titanite: resources.titanite.toString()
        },
        minesCount: { ...minesCount },
        deuteriumUnlocked,
        deuteriumStorageLevel,
        powerPlantLevel,
        titaniteUnlocked,
        upgrades: upgradesData.map(up => ({ id: up.id, level: up.level, deuteriumBoostLevel: up.deuteriumBoostLevel })),
        energyUpgrades: energyUpgradesData.map(eu => ({ id: eu.id, level: eu.level })),
        titaniteUpgrades: titaniteUpgradesData.map(tu => ({ id: tu.id, level: tu.level })),
        automations: automations.map(a => ({ id: a.id, unlocked: a.unlocked, active: a.active })),
        achievements: getAchievementsSaveData(),
        timestamp: Date.now()
    };
}

function loadSaveData(data) {
    if (!data) return false;
    try {
        resources.crystal = new Decimal(data.resources.crystal);
        resources.metal = new Decimal(data.resources.metal);
        resources.deuterium = new Decimal(data.resources.deuterium || 0);
        resources.energy = new Decimal(data.resources.energy || 0);
        resources.titanite = new Decimal(data.resources.titanite || 0);
        Object.assign(minesCount, data.minesCount || { crystal: 0, metal: 0, deuterium: 0, titanite: 0 });
        deuteriumUnlocked = data.deuteriumUnlocked || false;
        deuteriumStorageLevel = data.deuteriumStorageLevel || 1;
        powerPlantLevel = data.powerPlantLevel || 0;
        titaniteUnlocked = data.titaniteUnlocked || false;

        if (Array.isArray(data.upgrades)) {
            data.upgrades.forEach(saved => {
                const up = upgradesData.find(u => u.id === saved.id);
                if (up) {
                    up.level = saved.level || 0;
                    up.deuteriumBoostLevel = saved.deuteriumBoostLevel || 0;
                }
            });
        }
        if (Array.isArray(data.energyUpgrades)) {
            data.energyUpgrades.forEach(saved => {
                const eu = energyUpgradesData.find(u => u.id === saved.id);
                if (eu) eu.level = saved.level || 0;
            });
        }
        if (Array.isArray(data.titaniteUpgrades)) {
            data.titaniteUpgrades.forEach(saved => {
                const tu = titaniteUpgradesData.find(u => u.id === saved.id);
                if (tu) tu.level = saved.level || 0;
            });
        }
        recalcProduction();
        resources.energy = Decimal.min(resources.energy, getMaxEnergy());
        resources.deuterium = Decimal.min(resources.deuterium, getMaxDeuterium());
        if (Array.isArray(data.automations)) {
            data.automations.forEach(saved => {
                const a = automations.find(auto => auto.id === saved.id);
                if (a) { a.unlocked = saved.unlocked || false; a.active = saved.active || false; }
            });
        }
        if (data.achievements) loadAchievementsData(data.achievements);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('minesHexSave', JSON.stringify(getSaveData()));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('minesHexSave');
    if (!saved) return false;
    return loadSaveData(JSON.parse(saved));
}

function resetGame() {
    resources.crystal = new Decimal(10);
    resources.metal = new Decimal(10);
    resources.deuterium = new Decimal(0);
    resources.energy = new Decimal(0);
    resources.titanite = new Decimal(0);
    minesCount.crystal = 0;
    minesCount.metal = 0;
    minesCount.deuterium = 0;
    minesCount.titanite = 0;
    deuteriumUnlocked = false;
    deuteriumStorageLevel = 1;
    powerPlantLevel = 0;
    titaniteUnlocked = false;
    upgradesData.forEach(up => { up.level = 0; up.deuteriumBoostLevel = 0; });
    energyUpgradesData.forEach(eu => eu.level = 0);
    titaniteUpgradesData.forEach(tu => tu.level = 0);
    localStorage.removeItem('minesHexSave');
    automations.forEach(a => { a.unlocked = false; a.active = false; a.lastTick = 0; });
    resetAchievements();
    recalcProduction();
}