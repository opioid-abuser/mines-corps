let lastSaveTimestamp = null;

// Formatage avec émoji
function formatCost(resource, amount) {
    const emojis = {
        crystal: '💎',
        metal: '⚙️',
        deuterium: '💧',
        energy: '⚡',
        titanite: '🔶'
    };
    return `${emojis[resource]} ${formatNumber(amount)}`;
}

// Initialisation de l'interface
function initUI() {
    buildResourcesBar();
    buildTabBasic();
    buildTabEnergy();
    buildTabTitanite();
    setupTabs();
    initGlobalEvents();
    document.getElementById('game-footer').innerHTML = `<a href="${GITHUB_PAGE_URL}">github</a> | v. ${GAME_VERSION}`;
}


// Barre des ressources (toujours visible)
function buildResourcesBar() {
    const bar = document.getElementById('resources-bar');
    bar.innerHTML = `
        <div class="resource-item">
            <span class="resource-label crystal-color">💎 Cristal</span>
            <span class="resource-value" id="crystalAmount">10</span>
            <span class="resource-rate" id="crystalRate">+0/sec</span>
        </div>
        <div class="resource-item">
            <span class="resource-label metal-color">⚙️ Métal</span>
            <span class="resource-value" id="metalAmount">10</span>
            <span class="resource-rate" id="metalRate">+0/sec</span>
        </div>
        <div class="resource-item" id="deutResItem" style="display:none;">
            <span class="resource-label deuterium-color">💧 Deutérium</span>
            <span class="resource-value" id="deuteriumAmount">0</span>
            <span class="resource-rate" id="deuteriumRate">+0/sec</span>
        </div>
        <div class="resource-item" id="energyResItem" style="display:none;">
            <span class="resource-label energy-color">⚡ Énergie</span>
            <span class="resource-value" id="energyAmount">0</span>
            <span class="resource-rate" id="energyRate">+0/sec</span>
        </div>
        <div class="resource-item" id="titaniteResItem" style="display:none;">
            <span class="resource-label titanite-color">🔶 Titanite</span>
            <span class="resource-value" id="titaniteAmount">0</span>
            <span class="resource-rate" id="titaniteRate">+0/sec</span>
        </div>
    `;
}

// Onglet 1 : Mines de base + Améliorations classiques
function buildTabBasic() {
    const tab = document.getElementById('tab-basic');
    tab.innerHTML = `
        <div class="panel-section">
            <div class="section-title">Mines</div>
            <div class="mine-grid">
                <div class="mine-item">
                    <div class="mine-info">
                        <span class="mine-label crystal-color">💎 Cristal</span>
                        <span class="mine-count" id="mineCountCrystal">0</span>
                    </div>
                    <div class="mine-action">
                        <button class="mine-buy-btn" id="buyCrystalBtn">Acheter</button>
                        <span class="mine-cost-display" id="costCrystalDisplay"></span>
                    </div>
                </div>
                <div class="mine-item">
                    <div class="mine-info">
                        <span class="mine-label metal-color">⚙️ Métal</span>
                        <span class="mine-count" id="mineCountMetal">0</span>
                    </div>
                    <div class="mine-action">
                        <button class="mine-buy-btn" id="buyMetalBtn">Acheter</button>
                        <span class="mine-cost-display" id="costMetalDisplay"></span>
                    </div>
                </div>
                <div class="mine-item" id="deuteriumMineRow" style="display: none;">
                    <div class="mine-info">
                        <span class="mine-label deuterium-color">💧 Deutérium</span>
                        <span class="mine-count" id="mineCountDeuterium">0</span>
                    </div>
                    <div class="mine-action">
                        <button class="mine-buy-btn" id="buyDeuteriumBtn">Acheter</button>
                        <span class="mine-cost-display" id="costDeuteriumDisplay"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-section">
            <div class="section-title">Améliorations</div>
            <div class="upgrades-grid" id="classicUpgrades"></div>
        </div>
    `;
    fillClassicUpgrades();
    // Événements des mines
    document.getElementById('buyCrystalBtn').addEventListener('click', buyCrystalMine);
    document.getElementById('buyMetalBtn').addEventListener('click', buyMetalMine);
    document.getElementById('buyDeuteriumBtn').addEventListener('click', buyDeuteriumMine);
}

// Onglet 2 : Énergie & Deutérium
function buildTabEnergy() {
    const tab = document.getElementById('tab-energy');
    tab.innerHTML = `
        <div class="panel-section" id="deutSection" style="display:none;">
            <div class="section-title">Réservoir de Deutérium</div>
            <div><span id="storageLevelText">Niv. 1</span> / <span id="storageMaxLevel">10</span></div>
            <div>Capacité : <span id="storageCapacityText">40</span></div>
            <button id="upgradeStorageBtn">Améliorer réservoir</button>
        </div>
        <div class="panel-section" id="centraleSection" style="display:none;">
            <div class="section-title">Centrale électrique</div>
            <div>Niv. <span id="powerPlantLevel">0</span> / <span id="powerPlantMaxLevel">10</span></div>
            <div>Consommation : <span id="deuteriumConsume">0</span>/sec</div>
            <div>Production : <span id="energyProd">0</span>/sec</div>
            <div class="centrale-controls">
                <button id="buyPowerPlantBtn">Améliorer</button>
                <button id="downgradePowerPlantBtn">Réduire (-1)</button>
            </div>
            <div id="powerAlarm" style="color:#ef5350;display:none;">Deutérium épuisé !</div>
        </div>
        <div class="panel-section" id="energyUpgradesSection" style="display:none;">
            <div class="section-title">Améliorations énergétiques</div>
            <div class="upgrades-grid" id="energyUpgradesContainer"></div>
        </div>
    `;
    fillEnergyUpgrades();
    // Événements
    document.getElementById('upgradeStorageBtn').addEventListener('click', upgradeDeuteriumStorageAction);
    document.getElementById('buyPowerPlantBtn').addEventListener('click', () => { if (buyPowerPlant()) updateUI(); });
    document.getElementById('downgradePowerPlantBtn').addEventListener('click', () => { if (downgradePowerPlant()) updateUI(); });
}

// Onglet 3 : Titanite & Automatisation
function buildTabTitanite() {
    const tab = document.getElementById('tab-titanite');
    tab.innerHTML = `
        <div class="panel-section" id="titaniteMineSection" style="display:none;">
            <div class="section-title">Mine de Titanite</div>
            <div class="mine-item">
                <div class="mine-info">
                    <span class="mine-label titanite-color">🔶 Titanite</span>
                    <span class="mine-count" id="mineCountTitanite">0<span> 
                </div>
                <div class="mine-action">
                    <button class="mine-buy-btn" id="buyTitaniteBtn">Acheter</button>
                    <span class="mine-cost-display" id="costTitaniteDisplay"></span>
                </div>
            </div>
        </div>
        <div class="panel-section" id="titaniteUpgradesSection" style="display:none;">
            <div class="section-title">Améliorations Titanite</div>
            <div class="upgrades-grid" id="titaniteUpgradesContainer"></div>
        </div>
        <div class="panel-section" id="automationSection" style="display:none;">
            <div class="section-title">Automatisation</div>
            <div class="automation-grid" id="automationGrid"></div>
        </div>
    `;
    fillTitaniteUpgrades();
    fillAutomationGrid();
    document.getElementById('buyTitaniteBtn').addEventListener('click', buyTitaniteMine);
}

// Remplissage des grilles d'améliorations
function fillClassicUpgrades() {
    const container = document.getElementById('classicUpgrades');
    container.innerHTML = '';
    upgradesData.forEach(up => {
        const row = document.createElement('div');
        row.className = 'upgrade-row';
        row.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name-line">${up.name}</div>
                <div class="upgrade-level-line"></div>
                <div class="upgrade-desc-line"></div>
            </div>
            <div class="upgrade-cost">
                <span class="cost-crystal"></span>
                <span class="cost-metal"></span>
            </div>
            <div class="upgrade-actions">
                <button class="upgrade-buy buy-classic" data-id="${up.id}">Acheter</button>
                <button class="boost-btn boost-deuterium" data-id="${up.id}" style="display:none;">Boost</button>
            </div>
        `;
        container.appendChild(row);
    });
    // Écouteurs
    container.querySelectorAll('.buy-classic').forEach(btn => {
        btn.addEventListener('click', () => { if (buyUpgrade(btn.dataset.id)) updateUI(); });
    });
    container.querySelectorAll('.boost-deuterium').forEach(btn => {
        btn.addEventListener('click', () => { if (boostUpgradeWithDeuterium(btn.dataset.id)) updateUI(); });
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
                <div class="upgrade-name-line">${eu.name}</div>
                <div class="upgrade-level-line">Niv. ${eu.level}</div>
                <div class="upgrade-desc-line">${eu.getDescription()}</div>
            </div>
            <div class="upgrade-cost"><span class="cost-energy"></span></div>
            <button class="upgrade-buy buy-energy" data-id="${eu.id}">Acheter</button>
        `;
        container.appendChild(row);
    });
    container.querySelectorAll('.buy-energy').forEach(btn => {
        btn.addEventListener('click', () => {
            const eu = energyUpgradesData.find(u => u.id === btn.dataset.id);
            if (eu && eu.buy()) updateUI();
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
                <div class="upgrade-name-line">${tu.name}</div>
                <div class="upgrade-level-line">Niv. ${tu.level}</div>
                <div class="upgrade-desc-line">${tu.getDescription()}</div>
            </div>
            <div class="upgrade-cost"><span class="cost-titanite"></span></div>
            <button class="upgrade-buy buy-titanite" data-id="${tu.id}">Acheter</button>
        `;
        container.appendChild(row);
    });
    container.querySelectorAll('.buy-titanite').forEach(btn => {
        btn.addEventListener('click', () => {
            const tu = titaniteUpgradesData.find(u => u.id === btn.dataset.id);
            if (tu && tu.buy()) updateUI();
        });
    });
}

function fillAutomationGrid() {
    const container = document.getElementById('automationGrid');
    container.innerHTML = '';
    automations.forEach(auto => {
        const row = document.createElement('div');
        row.className = 'automation-row';
        row.innerHTML = `
            <div class="automation-info">
                <div class="automation-name">${auto.name}</div>
                <div class="automation-cost">${auto.desc}</div>
                <div class="automation-status" id="autoStatus_${auto.id}"></div>
            </div>
            <div class="automation-actions">
                <button class="automation-buy-btn" id="autoBuy_${auto.id}" data-id="${auto.id}">Débloquer</button>
                <button class="automation-toggle-btn" id="autoToggle_${auto.id}" data-id="${auto.id}" style="display:none;">Activer</button>
            </div>
        `;
        container.appendChild(row);
    });
    // Écouteurs
    container.querySelectorAll('.automation-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => { if (buyAutomation(btn.dataset.id)) updateUI(); });
    });
    container.querySelectorAll('.automation-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => { if (toggleAutomation(btn.dataset.id)) updateUI(); });
    });
}

// Gestion des onglets
function setupTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// Fonctions d'achat de mines
function buyCrystalMine() {
    const cost = getCostCrystalMine();
    if (resources.crystal.lt(cost)) return;
    resources.crystal = resources.crystal.sub(cost);
    minesCount.crystal++;
    recalcProduction();
    checkDeuteriumUnlock();
    updateUI();
}

function buyMetalMine() {
    const cost = getCostMetalMine();
    if (resources.metal.lt(cost)) return;
    resources.metal = resources.metal.sub(cost);
    minesCount.metal++;
    recalcProduction();
    checkDeuteriumUnlock();
    updateUI();
}

function buyDeuteriumMine() {
    if (!deuteriumUnlocked) return;
    const cost = getCostDeuteriumMine();
    if (resources.crystal.lt(cost.crystal) || resources.metal.lt(cost.metal)) return;
    resources.crystal = resources.crystal.sub(cost.crystal);
    resources.metal = resources.metal.sub(cost.metal);
    minesCount.deuterium++;
    recalcProduction();
    updateUI();
}

function buyTitaniteMine() {
    if (!titaniteUnlocked) return;
    const cost = getCostTitaniteMine();
    if (resources.crystal.lt(cost.crystal) || resources.metal.lt(cost.metal) || resources.deuterium.lt(cost.deuterium)) return;
    resources.crystal = resources.crystal.sub(cost.crystal);
    resources.metal = resources.metal.sub(cost.metal);
    resources.deuterium = resources.deuterium.sub(cost.deuterium);
    minesCount.titanite++;
    recalcProduction();
    updateUI();
}

function upgradeDeuteriumStorageAction() {
    if (upgradeDeuteriumStorage()) updateUI();
}

function generateCostTable() {
    const COST_GROWTH = 1.15;
    const BASE_COST_CRYSTAL = 10;
    const BASE_COST_METAL = 10;
    const BASE_COST_DEUTERIUM = { crystal: 100, metal: 50 };
    const BASE_COST_TITANITE = { crystal: 500, metal: 250, deuterium: 100 };

    // Fonction utilitaire pour calculer un coût formaté
    function cost(base, growth, level) {
        return Decimal.floor(new Decimal(base).times(Decimal.pow(growth, level)));
    }

    let html = '';

    // --- Mines ---
    html += '<h4>Mines</h4><table><tr><th>Niveau</th><th>Cristal (💎)</th><th>Métal (⚙️)</th><th>Deutérium (💧/⚙️)</th><th>Titanite (💎/⚙️/💧)</th></tr>';
    for (let n = 0; n < 50; n++) {
        const c = cost(BASE_COST_CRYSTAL, COST_GROWTH, n);
        const m = cost(BASE_COST_METAL, COST_GROWTH, n);
        const dC = cost(BASE_COST_DEUTERIUM.crystal, COST_GROWTH, n);
        const dM = cost(BASE_COST_DEUTERIUM.metal, COST_GROWTH, n);
        const tC = cost(BASE_COST_TITANITE.crystal, COST_GROWTH, n);
        const tM = cost(BASE_COST_TITANITE.metal, COST_GROWTH, n);
        const tD = cost(BASE_COST_TITANITE.deuterium, COST_GROWTH, n);
        html += `<tr>
            <td>${n}</td>
            <td>${formatNumber(c)}</td>
            <td>${formatNumber(m)}</td>
            <td>${formatNumber(dC)} / ${formatNumber(dM)}</td>
            <td>${formatNumber(tC)} / ${formatNumber(tM)} / ${formatNumber(tD)}</td>
        </tr>`;
    }
    html += '</table>';

    // --- Améliorations classiques ---
    if (typeof upgradesData !== 'undefined') {
        upgradesData.forEach(up => {
            if (up.baseCostCrystal === undefined && up.baseCostMetal === undefined) return;
            html += `<h4>${up.name}</h4><table><tr><th>Niveau</th><th>Cristal</th><th>Métal</th></tr>`;
            for (let level = 0; level < 50; level++) {
                if (level >= up.maxLevel) break; // s'arrêter au niveau max
                const cCost = cost(up.baseCostCrystal, up.costMult, level);
                const mCost = cost(up.baseCostMetal, up.costMult, level);
                html += `<tr><td>${level}</td><td>${formatNumber(cCost)}</td><td>${formatNumber(mCost)}</td></tr>`;
            }
            html += '</table>';
        });
    }

    // --- Améliorations énergétiques ---
    if (typeof energyUpgradesData !== 'undefined') {
        energyUpgradesData.forEach(eu => {
            html += `<h4>${eu.name} (coût en ⚡)</h4><table><tr><th>Niveau</th><th>Énergie</th></tr>`;
            for (let level = 0; level < 50; level++) {
                if (level >= eu.maxLevel) break;
                const eCost = cost(eu.baseCost, eu.costMult, level);
                html += `<tr><td>${level}</td><td>${formatNumber(eCost)}</td></tr>`;
            }
            html += '</table>';
        });
    }

    // --- Améliorations Titanite ---
    if (typeof titaniteUpgradesData !== 'undefined') {
        titaniteUpgradesData.forEach(tu => {
            html += `<h4>${tu.name} (coût en 🔶)</h4><table><tr><th>Niveau</th><th>Titanite</th></tr>`;
            for (let level = 0; level < 50; level++) {
                if (level >= tu.maxLevel) break;
                const tCost = cost(tu.baseCost, tu.costMult, level);
                html += `<tr><td>${level}</td><td>${formatNumber(tCost)}</td></tr>`;
            }
            html += '</table>';
        });
    }

    return html;
}

function showCostTableOverlay() {
    const content = document.getElementById('costTableContent');
    if (content) {
        content.innerHTML = generateCostTable();
    }
    document.getElementById('costTableOverlay').style.display = 'flex';
}

function updateTabsVisibility() {
    const tabEnergy = document.getElementById('tab-btn-energy') || document.querySelector('.tab-btn[data-tab="tab-energy"]');
    const tabTitanite = document.getElementById('tab-btn-titanite') || document.querySelector('.tab-btn[data-tab="tab-titanite"]');

    if (tabEnergy) {
        tabEnergy.style.display = deuteriumUnlocked ? '' : 'none';
    }
    if (tabTitanite) {
        tabTitanite.style.display = titaniteUnlocked ? '' : 'none';
    }

    // Si l'onglet actif est caché, basculer sur l'onglet de base
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.style.display === 'none') {
        const firstTab = document.getElementById('tab-btn-basic') || document.querySelector('.tab-btn[data-tab="tab-basic"]');
        if (firstTab) {
            // Simuler un clic sur le premier onglet
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            firstTab.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById('tab-basic');
            if (targetPanel) targetPanel.classList.add('active');
        }
    }
}

// Mise à jour générale de l'interface
function updateUI() {
    // --- Ressources dans la barre supérieure ---
    document.getElementById('crystalAmount').textContent = formatNumber(resources.crystal);
    document.getElementById('metalAmount').textContent = formatNumber(resources.metal);
    document.getElementById('crystalRate').textContent = `+${formatNumber(crystalProduction)}/sec`;
    document.getElementById('metalRate').textContent = `+${formatNumber(metalProduction)}/sec`;

    const deutItem = document.getElementById('deutResItem');
    const energyItem = document.getElementById('energyResItem');
    const titaniteItem = document.getElementById('titaniteResItem');
    updateTabsVisibility()
    if (deuteriumUnlocked) {
        deutItem.style.display = '';
        const netDeut = deuteriumProduction.sub(deuteriumConsumption);
        document.getElementById('deuteriumAmount').textContent = formatNumber(resources.deuterium);
        document.getElementById('deuteriumRate').textContent = `${netDeut.gte(0) ? '+' : ''}${formatNumber(netDeut)}/sec`;
    } else {
        deutItem.style.display = 'none';
    }

    if (powerPlantLevel > 0) {
        energyItem.style.display = '';
        document.getElementById('energyAmount').textContent = formatNumber(resources.energy);
        document.getElementById('energyRate').textContent = `+${formatNumber(energyProduction)}/sec`;
    } else {
        energyItem.style.display = 'none';
    }

    if (titaniteUnlocked) {
        titaniteItem.style.display = '';
        document.getElementById('titaniteAmount').textContent = formatNumber(resources.titanite);
        document.getElementById('titaniteRate').textContent = `+${formatNumber(titaniteProduction)}/sec`;
    } else {
        titaniteItem.style.display = 'none';
    }

    // --- Onglet 1 : Mines de base ---
    document.getElementById('mineCountCrystal').textContent = 'Niv. '+minesCount.crystal;
    document.getElementById('mineCountMetal').textContent = 'Niv. '+minesCount.metal;
    document.getElementById('costCrystalDisplay').textContent = formatCost('crystal', getCostCrystalMine());
    document.getElementById('costMetalDisplay').textContent = formatCost('metal', getCostMetalMine());
    document.getElementById('buyCrystalBtn').disabled = resources.crystal.lt(getCostCrystalMine());
    document.getElementById('buyMetalBtn').disabled = resources.metal.lt(getCostMetalMine());

    // Deutérium
    const deutMineRow = document.getElementById('deuteriumMineRow');
    if (deuteriumUnlocked) {
        deutMineRow.style.display = '';
        document.getElementById('mineCountDeuterium').textContent = 'Niv. '+minesCount.deuterium;
        const costD = getCostDeuteriumMine();
        document.getElementById('costDeuteriumDisplay').textContent = `${formatCost('crystal', costD.crystal)} ${formatCost('metal', costD.metal)}`;
        document.getElementById('buyDeuteriumBtn').disabled = resources.crystal.lt(costD.crystal) || resources.metal.lt(costD.metal);
    } else {
        deutMineRow.style.display = 'none';
    }

    // Améliorations classiques
    const classicContainer = document.getElementById('classicUpgrades');
    if (classicContainer) {
        Array.from(classicContainer.children).forEach((row, i) => {
            if (i >= upgradesData.length) return;
            const up = upgradesData[i];
            const costs = getUpgradeCosts(up);
            const maxLvl = up.maxLevel;
            const canBuy = up.level < maxLvl && resources.crystal.gte(costs.crystal) && resources.metal.gte(costs.metal);
            const reduction = getEnergyUpgradeEffect('deuteriumOptimization');
            const boostCost = new Decimal(up.deuteriumBoostCost).times(Decimal.pow(2, up.deuteriumBoostLevel)).times(1 - reduction);
            const canBoost = deuteriumUnlocked && resources.deuterium.gte(boostCost);

            let lvlText = `Niv. ${up.level}/${maxLvl}`;

            if (deuteriumUnlocked) lvlText += ` (Boost ${up.deuteriumBoostLevel})`;

            row.querySelector('.upgrade-name-line').textContent = up.name;
            row.querySelector('.upgrade-level-line').textContent = lvlText;
            row.querySelector('.upgrade-desc-line').textContent = up.getDescription();
            row.querySelector('.cost-crystal').textContent = costs.crystal.gt(0) ? formatCost('crystal', costs.crystal) : '';
            row.querySelector('.cost-metal').textContent = costs.metal.gt(0) ? formatCost('metal', costs.metal) : '';

            const buyBtn = row.querySelector('.buy-classic');
            if (buyBtn) {
                buyBtn.disabled = !canBuy;
                buyBtn.textContent = up.level >= maxLvl ? 'MAX' : 'Acheter';
            }
            const boostBtn = row.querySelector('.boost-deuterium');
            if (boostBtn) {
                boostBtn.style.display = deuteriumUnlocked ? '' : 'none';
                boostBtn.disabled = !canBoost;
                boostBtn.textContent = `Boost (${formatCost('deuterium', boostCost)})`;
            }
        });
    }

    // --- Onglet 2 : Énergie & Deutérium ---
    const deutSection = document.getElementById('deutSection');
    const centraleSection = document.getElementById('centraleSection');
    const energyUpSection = document.getElementById('energyUpgradesSection');

    if (deuteriumUnlocked) {
        deutSection.style.display = '';
        document.getElementById('storageLevelText').textContent = `Niv. ${deuteriumStorageLevel}`;
        document.getElementById('storageMaxLevel').textContent = getMaxDeuteriumLevel();
        document.getElementById('storageCapacityText').textContent = formatNumber(getMaxDeuterium());
        const storageBtn = document.getElementById('upgradeStorageBtn');
        if (deuteriumStorageLevel < getMaxDeuteriumLevel()) {
            const cost = getStorageUpgradeCost();
            storageBtn.style.display = '';
            storageBtn.textContent = `Améliorer (${formatCost('crystal', cost.crystal)} ${formatCost('metal', cost.metal)})`;
            storageBtn.disabled = !(resources.crystal.gte(cost.crystal) && resources.metal.gte(cost.metal));
        } else {
            storageBtn.style.display = 'none';
        }
    } else {
        deutSection.style.display = 'none';
    }

    if (deuteriumStorageLevel >= 10 || powerPlantLevel > 0) {
        centraleSection.style.display = '';
        document.getElementById('powerPlantLevel').textContent = powerPlantLevel;
        document.getElementById('powerPlantMaxLevel').textContent = getMaxPowerPlantLevel();
        document.getElementById('deuteriumConsume').textContent = formatNumber(getDeuteriumConsumption());
        document.getElementById('energyProd').textContent = formatNumber(getEnergyProduction());
        const buyBtn = document.getElementById('buyPowerPlantBtn');
        if (powerPlantLevel < getMaxPowerPlantLevel()) {
            const cost = getPowerPlantCost();
            buyBtn.style.display = '';
            buyBtn.textContent = `Améliorer (${formatCost('crystal', cost.crystal)} ${formatCost('metal', cost.metal)})`;
            buyBtn.disabled = !(resources.crystal.gte(cost.crystal) && resources.metal.gte(cost.metal));
        } else {
            buyBtn.style.display = 'none';
        }
        document.getElementById('downgradePowerPlantBtn').style.display = powerPlantLevel > 0 ? '' : 'none';
        document.getElementById('powerAlarm').style.display = (resources.deuterium.eq(0) && powerPlantLevel > 0) ? '' : 'none';
        energyUpSection.style.display = (powerPlantLevel > 0) ? '' : 'none';
    } else {
        centraleSection.style.display = 'none';
        energyUpSection.style.display = 'none';
    }

    // Améliorations énergétiques
    if (powerPlantLevel > 0) {
        const energyContainer = document.getElementById('energyUpgradesContainer');
        if (energyContainer) {
            Array.from(energyContainer.children).forEach((row, i) => {
                if (i >= energyUpgradesData.length) return;
                const eu = energyUpgradesData[i];
                const maxed = eu.level >= eu.maxLevel;
                const cost = maxed ? new Decimal(0) : new Decimal(eu.baseCost).times(Decimal.pow(eu.costMult, eu.level)).floor();
                const canAfford = resources.energy.gte(cost);
                row.querySelector('.upgrade-name-line').textContent = eu.name;
                row.querySelector('.upgrade-level-line').textContent = `Niv. ${eu.level}`;
                row.querySelector('.upgrade-desc-line').textContent = eu.getDescription();
                row.querySelector('.cost-energy').textContent = maxed ? 'MAX' : formatCost('energy', cost);
                const buyBtn = row.querySelector('.buy-energy');
                if (buyBtn) {
                    buyBtn.disabled = maxed || !canAfford;
                    buyBtn.textContent = maxed ? 'OK' : 'Acheter';
                }
            });
        }
    }

    // --- Onglet 3 : Titanite & Automatisation ---
    const titaniteMineSection = document.getElementById('titaniteMineSection');
    const titaniteUpSection = document.getElementById('titaniteUpgradesSection');
    const autoSection = document.getElementById('automationSection');

    if (titaniteUnlocked) {
        titaniteMineSection.style.display = '';
        document.getElementById('mineCountTitanite').textContent = 'Niv. '+minesCount.titanite;
        const costT = getCostTitaniteMine();
        document.getElementById('costTitaniteDisplay').textContent = `${formatCost('crystal', costT.crystal)} ${formatCost('metal', costT.metal)} ${formatCost('deuterium', costT.deuterium)}`;
        document.getElementById('buyTitaniteBtn').disabled = resources.crystal.lt(costT.crystal) || resources.metal.lt(costT.metal) || resources.deuterium.lt(costT.deuterium);

        titaniteUpSection.style.display = '';
        const titaniteContainer = document.getElementById('titaniteUpgradesContainer');
        if (titaniteContainer) {
            Array.from(titaniteContainer.children).forEach((row, i) => {
                if (i >= titaniteUpgradesData.length) return;
                const tu = titaniteUpgradesData[i];
                const maxed = tu.level >= tu.maxLevel;
                const cost = maxed ? new Decimal(0) : new Decimal(tu.baseCost).times(Decimal.pow(tu.costMult, tu.level)).floor();
                const canAfford = resources.titanite.gte(cost);
                row.querySelector('.upgrade-name-line').textContent = tu.name;
                row.querySelector('.upgrade-level-line').textContent = `Niv. ${tu.level}`;
                row.querySelector('.upgrade-desc-line').textContent = tu.getDescription();
                row.querySelector('.cost-titanite').textContent = maxed ? 'MAX' : formatCost('titanite', cost);
                const buyBtn = row.querySelector('.buy-titanite');
                if (buyBtn) {
                    buyBtn.disabled = maxed || !canAfford;
                    buyBtn.textContent = maxed ? 'OK' : 'Acheter';
                }
            });
        }

        autoSection.style.display = '';
        automations.forEach(auto => {
            const buyBtn = document.getElementById(`autoBuy_${auto.id}`);
            const toggleBtn = document.getElementById(`autoToggle_${auto.id}`);
            //const statusEl = document.getElementById(`autoStatus_${auto.id}`);
            if (!buyBtn || !toggleBtn ) return;
            if (auto.unlocked) {
                buyBtn.style.display = 'none';
                toggleBtn.style.display = '';
                toggleBtn.textContent = auto.active ? 'Désactiver' : 'Activer';
                toggleBtn.classList.toggle('active', auto.active);
                //statusEl.textContent = '';
            } else {
                buyBtn.style.display = '';
                toggleBtn.style.display = 'none';
                buyBtn.textContent = `Débloquer (${formatCost('energy', auto.costEnergy)} ${formatCost('titanite', auto.costTitanite)})`;
                buyBtn.disabled = resources.energy.lt(auto.costEnergy) || resources.titanite.lt(auto.costTitanite);
                //statusEl.textContent = `Coût : ${formatCost('energy', auto.costEnergy)} ${formatCost('titanite', auto.costTitanite)}`;
            }
        });
    } else {
        titaniteMineSection.style.display = 'none';
        titaniteUpSection.style.display = 'none';
        autoSection.style.display = 'none';
    }

    updateSaveInfo();
    updateAchievementsOverlay();
}

function updateSaveInfo() {
    const info = document.getElementById('saveInfo');
    if (info) {
        if (lastSaveTimestamp) {
            info.textContent = `Dernière sauvegarde : ${new Date(lastSaveTimestamp).toLocaleTimeString()}`;
        } else {
            info.textContent = 'Aucune sauvegarde récente.';
        }
    }
}

function updateAchievementsOverlay() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = achievements.map(a => `
        <div class="achievement-item ${a.unlocked ? '' : 'locked'}">
            <span>${a.unlocked ? '✅' : '🔒'} <span class="ach-name">${a.name}</span> - ${a.desc}</span>
        </div>
    `).join('');
    document.getElementById('achievementPointsDisplay').textContent = achievementPoints;
}

function showAchievementToast(achievement) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Limite à 5 toasts : supprimer le plus ancien si nécessaire
    const toasts = container.querySelectorAll('.toast');
    if (toasts.length >= 5) {
        toasts[0].remove(); // le plus ancien (en bas du flex column-reverse, le premier élément DOM est le plus ancien)
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>🏆 <strong>${achievement.name}</strong><br><small>${achievement.desc}</small></span>
        <button class="toast-close">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    container.appendChild(toast);
}

// Événements globaux (sauvegarde)
function initGlobalEvents() {
    const floatingBtn = document.getElementById('saveFloatingBtn');
    const overlay = document.getElementById('saveOverlay');
    const closeBtn = document.getElementById('closeOverlayBtn');
    if (floatingBtn && overlay && closeBtn) {
        floatingBtn.addEventListener('click', () => { overlay.style.display = 'flex'; updateSaveInfo(); });
        closeBtn.addEventListener('click', () => overlay.style.display = 'none');
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
    }

    document.getElementById('saveBtn')?.addEventListener('click', () => {
        saveToLocalStorage();
        lastSaveTimestamp = Date.now();
        updateSaveInfo();
        updateUI();
    });
    document.getElementById('loadBtn')?.addEventListener('click', () => {
        if (loadFromLocalStorage()) {
            lastSaveTimestamp = Date.now();
            updateUI();
            updateSaveInfo();
        } else alert('Aucune sauvegarde trouvée.');
    });
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const data = getSaveData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'mines-corps-save.json';
        a.click();
    });
    document.getElementById('importBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile')?.addEventListener('change', (e) => {
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
            } catch (ex) { alert('Erreur de lecture.'); }
        };
        reader.readAsText(file);
    });
    document.getElementById('resetBtn')?.addEventListener('click', () => {
        if (confirm('Réinitialiser ?')) {
            resetGame();
            lastSaveTimestamp = null;
            updateUI();
            updateSaveInfo();
        }
    });
    // Bouton succès
    const achFloatingBtn = document.getElementById('achievementsFloatingBtn');
    const achOverlay = document.getElementById('achievementsOverlay');
    const closeAchBtn = document.getElementById('closeAchievementsBtn');
    const achBtn = document.getElementById('achievementsFloatingBtn');
    achBtn.classList.remove('rgb-flash');
    clearTimeout(achBtn._flashTimeout);
    achFloatingBtn.addEventListener('click', () => { achOverlay.style.display = 'flex'; updateAchievementsOverlay(); });
    closeAchBtn.addEventListener('click', () => achOverlay.style.display = 'none');
    achFloatingBtn.addEventListener('click', () => {
        achOverlay.style.display = 'flex';
        updateAchievementsOverlay();
        achBtn.classList.remove('rgb-flash');
        clearTimeout(achBtn._flashTimeout);
    });
    // Tableau des coûts
    const costBtn = document.getElementById('costTableFloatingBtn');
    const costOverlay = document.getElementById('costTableOverlay');
    const closeCostBtn = document.getElementById('closeCostTableBtn');
    costBtn.addEventListener('click', () => {
        showCostTableOverlay();
    });
    closeCostBtn.addEventListener('click', () => costOverlay.style.display = 'none');
    costOverlay.addEventListener('click', (e) => {
        if (e.target === costOverlay) costOverlay.style.display = 'none';
    });
}