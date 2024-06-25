const enhancementTable = [
    { star: 1, cost: 5000, success: 100, maintain: 0, downgrade: 0, destroy: 0 },
    { star: 2, cost: 10000, success: 95, maintain: 5, downgrade: 0, destroy: 0 },
    { star: 3, cost: 20000, success: 90, maintain: 10, downgrade: 0, destroy: 0 },
    { star: 4, cost: 35000, success: 85, maintain: 15, downgrade: 0, destroy: 0 },
    { star: 5, cost: 50000, success: 80, maintain: 20, downgrade: 0, destroy: 0 },
    { star: 6, cost: 80000, success: 75, maintain: 25, downgrade: 0, destroy: 0 },
    { star: 7, cost: 150000, success: 70, maintain: 30, downgrade: 0, destroy: 0 },
    { star: 8, cost: 200000, success: 65, maintain: 35, downgrade: 0, destroy: 0 },
    { star: 9, cost: 300000, success: 60, maintain: 40, downgrade: 0, destroy: 0 },
    { star: 10, cost: 400000, success: 55, maintain: 45, downgrade: 0, destroy: 0 },
    { star: 11, cost: 560000, success: 50, maintain: 40, downgrade: 10, destroy: 0 },
    { star: 12, cost: 640000, success: 45, maintain: 45, downgrade: 10, destroy: 0 },
    { star: 13, cost: 720000, success: 40, maintain: 40, downgrade: 15, destroy: 5 },
    { star: 14, cost: 800000, success: 35, maintain: 45, downgrade: 15, destroy: 5 },
    { star: 15, cost: 1200000, success: 30, maintain: 45, downgrade: 20, destroy: 5 },
    { star: 16, cost: 1600000, success: 25, maintain: 50, downgrade: 20, destroy: 5 },
    { star: 17, cost: 2000000, success: 20, maintain: 50, downgrade: 25, destroy: 5 },
    { star: 18, cost: 2400000, success: 15, maintain: 55, downgrade: 25, destroy: 5 },
    { star: 19, cost: 2800000, success: 10, maintain: 55, downgrade: 30, destroy: 5 },
    { star: 20, cost: 3200000, success: 5, maintain: 60, downgrade: 30, destroy: 5 },
    { star: 21, cost: 3600000, success: 1, maintain: 49, downgrade: 40, destroy: 10 },
    { star: 22, cost: 4000000, success: 1, maintain: 49, downgrade: 40, destroy: 10 },
    { star: 23, cost: 4800000, success: 1, maintain: 49, downgrade: 40, destroy: 10 },
    { star: 24, cost: 5600000, success: 1, maintain: 49, downgrade: 40, destroy: 10 },
    { star: 25, cost: 6400000, success: 1, maintain: 49, downgrade: 40, destroy: 10 },
    { star: 26, cost: 8100000, success: 1, maintain: 39, downgrade: 45, destroy: 15 },
    { star: 27, cost: 9000000, success: 1, maintain: 39, downgrade: 45, destroy: 15 },
    { star: 28, cost: 13500000, success: 1, maintain: 39, downgrade: 45, destroy: 15 },
    { star: 29, cost: 18000000, success: 1, maintain: 39, downgrade: 45, destroy: 15 },
    { star: 30, cost: 20700000, success: 1, maintain: 39, downgrade: 45, destroy: 15 }
];

let history = [];
let totalCost = 0;
let totalEnhanceCount = 0;
let currentStar = 0;
let lastDestructionRate = 0;

document.getElementById('start-enhance').addEventListener('click', function () {
    if (history.length > 0) {
        const lastRecord = history[history.length - 1];
        currentStar = lastRecord.nextStar;
    } else {
        currentStar = parseInt(document.getElementById('start-star').value) || 0;
    }
    const enhanceCount = parseInt(document.getElementById('enhance-count').value) || 0;

    const successBoost = document.getElementById('success-boost').checked;
    const noDowngrade = document.getElementById('no-downgrade').checked;
    const noDestruction = document.getElementById('no-destruction').checked;

    enhanceEquipment(currentStar, enhanceCount, successBoost, noDowngrade, noDestruction);
});

function enhanceEquipment(startStar, count, successBoost, noDowngrade, noDestruction) {
    let currentStar = startStar;
    for (let i = 0; i < count; i++) {
        if (currentStar >= 30) {
            showMaxStarReached();
            break;
        }
        const result = enhanceStep(currentStar, successBoost, noDowngrade, noDestruction);
        currentStar = result.nextStar;
        totalCost += result.cost;
        totalEnhanceCount++;
        addHistory(result);
    }
    updateStatistics();
    document.getElementById('total-cost').innerText = ` ${totalCost.toLocaleString()} 元`;
    document.getElementById('total-enhance-count').innerText = ` ${totalEnhanceCount}`;
}

function enhanceStep(currentStar, successBoost, noDowngrade, noDestruction) {
    const enhanceData = enhancementTable.find(e => e.star === currentStar + 1);
    let successRate = enhanceData.success;
    let downgradeRate = enhanceData.downgrade;
    let destroyRate = enhanceData.destroy;

    if (successBoost) successRate += 5;
    if (noDowngrade) downgradeRate = 0;
    if (noDestruction) destroyRate = 0;

    const random = Math.random() * 100;
    let result = { star: currentStar, cost: enhanceData.cost };

    if (random < successRate) {
        result.type = 'success';
        result.nextStar = currentStar + 1;
    } else if (random < successRate + destroyRate) {
        result.type = 'destroy';
        result.nextStar = currentStar;
    } else if (random < successRate + destroyRate + downgradeRate) {
        result.type = 'downgrade';
        result.nextStar = currentStar - 1;
    } else {
        result.type = 'maintain';
        result.nextStar = currentStar;
    }
    return result;
}

function addHistory(result) {
    const li = document.createElement('li');
    li.classList.add(result.type);
    li.innerText = `${result.star}星裝備強化到${result.nextStar}星 ${result.type === 'success' ? '成功' : result.type === 'maintain' ? '維持' : result.type === 'downgrade' ? '下降' : '破壞'}`;
    document.getElementById('history').appendChild(li);
    history.push(result);
}

function updateStatistics() {
    const successCount = history.filter(h => h.type === 'success').length;
    const maintainCount = history.filter(h => h.type === 'maintain').length;
    const downgradeCount = history.filter(h => h.type === 'downgrade').length;
    const destroyCount = history.filter(h => h.type === 'destroy').length;

    document.getElementById('success-count').innerText = successCount;
    document.getElementById('maintain-count').innerText = maintainCount;
    document.getElementById('downgrade-count').innerText = downgradeCount;
    document.getElementById('destroy-count').innerText = destroyCount;

    const destroyRecords = history.filter(h => h.type === 'destroy' && h.star >= 12);
    const destroyRate = destroyRecords.length / history.filter(h => h.star >= 12).length * 100;

    if (!isNaN(destroyRate)) {
        lastDestructionRate = parseFloat(document.getElementById('destruction-rate').innerText.replace('%', ''));
        document.getElementById('previous-destruction-rate').innerText = ` ${lastDestructionRate.toFixed(2)}%`;
        document.getElementById('destruction-rate').innerText = ` ${destroyRate.toFixed(2)}%`;
    }
}

function showMaxStarReached() {
    document.getElementById('total-enhance-count-modal').innerText = totalEnhanceCount;
    const modal = document.getElementById('max-star-reached');
    modal.style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', function () {
    document.getElementById('max-star-reached').style.display = 'none';
});

document.getElementById('reset-data').addEventListener('click', function () {
    history = [];
    totalCost = 0;
    totalEnhanceCount = 0;
    lastDestructionRate = 0;

    document.getElementById('history').innerHTML = '';
    updateStatistics();
    document.getElementById('total-cost').innerText = ` 0 元`;
    document.getElementById('total-enhance-count').innerText = ` 0`;
    document.getElementById('destruction-rate').innerText = ` 0%`;
    document.getElementById('previous-destruction-rate').innerText = ` 0%`;
});
