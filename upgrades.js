// Améliorations classiques (coût en cristal et/ou métal)
const upgradesData = [
    {
        id: 'prodBoost',
        name: 'Productivité',
        baseDescription: 'Augmente la production de chaque mine.',
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
            return `+${perMine}/mine/niv. Bonus actuel : +${current}/sec par mine.`;
        }
    },
    {
        id: 'costReduction',
        name: 'Forage efficace',
        baseDescription: 'Réduit le coût des mines.',
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
            return `Réduction : ${reduction}% sur le coût des mines.`;
        }
    },
    {
        id: 'passiveCrystal',
        name: 'Prospection cristal',
        baseDescription: 'Production passive de cristal.',
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
            return `+${current} cristal/sec (passif).`;
        }
    },
    {
        id: 'synergy',
        name: 'Synergie minière',
        baseDescription: 'Bonus de production selon le nombre total de mines.',
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
            return `+${perMine}% par mine. Bonus total : +${totalBonus}% production.`;
        }
    }
];

// Améliorations énergétiques (coût en énergie)
const energyUpgradesData = [
    {
        id: 'amplification',
        name: 'Amplification',
        baseDescription: 'Production cristal/métal +10% par niveau.',
        baseCost: 20,
        costMult: 2.5,
        level: 0,
        maxLevel: 15,
        getEffect() { return 1 + this.level * 0.1; },
        getDescription() { return `Multiplie par ${this.getEffect().toFixed(1)} la production de cristal et métal.`; },
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
        name: 'Optimisation deutérium',
        baseDescription: 'Réduit le coût des boosts deutérium de 10% par niveau.',
        baseCost: 45,
        costMult: 2.5,
        level: 0,
        maxLevel: 10,
        getEffect() { return Math.min(this.level * 0.05, 0.99); },
        getDescription() { return `Réduction du prix en deutérium des boosts ${(this.getEffect()*100).toFixed(0)}%.`; },
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
        name: 'Surcharge',
        baseDescription: 'Production d\'énergie +20% par niveau.',
        baseCost: 15,
        costMult: 2.0,
        level: 0,
        maxLevel: 20,
        getEffect() {
            return this.level * 0.2;
        },
        getDescription() {
            return `+${(this.getEffect() * 100).toFixed(0)}% production d\'énergie.`;
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
        name: 'Stockage énergie',
        baseDescription: 'Capacité énergie +50% par niveau.',
        baseCost: 10,
        costMult: 1.8,
        level: 0,
        maxLevel: 10,
        getEffect() { return this.level * 0.5; },
        getDescription() { return `+${(this.getEffect()*100).toFixed(0)}% capacité d\'énergie.`; },
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
        name: 'Surcharge titanite',
        baseDescription: 'Production énergie +30% par niveau.',
        baseCost: 100000,
        costMult: 2.0,
        level: 0,
        maxLevel: 15,
        getEffect() { return this.level * 0.3; },
        getDescription() { return `+${(this.getEffect()*100).toFixed(0)}% production d\'énergie.`; },
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
        name: 'Condensateur titanite',
        baseDescription: 'Capacité énergie +50% par niveau.',
        baseCost: 150000,
        costMult: 2.2,
        level: 0,
        maxLevel: 10,
        getEffect() { return this.level * 0.5; },
        getDescription() { return `+${(this.getEffect()*100).toFixed(0)}% capacité d\'énergie.`; },
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
        name: 'Réservoir renforcé',
        baseDescription: 'Niveau max réservoir deutérium +2 par niveau.',
        baseCost: 200000,
        costMult: 2.5,
        level: 0,
        maxLevel: 5,
        getEffect() { return this.level * 2; },
        getDescription() { return `+${this.getEffect()} niveaux max réservoir deutérium.`; },
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
        name: 'Extension centrale',
        baseDescription: 'Niveau max centrale +2 par niveau.',
        baseCost: 300000,
        costMult: 3.0,
        level: 0,
        maxLevel: 5,
        getEffect() { return this.level * 2; },
        getDescription() { return `+${this.getEffect()} niveaux max centrale électrique.`; },
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
        name: 'Convertisseur crystallique',
        desc: '50% de la production de cristal est ajoutée à celle de métal.',
        requiredPlantLevel: 1,
        cost: {crystal: 250000, metal: 150000, deuterium: 50000, titanite: 2500},
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
        name: 'Usine de nano-drones',
        desc: 'Bonus passif égal à 80% du nombre de mines.',
        requiredPlantLevel: 2,
        cost: {crystal: 1000000, metal: 600000, deuterium: 200000, titanite: 10000},
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
        name: 'Spatio-port',
        desc: 'Débloque l’onglet des vaisseaux spatiaux.', // TODO
        requiredPlantLevel: 3,
        cost: {crystal: 4000000, metal: 2500000, deuterium: 750000, titanite: 40000},
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