// Améliorations classiques (coût en cristal et/ou métal)
const upgradesData = [
    {
        id: 'prodBoost',
        name: 'Productivity',
        baseDescription: 'Increases the production of each mine.',
        baseCostCrystal: 50,
        baseCostMetal: 25,
        costMult: 1.6,
        level: 0,
        maxLevelBase: 20,
        deuteriumBoostLevel: 0,
        deuteriumBoostCost: 10,
        getEffect(lvl) {
            const bonus = 1 + this.deuteriumBoostLevel * 0.1;
            return 0.5 * lvl * bonus;
        },
        get maxLevel() { return this.maxLevelBase + this.deuteriumBoostLevel * 3; },
        getDescription() {
            const bonus = 1 + this.deuteriumBoostLevel * 0.1;
            const perMine = (0.5 * bonus).toFixed(1);
            const current = this.getEffect(this.level).toFixed(1);
            return `+${perMine}/mine/lvl. Current bonus : +${current}/sec per mine.`;
        }
    },
    {
        id: 'costReduction',
        name: 'High-efficiency drilling',
        baseDescription: 'Reduces mining prices.',
        baseCostCrystal: 100,
        baseCostMetal: 0,
        costMult: 2.5,
        level: 0,
        maxLevelBase: 3,
        deuteriumBoostLevel: 0,
        deuteriumBoostCost: 15,
        getEffect(lvl) {
            const base = Math.min(lvl * 0.05, 0.75);
            const bonus = 1 + this.deuteriumBoostLevel * 0.05;
            return Math.min(base * bonus, 0.95);
        },
        get maxLevel() { return Math.floor(this.maxLevelBase + this.deuteriumBoostLevel / 4); },
        getDescription() {
            const reduction = (this.getEffect(this.level) * 100).toFixed(0);
            return `Reduce mines prices by ${reduction}%.`;
        }
    },
    {
        id: 'passiveCrystal',
        name: 'Crystal prospecting',
        baseDescription: 'Passive crystal production.',
        baseCostCrystal: 0,
        baseCostMetal: 75,
        costMult: 1.5,
        level: 0,
        maxLevelBase: 20,
        deuteriumBoostLevel: 0,
        deuteriumBoostCost: 10,
        getEffect(lvl) {
            const bonus = 1 + this.deuteriumBoostLevel ;
            return 1 * lvl * bonus;
        },
        get maxLevel() { return this.maxLevelBase + this.deuteriumBoostLevel * 3; },
        getDescription() {
            const current = this.getEffect(this.level).toFixed(1);
            return `+${current} crystal/sec.`;
        }
    },
    {
        id: 'synergy',
        name: 'Mining Synergy',
        baseDescription: 'Production bonus based on the total number of mines.',
        baseCostCrystal: 20000,
        baseCostMetal: 10000,
        costMult: 2.2,
        level: 0,
        maxLevelBase: 4,
        deuteriumBoostLevel: 0,
        deuteriumBoostCost: 6100,
        getEffect(lvl) {
            const base = 0.01 * lvl;
            const bonus = 1 + this.deuteriumBoostLevel * 0.1;
            return base * bonus;
        },
        get maxLevel() {
            return this.maxLevelBase + this.deuteriumBoostLevel;
        },
        getDescription() {
            const perMine = (this.getEffect(this.level) * 100).toFixed(1);
            const total = getAllMinesCount();
            const totalBonus = (this.getEffect(this.level) * total * 100).toFixed(1);
            return `+${perMine}% per mine. Total Bonus : +${totalBonus}% production.`;
        }
    }
];

// Améliorations énergétiques (coût en énergie)
const energyUpgradesData = [
    {
        id: 'amplification',
        name: 'Amplification',
        baseDescription: 'Crystal/iron production +10% per level.',
        baseCost: 20,
        costMult: 2.5,
        level: 0,
        maxLevel: 15,
        getEffect() { return 1 + this.level * 0.1; },
        getDescription() {
            return `Multiply crystal and iron production by ${this.getEffect().toFixed(1)}.`;
        },
        buy() {
            if (this.level >= this.maxLevel || powerPlantLevel === 0) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.energy.lt(cost)) return false;
            resources.energy = resources.energy.sub(cost);
            this.level++;
            recalcProduction();
            return true;
        }
    },
    {
        id: 'deuteriumOptimization',
        name: 'Deuterium optimization',
        baseDescription: 'Reduces the price of deuterium boosts by 10% per level.',
        baseCost: 45,
        costMult: 2.5,
        level: 0,
        maxLevel: 10,
        getEffect() { return Math.min(this.level * 0.05, 0.99); },
        getDescription() {
            return `Reduces the deuterium price of boosts ${(this.getEffect() * 100).toFixed(0)}%.`;
        },
        buy() {
            if (this.level >= this.maxLevel || powerPlantLevel === 0) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.energy.lt(cost)) return false;
            resources.energy = resources.energy.sub(cost);
            this.level++;
            return true;
        }
    },
    {
        id: 'overcharge',
        name: 'Overcharge',
        baseDescription: 'Energy production +20% per level.',
        baseCost: 15,
        costMult: 2.0,
        level: 0,
        maxLevel: 20,
        getEffect() {
            return this.level * 0.2;
        },
        getDescription() {
            return `+${(this.getEffect() * 100).toFixed(0)}% energy production.`;
        },
        buy() {
            if (this.level >= this.maxLevel || powerPlantLevel === 0) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.energy.lt(cost)) return false;
            resources.energy = resources.energy.sub(cost);
            this.level++;
            recalcProduction();
            return true;
        }
    },
    {
        id: 'storage',
        name: 'Energy storage',
        baseDescription: 'Energy capacity +50% per level.',
        baseCost: 10,
        costMult: 1.8,
        level: 0,
        maxLevel: 10,
        getEffect() { return this.level * 0.5; },
        getDescription() {
            return `+${(this.getEffect() * 100).toFixed(0)}% energy capacity.`;
        },
        buy() {
            if (this.level >= this.maxLevel || powerPlantLevel === 0) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.energy.lt(cost)) return false;
            resources.energy = resources.energy.sub(cost);
            this.level++;
            resources.energy = Decimal.min(resources.energy, getMaxEnergy());
            return true;
        }
    }
];

// Améliorations titanite (coût en titanite)
const titaniteUpgradesData = [
    {
        id: 'energyProdBoost',
        name: 'Titanite overcharge',
        baseDescription: 'Energy production up 30% per level.',
        baseCost: 100000,
        costMult: 2.0,
        level: 0,
        maxLevel: 15,
        getEffect() { return this.level * 0.3; },
        getDescription() {
            return `+${(this.getEffect() * 100).toFixed(0)}% energy production.`;
        },
        buy() {
            if (this.level >= this.maxLevel || !titaniteUnlocked) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.titanite.lt(cost)) return false;
            resources.titanite = resources.titanite.sub(cost);
            this.level++;
            recalcProduction();
            return true;
        }
    },
    {
        id: 'energyStorageTitan',
        name: 'Titanite capacitor',
        baseDescription: 'Energy capacity +50% per level.',
        baseCost: 150000,
        costMult: 2.2,
        level: 0,
        maxLevel: 10,
        getEffect() { return this.level * 0.5; },
        getDescription() {
            return `+${(this.getEffect() * 100).toFixed(0)}% energy capacity.`;
        },
        buy() {
            if (this.level >= this.maxLevel || !titaniteUnlocked) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.titanite.lt(cost)) return false;
            resources.titanite = resources.titanite.sub(cost);
            this.level++;
            resources.energy = Decimal.min(resources.energy, getMaxEnergy());
            return true;
        }
    },
    {
        id: 'deutStorageBoost',
        name: 'Hardened tank',
        baseDescription: 'Max level Deuterium tank : +2 per level.',
        baseCost: 200000,
        costMult: 2.5,
        level: 0,
        maxLevel: 5,
        getEffect() { return this.level * 2; },
        getDescription() {
            return `+${this.getEffect()} max Deuterium tank level.`;
        },
        buy() {
            if (this.level >= this.maxLevel || !titaniteUnlocked) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.titanite.lt(cost)) return false;
            resources.titanite = resources.titanite.sub(cost);
            this.level++;
            return true;
        }
    },
    {
        id: 'powerPlantMax',
        name: 'Power plant extension',
        baseDescription: 'Max level Power plant: +2 per level.',
        baseCost: 300000,
        costMult: 3.0,
        level: 0,
        maxLevel: 5,
        getEffect() { return this.level * 2; },
        getDescription() {
            return `+${this.getEffect()} max Power plant level.`;
        },
        buy() {
            if (this.level >= this.maxLevel || !titaniteUnlocked) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.titanite.lt(cost)) return false;
            resources.titanite = resources.titanite.sub(cost);
            this.level++;
            return true;
        }
    },
/*    {
        id: 'titaniteAmp',
        name: 'Synergie titanite',
        baseDescription: 'Production énergie +5% par titanite stockée (par niveau).',
        baseCost: 25,
        costMult: 2.0,
        level: 0,
        maxLevel: 1,
        getEffect() {
            const stock = resources.titanite.toNumber();
            return Math.max(this.level * (stock * 0.0001),100);
        },
        getDescription() {
            const bonus = this.getEffect();
            return `Bonus actuel : ${(bonus*100).toFixed(1)}% (stock: ${formatNumber(resources.titanite*0.01)})`;
        },
        buy() {
            if (this.level >= this.maxLevel || !titaniteUnlocked) return false;
            const cost = new Decimal(this.baseCost).times(Decimal.pow(this.costMult, this.level)).floor();
            if (resources.titanite.lt(cost)) return false;
            resources.titanite = resources.titanite.sub(cost);
            this.level++;
            recalcProduction();
            return true;
        }
    }*/
];

const naniteBuildingsData = [
    {
        id: 'converter',
        name: 'Crystallic Converter',
        desc: '50% of crystal production is added to metal production',
        requiredPlantLevel: 1,
        cost: {crystal: 1e10, metal: 1e8, deuterium: 1e7, titanite: 5e10},
        isBought() {
            return naniteBuilding1;
        },
        buy() {
            if (this.isBought()) return false;
            const c = this.cost;
            if (resources.crystal.lt(c.crystal) || resources.metal.lt(c.metal) ||
                resources.deuterium.lt(c.deuterium) || resources.titanite.lt(c.titanite)) return false;
            resources.crystal = resources.crystal.sub(c.crystal);
            resources.metal = resources.metal.sub(c.metal);
            resources.deuterium = resources.deuterium.sub(c.deuterium);
            resources.titanite = resources.titanite.sub(c.titanite);
            naniteBuilding1 = true;
            recalcProduction();
            return true;
        }
    },
    {
        id: 'drones',
        name: 'Nano-drones factory',
        desc: 'Each mine is increased by 80% of its base value',
        requiredPlantLevel: 2,
        cost: {crystal: 3e11, metal: 3e10, deuterium: 9e7, titanite: 9e10},
        isBought() {
            return naniteBuilding2;
        },
        buy() {
            if (this.isBought()) return false;
            const c = this.cost;
            if (resources.crystal.lt(c.crystal) || resources.metal.lt(c.metal) ||
                resources.deuterium.lt(c.deuterium) || resources.titanite.lt(c.titanite)) return false;
            resources.crystal = resources.crystal.sub(c.crystal);
            resources.metal = resources.metal.sub(c.metal);
            resources.deuterium = resources.deuterium.sub(c.deuterium);
            resources.titanite = resources.titanite.sub(c.titanite);
            naniteBuilding2 = true;
            recalcProduction();
            return true;
        }
    },
    {
        id: 'spaceport',
        name: 'Spaceport',
        desc: 'Unlocks the Spaceship tab.[TBC]', // TODO
        requiredPlantLevel: 3,
        cost: {crystal: 99e99, metal: 99e99, deuterium: 99e99, titanite: 99e99},
        isBought() {
            return naniteBuilding3;
        },
        buy() {
            if (this.isBought()) return false;
            const c = this.cost;
            if (resources.crystal.lt(c.crystal) || resources.metal.lt(c.metal) ||
                resources.deuterium.lt(c.deuterium) || resources.titanite.lt(c.titanite)) return false;
            resources.crystal = resources.crystal.sub(c.crystal);
            resources.metal = resources.metal.sub(c.metal);
            resources.deuterium = resources.deuterium.sub(c.deuterium);
            resources.titanite = resources.titanite.sub(c.titanite);
            naniteBuilding3 = true;
            spaceTabUnlocked = true;
            return true;
        }
    }
];

function getUpgradeCosts(up) {
    return {
        crystal: new Decimal(up.baseCostCrystal).times(Decimal.pow(up.costMult, up.level)),
        metal: new Decimal(up.baseCostMetal).times(Decimal.pow(up.costMult, up.level))
    };
}

// Fonctions d'achat des améliorations classiques
function buyUpgrade(upgradeId) {
    const up = upgradesData.find(u => u.id === upgradeId);
    if (!up || up.level >= up.maxLevel) return false;
    const costCrystal = new Decimal(up.baseCostCrystal).times(Decimal.pow(up.costMult, up.level));
    const costMetal = new Decimal(up.baseCostMetal).times(Decimal.pow(up.costMult, up.level));
    if (resources.crystal.lt(costCrystal) || resources.metal.lt(costMetal)) return false;
    resources.crystal = resources.crystal.sub(costCrystal);
    resources.metal = resources.metal.sub(costMetal);
    up.level++;
    recalcProduction();
    return true;
}

function boostUpgradeWithDeuterium(upgradeId) {
    const up = upgradesData.find(u => u.id === upgradeId);
    if (!up || !deuteriumUnlocked) return false;
    const reduction = getEnergyUpgradeEffect('deuteriumOptimization');
    const cost = new Decimal(up.deuteriumBoostCost).times(Decimal.pow(2, up.deuteriumBoostLevel)).times(1 - reduction);
    if (resources.deuterium.lt(cost)) return false;
    resources.deuterium = resources.deuterium.sub(cost);
    up.deuteriumBoostLevel++;
    recalcProduction();
    return true;
}