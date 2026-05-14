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
    processAutomations(now);
    updateUI();
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
    initUI();
    initGlobalEvents();
    

    if (loadFromLocalStorage()) {
        lastSaveTimestamp = Date.now();
    } else {
        // Valeurs par défaut déjà définies
    }
    recalcProduction();
    updateUI();
    startAutoSave();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', startGame);