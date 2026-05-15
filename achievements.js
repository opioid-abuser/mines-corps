// Liste des succès (facilement modifiable)
const achievements = [

    // --- Mines cristal (production) ---
    ...[10,25,50,100,150,200,300,400].map((n,i) => ({
        id: `mineCrystal${n}`,
        name: `Mineur de cristal ${i+1}`,
        desc: `${n} mines de cristal`,
        condition: () => minesCount.crystal >= n,
        reward() { achievementBonuses.crystalProd += 0.05; },
        points: 1
    })),
    // --- Mines métal (production) ---
    ...[10,25,50,100,150,200,300,400].map((n,i) => ({
        id: `mineMetal${n}`,
        name: `Mineur de métal ${i+1}`,
        desc: `${n} mines de métal`,
        condition: () => minesCount.metal >= n,
        reward() { achievementBonuses.metalProd += 0.05; },
        points: 1
    })),

    // --- Mines deutérium (production) ---
    ...[8,12,25,50,100,200,300,400].map((n,i) => ({
        id: `mineSpecial${n}`,
        name: `Cherche Deutier ${i+1}`,
        desc: `${n} mines de deutérium`,
        condition: () => (minesCount.deuterium) >= n,
        reward() { achievementBonuses.deuteriumProd += 0.05; achievementBonuses.titaniteProd += 0.05; },
        points: 1
    })),
    // --- Réservoir deutérium (stockage) ---
    { id: 'storage10', name: 'Réservoir novice', desc: 'Réservoir niveau 10', condition: () => deuteriumStorageLevel >= 10, reward() { achievementBonuses.deuteriumStorage += 0.1; }, points: 1 },
    { id: 'storage20', name: 'Réservoir intermédiaire', desc: 'Réservoir niveau 20', condition: () => deuteriumStorageLevel >= 20, reward() { achievementBonuses.deuteriumStorage += 0.15; }, points: 1 },
    { id: 'storage30', name: 'Réservoir expert', desc: 'Réservoir niveau 30', condition: () => deuteriumStorageLevel >= 30, reward() { achievementBonuses.deuteriumStorage += 0.2; }, points: 1 },
    { id: 'storage50', name: 'Réservoir maître', desc: 'Réservoir niveau 50', condition: () => deuteriumStorageLevel >= 50, reward() { achievementBonuses.deuteriumStorage += 0.25; }, points: 1 },

    // --- Centrale électrique (stockage énergie) ---
    { id: 'plant5', name: 'Centrale basique', desc: 'Centrale niveau 5', condition: () => powerPlantLevel >= 5, reward() { achievementBonuses.energyStorage += 0.1; }, points: 1 },
    { id: 'plant12', name: 'Centrale avancée', desc: 'Centrale niveau 12', condition: () => powerPlantLevel >= 12, reward() { achievementBonuses.energyStorage += 0.15; }, points: 1 },
    { id: 'plant25', name: 'Centrale experte', desc: 'Centrale niveau 25', condition: () => powerPlantLevel >= 25, reward() { achievementBonuses.energyStorage += 0.2; }, points: 1 },
    { id: 'plant40', name: 'Centrale ultime', desc: 'Centrale niveau 40', condition: () => powerPlantLevel >= 40, reward() { achievementBonuses.energyStorage += 0.25; }, points: 1 },

    // --- Mines titanite (production) ---
    ...[8,12,25,50,100,200,300,400].map((n,i) => ({
        id: `mineSpecial${n}`,
        name: `Spécialiste titaniste ${i+1}`,
        desc: `${n} mines de titanite`,
        condition: () => (minesCount.titanite) >= n,
        reward() { achievementBonuses.deuteriumProd += 0.05; achievementBonuses.titaniteProd += 0.05; },
        points: 1
    })),

    // --- Production totale cristal ---
    { id: 'crystal5k', name: 'Cristal 5k', desc: 'Produire 5 000 cristal au total', condition: () => totalProduced.crystal >= 5000, reward() { achievementBonuses.crystalProd += 0.1; }, points: 1 },
    { id: 'crystal10k', name: 'Cristal 10k', desc: 'Produire 10 000 cristal', condition: () => totalProduced.crystal >= 10000, reward() { achievementBonuses.crystalProd += 0.1; }, points: 1 },
    { id: 'crystal100k', name: 'Cristal 100k', desc: 'Produire 100 000 cristal', condition: () => totalProduced.crystal >= 100000, reward() { achievementBonuses.crystalProd += 0.15; }, points: 1 },
    { id: 'crystal1M', name: 'Cristal 1M', desc: 'Produire 1 000 000 cristal', condition: () => totalProduced.crystal >= 1e6, reward() { achievementBonuses.crystalProd += 0.2; }, points: 1 },
    { id: 'crystal10M', name: 'Cristal 10M', desc: 'Produire 10 000 000 cristal', condition: () => totalProduced.crystal >= 1e7, reward() { achievementBonuses.crystalProd += 0.25; }, points: 1 },

    // --- Production totale métal ---
    { id: 'metal4k', name: 'Métal 4k', desc: 'Produire 4 000 métal au total', condition: () => totalProduced.metal >= 4000, reward() { achievementBonuses.metalProd += 0.1; }, points: 1 },
    { id: 'metal8k', name: 'Métal 8k', desc: 'Produire 8 000 métal', condition: () => totalProduced.metal >= 8000, reward() { achievementBonuses.metalProd += 0.1; }, points: 1 },
    { id: 'metal80k', name: 'Métal 80k', desc: 'Produire 80 000 métal', condition: () => totalProduced.metal >= 80000, reward() { achievementBonuses.metalProd += 0.15; }, points: 1 },
    { id: 'metal800k', name: 'Métal 800k', desc: 'Produire 800 000 métal', condition: () => totalProduced.metal >= 800000, reward() { achievementBonuses.metalProd += 0.2; }, points: 1 },
    { id: 'metal8M', name: 'Métal 8M', desc: 'Produire 8 000 000 métal', condition: () => totalProduced.metal >= 8e6, reward() { achievementBonuses.metalProd += 0.25; }, points: 1 },

    // --- Production totale deutérium ---
    { id: 'deut15k', name: 'Deutérium 15k', desc: 'Produire 15 000 deutérium au total', condition: () => totalProduced.deuterium >= 15000, reward() { achievementBonuses.deuteriumProd += 0.1; }, points: 1 },
    { id: 'deut80k', name: 'Deutérium 80k', desc: 'Produire 80 000 deutérium', condition: () => totalProduced.deuterium >= 80000, reward() { achievementBonuses.deuteriumProd += 0.15; }, points: 1 },
    { id: 'deut800k', name: 'Deutérium 800k', desc: 'Produire 800 000 deutérium', condition: () => totalProduced.deuterium >= 800000, reward() { achievementBonuses.deuteriumProd += 0.2; }, points: 1 },
    { id: 'deut8M', name: 'Deutérium 8M', desc: 'Produire 8 000 000 deutérium', condition: () => totalProduced.deuterium >= 8e6, reward() { achievementBonuses.deuteriumProd += 0.25; }, points: 1 },

    // --- Production totale titanite ---
    { id: 'titanite14k', name: 'Titanite 14k', desc: 'Produire 14 000 titanite au total', condition: () => totalProduced.titanite >= 14000, reward() { achievementBonuses.titaniteProd += 0.1; }, points: 1 },
    { id: 'titanite60k', name: 'Titanite 60k', desc: 'Produire 60 000 titanite', condition: () => totalProduced.titanite >= 60000, reward() { achievementBonuses.titaniteProd += 0.15; }, points: 1 },
    { id: 'titanite600k', name: 'Titanite 600k', desc: 'Produire 600 000 titanite', condition: () => totalProduced.titanite >= 600000, reward() { achievementBonuses.titaniteProd += 0.2; }, points: 1 },
    { id: 'titanite6M', name: 'Titanite 6M', desc: 'Produire 6 000 000 titanite', condition: () => totalProduced.titanite >= 6e6, reward() { achievementBonuses.titaniteProd += 0.25; }, points: 1 },

    // --- Automatisation ---
    { id: 'allAutomations', name: 'Maître des robots', desc: 'Débloquer toutes les automatisations', condition: () => automations.every(a => a.unlocked), reward() { automationInterval = 1000; }, points: 1 }
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