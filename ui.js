let lastSaveTimestamp = null;

function initUI() {
    buildResourcesPanel();
    buildEnergyStoragePanel();
    buildMinesPanel();
    buildUpgradesPanel();
    buildAutomationPanel();
}

function buildResourcesPanel() {
    const panel = document.getElementById('resources-panel');
    panel.innerHTML = `
        <div class="section-title">Ressources</div>
        <div class="resource-item"><span class="resource-label crystal-color">Cristal</span><span class="resource-value" id="crystalAmount">10</span><span class="resource-rate" id="crystalRate">+0/sec</span></div>
        <div class="resource-item"><span class="resource-label metal-color">Métal</span><span class="resource-value" id="metalAmount">10</span><span class="resource-rate" id="metalRate">+0/sec</span></div>
        <div class="resource-item" id="deuteriumDisplay" style="display: none;"><span class="resource-label deuterium-color">Deutérium</span><br><span class="resource-value" id="deuteriumAmount">0</span><span class="resource-rate" id="deuteriumRate">+0/sec</span></div>
        <div class="resource-item" id="energyDisplay" style="display: none;">
            <span class="resource-label energy-accent">Énergie</span>
            <span class="resource-value" id="energyAmount">0</span>
            <span class="resource-rate" id="energyRate">+0/sec</span>
        </div>
        <div class="resource-item" id="titaniteDisplay" style="display: none;"><span class="resource-label titanite-color">Titanite</span><span class="resource-value" id="titaniteAmount">0</span><span class="resource-rate" id="titaniteRate">+0/sec</span></div>
    `;
}

function buildEnergyStoragePanel() {
    const panel = document.getElementById('energy-storage-panel');
    panel.innerHTML = `
        <div class="section-title">Énergie & Stockage</div>
        <!-- Réservoir de deutérium -->
        <div id="deutStorageDisplay" style="display: none;">
            <div class="resource-item">
                <span class="resource-label deuterium-color">Réservoir</span>
                <span class="resource-value" id="storageLevelText">Niv. 1</span>
                <span id="storageCapacityText"></span>
            </div>
            <button class="storage-btn" id="upgradeStorageBtn" style="display: none;">Améliorer réservoir</button>
        </div>
        <!-- Centrale électrique -->
        <div class="resource-item" id="powerPlantSection" style="display: none;">
            <div class="section-title">Centrale électrique</div>
            <div>Niveau: <span id="powerPlantLevel">0</span> / <span id="powerPlantMaxLevel">10</span></div>
            <div>Consommation: <span id="deuteriumConsume">0</span>/sec</div>
            <div>Production: <span class="energy-accent" id="energyProd">0</span>/sec</div>
            <button id="buyPowerPlantBtn">Améliorer</button>
            <button id="downgradePowerPlantBtn">Réduire (-1)</button>
            <div id="powerAlarm" style="color: #ef5350; display: none;">Deutérium épuisé !</div>
        </div>
    `;
    // Masquer initialement (géré par updateUI)
}

function buildMinesPanel() {
    const panel = document.getElementById('mines-panel');
    panel.innerHTML = `
        <div class="section-title">Mines</div>
        <div class="mine-item">
            <span class="mine-label crystal-color">Cristal</span>
            <span class="mine-count" id="mineCountCrystal">0</span>
            <div class="mine-action">
                <button class="mine-buy-btn" id="buyCrystalBtn">Acheter</button>
                <span class="mine-cost-display" id="costCrystalDisplay">(10)</span>
            </div>
        </div>
        <div class="mine-item">
            <span class="mine-label metal-color">Métal</span>
            <span class="mine-count" id="mineCountMetal">0</span>
            <div class="mine-action">
                <button class="mine-buy-btn" id="buyMetalBtn">Acheter</button>
                <span class="mine-cost-display" id="costMetalDisplay">(10)</span>
            </div>
        </div>
        <div class="mine-item" id="deuteriumMineRow" style="display: none;">
            <span class="mine-label deuterium-color">Deutérium</span>
            <span class="mine-count" id="mineCountDeuterium">0</span>
            <div class="mine-action">
                <button class="mine-buy-btn" id="buyDeuteriumBtn">Acheter</button>
                <span class="mine-cost-display" id="costDeuteriumDisplay">(100/50)</span>
            </div>
        </div>
        <div class="mine-item" id="titaniteMineRow" style="display: none;">
            <span class="mine-label titanite-color">Titanite</span>
            <span class="mine-count" id="mineCountTitanite">0</span>
            <div class="mine-action">
                <button class="mine-buy-btn" id="buyTitaniteBtn">Acheter</button>
                <span class="mine-cost-display" id="costTitaniteDisplay">(500/250/100)</span>
            </div>
        </div>
    `;
}

function buildUpgradesPanel() {
    const panel = document.getElementById('upgrades-panel');
    panel.innerHTML = `
        <div class="section-title">Améliorations</div>
        <div class="upgrades-grid" id="classicUpgrades"></div>

        <div class="energy-upgrades-section" id="energyUpgradesSection" style="display: none;">
            <div class="section-title">Améliorations énergétiques</div>
            <div class="upgrades-grid" id="energyUpgradesContainer"></div>
        </div>
        <div class="titanite-upgrades-section" id="titaniteUpgradesSection" style="display: none;">
            <div class="section-title">Améliorations Titanite</div>
            <div class="upgrades-grid" id="titaniteUpgradesContainer"></div>
        </div>
    `;
    // Remplit les grilles d'améliorations
    fillClassicUpgrades();
    fillEnergyUpgrades();
    fillTitaniteUpgrades();
}

function fillClassicUpgrades() {
    const container = document.getElementById('classicUpgrades');
    container.innerHTML = '';
    upgradesData.forEach(up => {
        const row = document.createElement('div');
        row.className = 'upgrade-row';
        row.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${up.name}</div>
                <div class="upgrade-desc">${up.getDescription()}</div>
            </div>
            <div class="upgrade-cost">
                <span class="cost-crystal"></span>
                <span class="cost-metal"></span>
            </div>
            <div class="upgrade-actions">
                <button class="upgrade-buy buy-classic" data-id="${up.id}">Acheter</button>
                <button class="boost-btn boost-deuterium" data-id="${up.id}" style="display: none;">Boost</button>
            </div>
        `;
        container.appendChild(row);
    });
    // Écouteurs communs
    document.querySelectorAll('.buy-classic').forEach(btn => {
        btn.addEventListener('click', () => {
            if (buyUpgrade(btn.dataset.id)) { updateUI(); }
        });
    });
    document.querySelectorAll('.boost-deuterium').forEach(btn => {
        btn.addEventListener('click', () => {
            if (boostUpgradeWithDeuterium(btn.dataset.id)) { updateUI(); }
        });
    });
}

function fillEnergyUpgrades() {
    const container = document.getElementById('energyUpgradesContainer');
    container.innerHTML = '';
    energyUpgradesData.forEach(eu => {
        const row = document.createElement('div');
        row.className = 'upgrade-row';
        row.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${eu.name}</div>
                <div class="upgrade-desc">${eu.getDescription()}</div>
            </div>
            <div class="upgrade-cost"><span class="cost-energy"></span></div>
            <button class="upgrade-buy buy-energy" data-id="${eu.id}">Acheter</button>
        `;
        container.appendChild(row);
    });
    document.querySelectorAll('.buy-energy').forEach(btn => {
        btn.addEventListener('click', () => {
            const eu = energyUpgradesData.find(u => u.id === btn.dataset.id);
            if (eu && eu.buy()) { updateUI(); }
        });
    });
}

function fillTitaniteUpgrades() {
    const container = document.getElementById('titaniteUpgradesContainer');
    container.innerHTML = '';
    titaniteUpgradesData.forEach(tu => {
        const row = document.createElement('div');
        row.className = 'upgrade-row';
        row.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${tu.name}</div>
                <div class="upgrade-desc">${tu.getDescription()}</div>
            </div>
            <div class="upgrade-cost"><span class="cost-titanite"></span></div>
            <button class="upgrade-buy buy-titanite" data-id="${tu.id}">Acheter</button>
        `;
        container.appendChild(row);
    });
    document.querySelectorAll('.buy-titanite').forEach(btn => {
        btn.addEventListener('click', () => {
            const tu = titaniteUpgradesData.find(u => u.id === btn.dataset.id);
            if (tu && tu.buy()) { updateUI(); }
        });
    });
}

function buildAutomationPanel() {
    const panel = document.getElementById('automation-panel');
    panel.innerHTML = '<div class="section-title">Automatisation</div>';
    const grid = document.createElement('div');
    grid.id = 'automationGrid';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '0.5rem';
    panel.appendChild(grid);
    fillAutomationGrid();
}

function fillAutomationGrid() {
    const grid = document.getElementById('automationGrid');
    grid.innerHTML = '';
    automations.forEach(auto => {
        const row = document.createElement('div');
        row.className = 'automation-row';
        row.innerHTML = `
            <div class="automation-info">
                <div class="automation-name">${auto.name}</div>
                <div class="automation-cost" id="autoCost_${auto.id}">${auto.desc}</div>
                <div class="automation-status" id="autoStatus_${auto.id}"></div>
            </div>
            <div class="automation-actions">
                <button class="automation-buy-btn" id="autoBuy_${auto.id}" data-id="${auto.id}">Débloquer</button>
                <button class="automation-toggle-btn" id="autoToggle_${auto.id}" data-id="${auto.id}" style="display: none;">Activer</button>
            </div>
        `;
        grid.appendChild(row);
    });

    // Écouteurs délégués via le conteneur (optionnel) ou attachés ici :
    // Nous allons les attacher dans initGlobalEvents ou directement après la création
    attachAutomationEvents();
}

function attachAutomationEvents() {
    automations.forEach(auto => {
        const buyBtn = document.getElementById(`autoBuy_${auto.id}`);
        const toggleBtn = document.getElementById(`autoToggle_${auto.id}`);
        if (buyBtn) buyBtn.addEventListener('click', () => { if (buyAutomation(auto.id)) updateUI(); });
        if (toggleBtn) toggleBtn.addEventListener('click', () => { if (toggleAutomation(auto.id)) updateUI(); });
    });
}

function updateUI() {
    // Ressources
    document.getElementById('crystalAmount').textContent = formatNumber(resources.crystal, 2);
    document.getElementById('metalAmount').textContent = formatNumber(resources.metal, 2);
    document.getElementById('crystalRate').textContent = `+${formatNumber(crystalProduction, 2)}/sec`;
    document.getElementById('metalRate').textContent = `+${formatNumber(metalProduction, 2)}/sec`;

    const deutDisplay = document.getElementById('deuteriumDisplay');
    const titaniteDisplay = document.getElementById('titaniteDisplay');
    const deutStorageDisplay = document.getElementById('deutStorageDisplay');
    const upgradeStorageBtn = document.getElementById('upgradeStorageBtn');

    if (deuteriumUnlocked) {
        deutDisplay.style.display = '';
        const netDeut = deuteriumProduction.sub(deuteriumConsumption);
        document.getElementById('deuteriumAmount').textContent = formatNumber(resources.deuterium,2);
        document.getElementById('deuteriumRate').textContent = `${netDeut.gte(0) ? '+' : ''}${formatNumber(netDeut, 2)}/sec`;
        deutStorageDisplay.style.display = '';
        const maxLevel = getMaxDeuteriumLevel();
        document.getElementById('storageLevelText').textContent = `Niv. ${deuteriumStorageLevel} / ${maxLevel}`;
        document.getElementById('storageCapacityText').textContent = `(Capacité: ${formatNumber(getMaxDeuterium(),2)})`;
        upgradeStorageBtn.style.display = deuteriumStorageLevel < getMaxDeuteriumLevel() ? '' : 'none';
        const storageCost = getStorageUpgradeCost();
        upgradeStorageBtn.textContent = `Améliorer réservoir (${formatNumber(storageCost.crystal,2)}/${formatNumber(storageCost.metal,2)})`;
        upgradeStorageBtn.disabled = !(resources.crystal.gte(storageCost.crystal) && resources.metal.gte(storageCost.metal));
    } else {
        deutDisplay.style.display = 'none';
        deutStorageDisplay.style.display = 'none';
        upgradeStorageBtn.style.display = 'none';
    }
    // Énergie dans les ressources
    const energyDisplay = document.getElementById('energyDisplay');
    if (powerPlantLevel > 0) {
        energyDisplay.style.display = '';
        document.getElementById('energyAmount').textContent = formatNumber(resources.energy);
        document.getElementById('energyRate').textContent = `+${formatNumber(energyProduction, 1)}/sec`;
    } else {
        energyDisplay.style.display = 'none';
    }
    // Afficher/masquer le panneau Énergie & Stockage
    const energyStoragePanel = document.getElementById('energy-storage-panel');
    if (deuteriumUnlocked) {
        energyStoragePanel.style.display = 'flex';
    } else {
        energyStoragePanel.style.display = 'none';
    }

    // Titanite
    if (titaniteUnlocked) {
        titaniteDisplay.style.display = '';
        document.getElementById('titaniteAmount').textContent = formatNumber(resources.titanite, 2);
        document.getElementById('titaniteRate').textContent = `+${formatNumber(titaniteProduction, 2)}/sec`;
    } else {
        titaniteDisplay.style.display = 'none';
    }

    // Compteurs de mines
    document.getElementById('mineCountCrystal').textContent = minesCount.crystal;
    document.getElementById('mineCountMetal').textContent = minesCount.metal;
    document.getElementById('deuteriumMineRow').style.display = deuteriumUnlocked ? '' : 'none';
    document.getElementById('mineCountDeuterium').textContent = minesCount.deuterium;
    document.getElementById('titaniteMineRow').style.display = titaniteUnlocked ? '' : 'none';
    document.getElementById('mineCountTitanite').textContent = minesCount.titanite;

    // Boutons d'achat de mines (coûts)
    // Coûts affichés sous les boutons
    document.getElementById('costCrystalDisplay').textContent = `(${formatNumber(getCostCrystalMine())})`;
    document.getElementById('costMetalDisplay').textContent = `(${formatNumber(getCostMetalMine())})`;

    if (deuteriumUnlocked) {
        const costD = getCostDeuteriumMine();
        document.getElementById('costDeuteriumDisplay').textContent = `(${formatNumber(costD.crystal)}/${formatNumber(costD.metal)})`;
    }
    if (titaniteUnlocked) {
        const costT = getCostTitaniteMine();
        document.getElementById('costTitaniteDisplay').textContent = `(${formatNumber(costT.crystal)}/${formatNumber(costT.metal)}/${formatNumber(costT.deuterium)})`;
    }

    // Améliorations classiques : mise à jour dynamique dans les rows
    Array.from(document.getElementById('classicUpgrades').children).forEach((row, idx) => {
        const up = upgradesData[idx];
        const costCrystal = new Decimal(up.baseCostCrystal).times(Decimal.pow(up.costMult, up.level));
        const costMetal = new Decimal(up.baseCostMetal).times(Decimal.pow(up.costMult, up.level));
        const canBuy = up.level < up.maxLevel && resources.crystal.gte(costCrystal) && resources.metal.gte(costMetal);
        const reduction = getEnergyUpgradeEffect('deuteriumOptimization');
        const boostCost = new Decimal(up.deuteriumBoostCost).times(Decimal.pow(2, up.deuteriumBoostLevel)).times(1 - reduction);
        const canBoost = deuteriumUnlocked && resources.deuterium.gte(boostCost);

        let levelText;
        if (up.level >= up.maxLevel) levelText = 'MAX';
        else levelText = `Niv. ${up.level}/${up.maxLevel}`;
        if (deuteriumUnlocked) levelText += ` (Boost ${up.deuteriumBoostLevel})`;
        row.querySelector('.upgrade-name').textContent = `${up.name} (${levelText})`;
        row.querySelector('.upgrade-desc').textContent = up.getDescription();
        row.querySelector('.cost-crystal').textContent = costCrystal.gt(0) ? `${formatNumber(costCrystal)} cristal` : '';
        row.querySelector('.cost-metal').textContent = costMetal.gt(0) ? `${formatNumber(costMetal)} métal` : '';
        const buyBtn = row.querySelector('.buy-classic');
        buyBtn.disabled = !canBuy;
        buyBtn.textContent = up.level >= up.maxLevel ? 'OK' : 'Acheter';
        const boostBtn = row.querySelector('.boost-deuterium');
        boostBtn.style.display = deuteriumUnlocked ? '' : 'none';
        boostBtn.disabled = !canBoost;
        boostBtn.textContent = `Boost (${formatNumber(boostCost)})`;
    });

    // Centrale électrique
    const powerSection = document.getElementById('powerPlantSection');
    const energyUpSection = document.getElementById('energyUpgradesSection');
    if (deuteriumStorageLevel >= 10 || powerPlantLevel > 0) {
        powerSection.style.display = '';
        document.getElementById('powerPlantLevel').textContent = powerPlantLevel;
        document.getElementById('powerPlantMaxLevel').textContent = getMaxPowerPlantLevel();
        document.getElementById('deuteriumConsume').textContent = formatNumber(getDeuteriumConsumption(), 2);
        document.getElementById('energyProd').textContent = formatNumber(getEnergyProduction(), 2);
        const buyBtn = document.getElementById('buyPowerPlantBtn');
        const ppMax = getMaxPowerPlantLevel();
        if (powerPlantLevel < ppMax) {
            const cost = getPowerPlantCost();
            buyBtn.style.display = '';
            buyBtn.textContent = `Améliorer (${formatNumber(cost.crystal)}/${formatNumber(cost.metal)})`;
            buyBtn.disabled = !(resources.crystal.gte(cost.crystal) && resources.metal.gte(cost.metal));
        } else {
            buyBtn.style.display = 'none';
        }
        document.getElementById('downgradePowerPlantBtn').style.display = powerPlantLevel > 0 ? '' : 'none';
        document.getElementById('powerAlarm').style.display = (resources.deuterium.eq(0) && powerPlantLevel > 0) ? '' : 'none';

        energyUpSection.style.display = (powerPlantLevel > 0) ? '' : 'none';
    } else {
        powerSection.style.display = 'none';
        energyUpSection.style.display = 'none';
    }

    // Améliorations énergétiques : mise à jour
    if (powerPlantLevel > 0) {
        Array.from(document.getElementById('energyUpgradesContainer').children).forEach((row, idx) => {
            const eu = energyUpgradesData[idx];
            const maxed = eu.level >= eu.maxLevel;
            const cost = maxed ? new Decimal(0) : new Decimal(eu.baseCost).times(Decimal.pow(eu.costMult, eu.level)).floor();
            const canAfford = resources.energy.gte(cost);
            row.querySelector('.upgrade-name').textContent = `${eu.name} (Niv. ${eu.level})`;
            row.querySelector('.upgrade-desc').textContent = eu.getDescription();
            row.querySelector('.cost-energy').textContent = maxed ? 'MAX' : `${formatNumber(cost)} énergie`;
            const buyBtn = row.querySelector('.buy-energy');
            buyBtn.disabled = maxed || !canAfford;
            buyBtn.textContent = maxed ? 'OK' : 'Acheter';
        });
    }

    // Titanite
    const titaniteSection = document.getElementById('titaniteUpgradesSection');
    if (titaniteUnlocked) {
        titaniteSection.style.display = '';
        Array.from(document.getElementById('titaniteUpgradesContainer').children).forEach((row, idx) => {
            const tu = titaniteUpgradesData[idx];
            const maxed = tu.level >= tu.maxLevel;
            const cost = maxed ? new Decimal(0) : new Decimal(tu.baseCost).times(Decimal.pow(tu.costMult, tu.level)).floor();
            const canAfford = resources.titanite.gte(cost);
            row.querySelector('.upgrade-name').textContent = `${tu.name} (Niv. ${tu.level})`;
            row.querySelector('.upgrade-desc').textContent = tu.getDescription();
            row.querySelector('.cost-titanite').textContent = maxed ? 'MAX' : `${formatNumber(cost)} titanite`;
            const buyBtn = row.querySelector('.buy-titanite');
            buyBtn.disabled = maxed || !canAfford;
            buyBtn.textContent = maxed ? 'OK' : 'Acheter';
        });
    } else {
        titaniteSection.style.display = 'none';
    }

    const autoPanel = document.getElementById('automation-panel');
    if (titaniteUnlocked) {
        autoPanel.style.display = '';
        automations.forEach(auto => {
            const costEl = document.getElementById(`autoCost_${auto.id}`);
            const statusEl = document.getElementById(`autoStatus_${auto.id}`);
            const buyBtn = document.getElementById(`autoBuy_${auto.id}`);
            const toggleBtn = document.getElementById(`autoToggle_${auto.id}`);

            if (auto.unlocked) {
                buyBtn.style.display = 'none';
                toggleBtn.style.display = '';
                toggleBtn.textContent = auto.active ? 'Désactiver' : 'Activer';
                toggleBtn.classList.toggle('active', auto.active);
                statusEl.textContent = `Débloqué`;
            } else {
                buyBtn.style.display = '';
                toggleBtn.style.display = 'none';
                buyBtn.textContent = `Débloquer (${formatNumber(auto.costEnergy)}/${formatNumber(auto.costTitanite)})`;
                buyBtn.disabled = resources.energy.lt(auto.costEnergy) || resources.titanite.lt(auto.costTitanite);
                statusEl.textContent = `Coût : ${formatNumber(auto.costEnergy)} énergie, ${formatNumber(auto.costTitanite)} titanite`;
            }
        });
    } else {
        autoPanel.style.display = 'none';
    }

    updateSaveInfo();
}

function updateSaveInfo() {
    const info = document.getElementById('saveInfo');
    if (lastSaveTimestamp) {
        info.textContent = `Dernière sauvegarde : ${new Date(lastSaveTimestamp).toLocaleTimeString()}`;
    } else {
        info.textContent = 'Aucune sauvegarde récente.';
    }
}

// Initialisation des événements globaux (sauvegarde, boutons mines, centrale)
function initGlobalEvents() {
    // Sauvegarde overlay
    const floatingBtn = document.getElementById('saveFloatingBtn');
    const overlay = document.getElementById('saveOverlay');
    const closeBtn = document.getElementById('closeOverlayBtn');
    floatingBtn.addEventListener('click', () => { overlay.style.display = 'flex'; updateSaveInfo(); });
    closeBtn.addEventListener('click', () => overlay.style.display = 'none');
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });

    document.getElementById('saveBtn').addEventListener('click', () => {
        saveToLocalStorage();
        lastSaveTimestamp = Date.now();
        updateSaveInfo();
        updateUI();
    });
    document.getElementById('loadBtn').addEventListener('click', () => {
        if (loadFromLocalStorage()) {
            lastSaveTimestamp = Date.now();
            updateUI();
            updateSaveInfo();
        } else alert('Aucune sauvegarde trouvée.');
    });
    document.getElementById('exportBtn').addEventListener('click', () => {
        const data = getSaveData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mines-hex-save.json';
        a.click();
        URL.revokeObjectURL(url);
    });
    const importFile = document.getElementById('importFile');
    document.getElementById('importBtn').addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (loadSaveData(data)) {
                    lastSaveTimestamp = data.timestamp || Date.now();
                    saveToLocalStorage();
                    updateUI();
                    updateSaveInfo();
                } else alert('Fichier invalide.');
            } catch (err) { alert('Erreur de lecture.'); }
        };
        reader.readAsText(file);
        importFile.value = '';
    });
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Réinitialiser toute votre progression ?')) {
            resetGame();
            lastSaveTimestamp = null;
            updateUI();
            updateSaveInfo();
        }
    });

    // Boutons d'achat de mines
    document.getElementById('buyCrystalBtn').addEventListener('click', () => {
        const cost = getCostCrystalMine();
        if (resources.crystal.lt(cost)) return;
        resources.crystal = resources.crystal.sub(cost);
        minesCount.crystal++;
        recalcProduction();
        checkDeuteriumUnlock();
        updateUI();
    });
    document.getElementById('buyMetalBtn').addEventListener('click', () => {
        const cost = getCostMetalMine();
        if (resources.metal.lt(cost)) return;
        resources.metal = resources.metal.sub(cost);
        minesCount.metal++;
        recalcProduction();
        checkDeuteriumUnlock();
        updateUI();
    });
    document.getElementById('buyDeuteriumBtn').addEventListener('click', () => {
        if (!deuteriumUnlocked) return;
        const cost = getCostDeuteriumMine();
        if (resources.crystal.lt(cost.crystal) || resources.metal.lt(cost.metal)) return;
        resources.crystal = resources.crystal.sub(cost.crystal);
        resources.metal = resources.metal.sub(cost.metal);
        minesCount.deuterium++;
        recalcProduction();
        updateUI();
    });
    document.getElementById('buyTitaniteBtn').addEventListener('click', () => {
        if (!titaniteUnlocked) return;
        const cost = getCostTitaniteMine();
        if (resources.crystal.lt(cost.crystal) || resources.metal.lt(cost.metal) || resources.deuterium.lt(cost.deuterium)) return;
        resources.crystal = resources.crystal.sub(cost.crystal);
        resources.metal = resources.metal.sub(cost.metal);
        resources.deuterium = resources.deuterium.sub(cost.deuterium);
        minesCount.titanite++;
        recalcProduction();
        updateUI();
    });

    // Centrale
    document.getElementById('buyPowerPlantBtn').addEventListener('click', () => {
        if (buyPowerPlant()) { updateUI(); }
    });
    document.getElementById('downgradePowerPlantBtn').addEventListener('click', () => {
        if (downgradePowerPlant()) { updateUI(); }
    });

    // Réservoir
    document.getElementById('upgradeStorageBtn').addEventListener('click', () => {
        if (upgradeDeuteriumStorage()) { updateUI(); }
    });
}