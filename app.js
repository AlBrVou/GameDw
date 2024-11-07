var lumberjack = 5
var lumberjackCost = 10
var lumberCap = 50
var wood = 0
const hireLumber = () => {
    if (wood >= lumberjackCost) {
        lumberjack++
        document.getElementById("lumberjacks").innerHTML = lumberjack
        wood = wood - lumberjackCost
        lumberjackCost = Math.round(lumberjackCost*1.1)
        document.getElementById("lumberjackCosts").innerHTML = lumberjackCost
        document.getElementById("wood").innerHTML = wood    

    }
}

const woodManual = () => {
    if (wood < lumberCap) {
        wood++
        document.getElementById("wood").innerHTML = wood    
    }
    
}
const woodps = () => {
    if (wood <= lumberCap) {
    wood = wood + lumberjack
        if (wood > lumberCap) {
            wood = lumberCap
        }
    document.getElementById("wood").innerHTML = wood
    }
    
}
setInterval(woodps, 1000)

document.getElementById("lumberjacksBtn").addEventListener("click", hireLumber)
document.getElementById("harvestBtn").addEventListener("click", woodManual)