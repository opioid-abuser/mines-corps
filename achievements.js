// Liste des succès (facilement modifiable)
const achievements = [

    // --- Mines cristal (production) ---
    ...[10,25,50,100,150,200,300,400].map((n,i) => ({
        id: `mineCrystal${n}`,
        name: `Crystal Miner ${i + 1}`,
        desc: `${n} crystal mines`,
        condition: () => minesCount.crystal >= n,
        reward() { achievementBonuses.crystalProd += 0.05; },
        points: 1
    })),
    // --- Mines métal (production) ---
    ...[10,25,50,100,150,200,300,400].map((n,i) => ({
        id: `mineMetal${n}`,
        name: `Iron miner ${i + 1}`,
        desc: `${n} iron mines`,
        condition: () => minesCount.metal >= n,
        reward() { achievementBonuses.metalProd += 0.05; },
        points: 1
    })),

    // --- Mines deutérium (production) ---
    ...[8,12,25,50,100,200,300,400].map((n,i) => ({
        id: `mineSpecial${n}`,
        name: `Looking for Deut ${i + 1}`,
        desc: `${n} deuterium mines`,
        condition: () => (minesCount.deuterium) >= n,
        reward() { achievementBonuses.deuteriumProd += 0.05; achievementBonuses.titaniteProd += 0.05; },
        points: 1
    })),
    // --- Réservoir deutérium (stockage) ---
    {
        id: 'storage10',
        name: 'Beginner Tank',
        desc: 'Tank level 10',
        condition: () => deuteriumStorageLevel >= 10,
        reward() {
            achievementBonuses.deuteriumStorage += 0.1;
        },
        points: 1
    },
    {
        id: 'storage20',
        name: 'Intermediate Tank',
        desc: 'Tank level 20',
        condition: () => deuteriumStorageLevel >= 20,
        reward() {
            achievementBonuses.deuteriumStorage += 0.15;
        },
        points: 1
    },
    {
        id: 'storage30',
        name: 'Expert Tank',
        desc: 'Tank level 30',
        condition: () => deuteriumStorageLevel >= 30,
        reward() {
            achievementBonuses.deuteriumStorage += 0.2;
        },
        points: 1
    },
    {
        id: 'storage50',
        name: 'Master Tank',
        desc: 'Tank level 50',
        condition: () => deuteriumStorageLevel >= 50,
        reward() {
            achievementBonuses.deuteriumStorage += 0.25;
        },
        points: 1
    },

    // --- Centrale électrique (stockage énergie) ---
    {
        id: 'plant5',
        name: 'Basic Power Plant',
        desc: 'Power Plant level 5',
        condition: () => powerPlantLevel >= 5,
        reward() {
            achievementBonuses.energyStorage += 0.1;
        },
        points: 1
    },
    {
        id: 'plant12',
        name: 'Advanced Power Plant',
        desc: 'Power Plant level 12',
        condition: () => powerPlantLevel >= 12,
        reward() {
            achievementBonuses.energyStorage += 0.15;
        },
        points: 1
    },
    {
        id: 'plant25',
        name: 'Expert Power Plant',
        desc: 'Power Plant level 25',
        condition: () => powerPlantLevel >= 25,
        reward() {
            achievementBonuses.energyStorage += 0.2;
        },
        points: 1
    },
    {
        id: 'plant40',
        name: 'Ultimate Power Plant',
        desc: 'Power Plant level 40',
        condition: () => powerPlantLevel >= 40,
        reward() {
            achievementBonuses.energyStorage += 0.25;
        },
        points: 1
    },

    // --- Mines titanite (production) ---
    ...[8,12,25,50,100,200,300,400].map((n,i) => ({
        id: `mineSpecial${n}`,
        name: `Titanite Specialist ${i + 1}`,
        desc: `${n} Titanite mines`,
        condition: () => (minesCount.titanite) >= n,
        reward() { achievementBonuses.deuteriumProd += 0.05; achievementBonuses.titaniteProd += 0.05; },
        points: 1
    })),

    // --- Production totale cristal ---
    {
        id: 'crystal5k',
        name: 'Crystal 5k',
        desc: 'Produce 5 000 Crystal in total',
        condition: () => totalProduced.crystal >= 5000,
        reward() {
            achievementBonuses.crystalProd += 0.1;
        },
        points: 1
    },
    {
        id: 'crystal10k',
        name: 'Crystal 10k',
        desc: 'Produce 10 000 Crystal',
        condition: () => totalProduced.crystal >= 10000,
        reward() {
            achievementBonuses.crystalProd += 0.1;
        },
        points: 1
    },
    {
        id: 'crystal100k',
        name: 'Crystal 100k',
        desc: 'Produce 100 000 Crystal',
        condition: () => totalProduced.crystal >= 100000,
        reward() {
            achievementBonuses.crystalProd += 0.15;
        },
        points: 1
    },
    {
        id: 'crystal1M',
        name: 'Crystal 1M',
        desc: 'Produce 1 000 000 Crystal',
        condition: () => totalProduced.crystal >= 1e6,
        reward() {
            achievementBonuses.crystalProd += 0.2;
        },
        points: 1
    },
    {
        id: 'crystal10M',
        name: 'Crystal 10M',
        desc: 'Produce 10 000 000 Crystal',
        condition: () => totalProduced.crystal >= 1e7,
        reward() {
            achievementBonuses.crystalProd += 0.25;
        },
        points: 1
    },

    // --- Production totale métal ---
    {
        id: 'metal4k',
        name: 'iron 4k',
        desc: 'Produce 4 000 Iron in total',
        condition: () => totalProduced.metal >= 4000,
        reward() {
            achievementBonuses.metalProd += 0.1;
        },
        points: 1
    },
    {
        id: 'metal8k',
        name: 'iron 8k',
        desc: 'Produce 8 000 Iron',
        condition: () => totalProduced.metal >= 8000,
        reward() {
            achievementBonuses.metalProd += 0.1;
        },
        points: 1
    },
    {
        id: 'metal80k',
        name: 'iron 80k',
        desc: 'Produce 80 000 Iron',
        condition: () => totalProduced.metal >= 80000,
        reward() {
            achievementBonuses.metalProd += 0.15;
        },
        points: 1
    },
    {
        id: 'metal800k',
        name: 'iron 800k',
        desc: 'Produce 800 000 Iron',
        condition: () => totalProduced.metal >= 800000,
        reward() {
            achievementBonuses.metalProd += 0.2;
        },
        points: 1
    },
    {
        id: 'metal8M',
        name: 'iron 8M',
        desc: 'Produce 8 000 000 Iron',
        condition: () => totalProduced.metal >= 8e6,
        reward() {
            achievementBonuses.metalProd += 0.25;
        },
        points: 1
    },

    // --- Production totale deutérium ---
    {
        id: 'deut15k',
        name: 'Deuterium 15k',
        desc: 'Produce 15 000 Deuterium in total',
        condition: () => totalProduced.deuterium >= 15000,
        reward() {
            achievementBonuses.deuteriumProd += 0.1;
        },
        points: 1
    },
    {
        id: 'deut80k',
        name: 'Deuterium 80k',
        desc: 'Produce 80 000 Deuterium',
        condition: () => totalProduced.deuterium >= 80000,
        reward() {
            achievementBonuses.deuteriumProd += 0.15;
        },
        points: 1
    },
    {
        id: 'deut800k',
        name: 'Deuterium 800k',
        desc: 'Produce 800 000 Deuterium',
        condition: () => totalProduced.deuterium >= 800000,
        reward() {
            achievementBonuses.deuteriumProd += 0.2;
        },
        points: 1
    },
    {
        id: 'deut8M',
        name: 'Deuterium 8M',
        desc: 'Produce 8 000 000 Deuterium',
        condition: () => totalProduced.deuterium >= 8e6,
        reward() {
            achievementBonuses.deuteriumProd += 0.25;
        },
        points: 1
    },

    // --- Production totale titanite ---
    {
        id: 'titanite14k',
        name: 'Titanite 14k',
        desc: 'Produce 14 000 titanite in total',
        condition: () => totalProduced.titanite >= 14000,
        reward() {
            achievementBonuses.titaniteProd += 0.05;
        },
        points: 1
    },
    {
        id: 'titanite60k',
        name: 'Titanite 60k',
        desc: 'Produce 60 000 titanite',
        condition: () => totalProduced.titanite >= 60000,
        reward() {
            achievementBonuses.titaniteProd += 0.1;
        },
        points: 1
    },
    {
        id: 'titanite600k',
        name: 'Titanite 600k',
        desc: 'Produce 600 000 titanite',
        condition: () => totalProduced.titanite >= 600000,
        reward() {
            achievementBonuses.titaniteProd += 0.15;
        },
        points: 1
    },
    {
        id: 'titanite6M',
        name: 'Titanite 6M',
        desc: 'Produce 6 000 000 titanite',
        condition: () => totalProduced.titanite >= 6e6,
        reward() {
            achievementBonuses.titaniteProd += 0.2;
        },
        points: 1
    },

    // --- Automatisation ---
    {
        id: 'allAutomations',
        name: 'Master of Automation',
        desc: 'Unlock all automations',
        condition: () => automations.every(a => a.unlocked),
        reward() {
            automationInterval = 1000;
        },
        points: 1
    },

    // --- Nanite ---
    {
        id: 'achNaniteBuilding1',
        name: 'Nanite Factory 1',
        desc: 'Unlock the first level of the nanite factory',
        condition: () => naniteBuilding1,
        reward() {
            achievementBonuses.metalProd += 0.2;
        },
        points: 10
    },
    {
        id: 'achNaniteBuilding2',
        name: 'Nanite Factory 2',
        desc: 'Unlock the second level of the nanite factory',
        condition: () => naniteBuilding2,
        reward() {
            achievementBonuses.crystalProd += 0.2;
        },
        points: 10
    },
    {
        id: 'achNaniteBuilding3',
        name: 'Nanite Factory 3',
        desc: 'Unlock the third level of the nanite factory',
        condition: () => naniteBuilding2,
        reward() {
            achievementBonuses.deuteriumStorage += 0.30;
        },
        points: 10
    },


];

// Bonus passifs cumulés
const achievementBonuses = {
    crystalProd: 0,
    metalProd: 0,
    deuteriumProd: 0,
    titaniteProd: 0,
    deuteriumStorage: 0,
    energyStorage: 0
};

// Compteurs de production totale (depuis le début de la partie)
const totalProduced = {
    crystal: 0,
    metal: 0,
    deuterium: 0,
    titanite: 0
};

// Intervalle d'automatisation (modifiable par succès)
let automationInterval = 5000; // 5 secondes par défaut

// Vérification périodique des succès
function checkAchievements(silent = false) {
    const newlyUnlocked = [];
    for (const ach of achievements) {
        if (!ach.unlocked && ach.condition()) {
            ach.unlocked = true;
            ach.reward();
            achievementPoints += ach.points;
            if (!silent) {
                newlyUnlocked.push(ach);
            }
        }
    }
    return newlyUnlocked;
}
let achievementPoints = 0;

// Sauvegarde / chargement
function getAchievementsSaveData() {
    return {
        unlocked: achievements.map(a => ({ id: a.id, unlocked: a.unlocked })),
        bonuses: { ...achievementBonuses },
        totalProduced: { ...totalProduced },
        automationInterval: automationInterval,
        achievementPoints: achievementPoints
    };
}

function loadAchievementsData(data) {
    if (!data) return;
    if (data.unlocked) {
        data.unlocked.forEach(saved => {
            const ach = achievements.find(a => a.id === saved.id);
            if (ach) ach.unlocked = saved.unlocked;
        });
    }
    if (data.bonuses) Object.assign(achievementBonuses, data.bonuses);
    if (data.totalProduced) {
        totalProduced.crystal = data.totalProduced.crystal || 0;
        totalProduced.metal = data.totalProduced.metal || 0;
        totalProduced.deuterium = data.totalProduced.deuterium || 0;
        totalProduced.titanite = data.totalProduced.titanite || 0;
    }
    if (data.automationInterval) automationInterval = data.automationInterval;
    if (data.achievementPoints) achievementPoints = data.achievementPoints;
    // Réappliquer les récompenses pour être sûr
    achievements.forEach(a => { if (a.unlocked) a.reward(); });
}

function resetAchievements() {
    achievements.forEach(a => a.unlocked = false);
    Object.keys(achievementBonuses).forEach(k => achievementBonuses[k] = 0);
    totalProduced.crystal = 0;
    totalProduced.metal = 0;
    totalProduced.deuterium = 0;
    totalProduced.titanite = 0;
    automationInterval = 5000;
    achievementPoints = 0;
}