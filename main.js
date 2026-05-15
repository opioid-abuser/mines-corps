let lastTimestamp = performance.now();
let autoSaveInterval = null;

function gameLoop(now) {
    const dt = Math.min(0.5, (now - lastTimestamp) / 1000);
    lastTimestamp = now;
    // Production de cristal, métal
    resources.crystal = resources.crystal.add(crystalProduction.times(dt));
    resources.metal = resources.metal.add(metalProduction.times(dt));
    // Deutérium
    if (deuteriumUnlocked) {
        resources.deuterium = resources.deuterium.add(deuteriumProduction.times(dt));
        resources.deuterium = Decimal.min(resources.deuterium, getMaxDeuterium());
        // Centrale électrique
        if (powerPlantLevel > 0) {
            const consume = deuteriumConsumption.times(dt);
            const actual = Decimal.min(resources.deuterium, consume);
            resources.deuterium = resources.deuterium.sub(actual);
            if (actual.gt(0)) {
                const ratio = actual.div(consume);
                resources.energy = resources.energy.add(energyProduction.times(dt).times(ratio));
            }
            resources.energy = Decimal.min(resources.energy, getMaxEnergy());
        }
    }
    // Titanite
    if (titaniteUnlocked) {
        resources.titanite = resources.titanite.add(titaniteProduction.times(dt));
    }

    // incrémente les totaux pour les succès
    totalProduced.crystal += crystalProduction.times(dt).toNumber();
    totalProduced.metal += metalProduction.times(dt).toNumber();
    if (deuteriumUnlocked) {
        totalProduced.deuterium += deuteriumProduction.times(dt).toNumber();
    }
    if (titaniteUnlocked) {
        totalProduced.titanite += titaniteProduction.times(dt).toNumber();
    }

    processAutomations(now);
    updateUI();
    const newAchievements = checkAchievements(false);
    if (newAchievements.length > 0) {
        const achBtn = document.getElementById('achievementsFloatingBtn');
        if (achBtn) {
            achBtn.classList.add('rgb-flash');
            clearTimeout(achBtn._flashTimeout);
            achBtn._flashTimeout = setTimeout(() => {
                achBtn.classList.remove('rgb-flash');
            }, 5000);
        }
        newAchievements.forEach(ach => showAchievementToast(ach));
    }
    requestAnimationFrame(gameLoop);
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        saveToLocalStorage();
        lastSaveTimestamp = Date.now();
    }, 10000);
}

function startGame() {
    const achBtn = document.getElementById('achievementsFloatingBtn');
    if (achBtn) achBtn.classList.remove('rgb-flash');

    initUI();
    initGlobalEvents();

    const loaded = loadFromLocalStorage();
    if (loaded) lastSaveTimestamp = Date.now();

    // Synchronisation silencieuse des succès (pas de notifications)
    checkAchievements(true);

    recalcProduction();
    updateUI();
    startAutoSave();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', startGame);