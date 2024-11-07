let gold = 100;
let foodConsumption = 0;

// Global variable to store the current sell amount (1, 10, 100, 1000)
let sellAmount = 10; // Default value is 10

class Resource {
  constructor(resource, worker, scalingMod, workerAmount, cap, cost, sellValue, upgradeConst) {
    this.resource = resource;
    this.worker = worker;
    this.scalingMod = scalingMod;
    this.workerAmount = workerAmount;
    this.cap = cap;
    this.cost = cost;
    this.amount = 0;
    this.sellValue = sellValue;
    this.upgradeConst = upgradeConst;
    this.upgradeMult = 1;
    this.upgradeCost = 20;
  }

  manualGathering() {
    this.amount += 1;
  }

  workerProduction() {
    this.amount += this.workerAmount * this.upgradeMult;
  }

  increaseCost() {
    this.cost = Math.floor(this.cost * this.scalingMod);
  }

  hireWorker() {
    if (gold >= this.cost) {
      this.workerAmount += 1;
      gold -= this.cost;
      this.increaseCost();
      document.getElementById("gold").innerHTML = gold;
      foodConsumption += 1;
      return true;
    }
    return false;
  }

  // Updated sell function to use the global sellAmount
  sell() {
    if (this.amount >= sellAmount) {
      this.amount -= sellAmount;
      gold += sellAmount * this.sellValue;
      document.getElementById("gold").innerHTML = gold;
      return true;
    }
    return false;
  }

  upgradeConstUpdate() {
    if (gold >= this.upgradeCost) {
      this.upgradeMult += 1; // Increase the upgrade multiplier
      gold -= this.upgradeCost; // Deduct the gold for the upgrade
      this.upgradePrice(); // Update the cost for the next upgrade
      document.getElementById("gold").innerHTML = gold;
      return true;
    }
    return false;
  }

  upgradePrice() {
    this.upgradeCost *= 2; // Increase the cost for the next upgrade
  }
}

// Create resource instances
const resources = [
  new Resource("wood", "lumberjack", 1.2, 0, 200, 10, 5),
  new Resource("stone", "miner", 1.5, 0, 200, 10, 10),
  new Resource("grain", "farmer", 1.3, 0, 500, 5, 1)
];

// Update HTML with resource values
function updateResourceDisplay() {
  resources.forEach((resource) => {
    const resourceAmountElement = document.getElementById(`${resource.resource}Amount`);
    if (resourceAmountElement) {
      resourceAmountElement.innerText = `${resource.amount} / ${resource.cap}`;
    } else {
      // Create and append resource elements if they don't exist yet
      const resourceElement = document.createElement("div");
      resourceElement.className = "banner-box";
      resourceElement.id = `${resource.resource}AmountBox`;
      resourceElement.innerHTML = `${resource.resource.charAt(0).toUpperCase() + resource.resource.slice(1)}: <span id="${resource.resource}Amount">${resource.amount} / ${resource.cap}</span>`;
      document.querySelector(".banner").appendChild(resourceElement);
    }
  });
}

window.onload = function () {
  // Set the initial gold display
  document.getElementById("gold").innerHTML = gold;

  // Dynamically add resources to the banner
  resources.forEach((resource) => {
    let resourceBox = document.getElementById(`${resource.resource}AmountBox`);
    if (!resourceBox) {
      resourceBox = document.createElement("div");
      resourceBox.className = "banner-box";
      resourceBox.id = `${resource.resource}AmountBox`;

      resourceBox.innerHTML = `${resource.resource.charAt(0).toUpperCase() + resource.resource.slice(1)}: <span id="${resource.resource}Amount">${resource.amount} / ${resource.cap}</span>`;

      document.querySelector(".banner").appendChild(resourceBox);
    }
  });

  // Add the hire worker, small sell, and sell buttons dynamically
  const sidebar = document.getElementById("sidebar");

  // Create the global sell buttons (1, 10, 100, 1000)
  const sellButtonsContainer = document.createElement("div");
  sellButtonsContainer.className = "small-buttons-container";

  const values = [1, 10, 100, 1000];
  values.forEach((value) => {
    const smallButton = document.createElement("button");
    smallButton.className = "small-sell-btn";
    smallButton.innerText = value;
    smallButton.onclick = function () {
      // Set the global sellAmount based on the clicked button
      sellAmount = value;
    };
    sellButtonsContainer.appendChild(smallButton);
  });

  // Add the sell buttons container to the sidebar
  sidebar.appendChild(sellButtonsContainer);

  // Add worker, sell, and upgrade buttons to the sidebar dynamically
  resources.forEach((resource) => {
    const resourceRow = document.createElement("div");
    resourceRow.className = "resource-row";

    // Create the hire worker button
    const hireButton = document.createElement("button");
    hireButton.id = `${resource.resource}btn`;
    hireButton.innerText = `Hire ${resource.worker}, Cost: ${Math.floor(resource.cost)}`;

    hireButton.onclick = function () {
      if (resource.hireWorker()) {
        hireButton.innerText = `Hire ${resource.worker}, Cost: ${Math.floor(resource.cost)}`;
        updateResourceDisplay();
      } else {
        alert("Not enough gold to hire worker.");
      }
    };

    // Create the sell button
    const sellButton = document.createElement("button");
    sellButton.id = `${resource.resource}Sellbtn`;
    sellButton.innerText = `Sell`;

    sellButton.onclick = function () {
      if (resource.sell()) {
        updateResourceDisplay();
      } else {
        alert("Not enough resources to sell.");
      }
    };

    // Create the upgrade button
    const upgradeButton = document.createElement("button");
    upgradeButton.id = `${resource.resource}Upgradebtn`;
    upgradeButton.innerText = `Upgrade Cost: ${Math.floor(resource.upgradeCost)}`;
    
    upgradeButton.onclick = function () {
      if (resource.upgradeConstUpdate()) {
        // After upgrading, update the button text
        updateResourceDisplay(); // Make sure to update the display after upgrade
      } else {
        alert("Not enough gold to upgrade.");
      }
    };

    // Add buttons to the row
    resourceRow.appendChild(hireButton); // Hire button
    resourceRow.appendChild(sellButton); // Sell button
    resourceRow.appendChild(upgradeButton); // Upgrade button

    // Add the resource row to the sidebar
    sidebar.appendChild(resourceRow);
  });

  // Start the interval timer for worker production
  setInterval(() => {
    resources.forEach((resource) => {
      resource.workerProduction();
    });

    updateResourceDisplay(); // Update resource display every second
  }, 1000); // Update every 1000ms (1 second)
};
