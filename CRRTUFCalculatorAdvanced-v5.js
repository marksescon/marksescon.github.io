// Attach input listeners for all fields
const inputs = document.querySelectorAll("input, select");
inputs.forEach(input => input.addEventListener("input", updateCalculations));

// Update calculations dynamically
function updateCalculations() {
    // Get inputs
    const startingBalance = parseFloat(document.getElementById("startingBalance").value) || 0;
    const netGoal24hr = parseFloat(document.getElementById("netGoal24hr").value) || 0;
    const shiftType = document.getElementById("shiftType").value;
    const remainingHours = parseFloat(document.getElementById("remainingHours").value) || 12;
    const remainingMinutes = parseFloat(document.getElementById("remainingMinutes").value) || 0;
    const primaryIVRate = parseFloat(document.getElementById("primaryIVRate").value) || 0;
    const secondaryIV = parseFloat(document.getElementById("secondaryIV").value) || 0;
    const enteralFluids = parseFloat(document.getElementById("enteralFluids").value) || 0;
    const urineOutput = parseFloat(document.getElementById("urineOutput").value) || 0;
    const ngtOutputRate = parseFloat(document.getElementById("ngtOutputRate").value) || 0;
    const drainOutputRate = parseFloat(document.getElementById("drainOutputRate").value) || 0;

    // Convert hours and minutes to fractional hours
    const totalRemainingTime = remainingHours + remainingMinutes / 60;

    // Calculate Shift Goal
    let shiftGoal;
    if (shiftType === "day") {
        shiftGoal = (netGoal24hr / 2) - startingBalance;
    } else {
        shiftGoal = netGoal24hr - startingBalance;
    }

    // Calculate Predicted Intake
    const predictedIntake = (primaryIVRate + enteralFluids) * totalRemainingTime + secondaryIV;

    // Calculate Total Output
    const totalOutput = (urineOutput * totalRemainingTime) + (ngtOutputRate * totalRemainingTime) + (drainOutputRate * totalRemainingTime);

    // Calculate Gross Output Needed
    const grossOutput = predictedIntake - shiftGoal - totalOutput;

    // Calculate UF Rate
    const ufRate = grossOutput / totalRemainingTime;

    // Update results dynamically
    document.getElementById("shiftGoal").innerText = shiftGoal.toFixed(2);
    document.getElementById("predictedIntake").innerText = predictedIntake.toFixed(2);
    document.getElementById("totalOutput").innerText = totalOutput.toFixed(2);
    document.getElementById("grossOutput").innerText = grossOutput.toFixed(2);
    document.getElementById("ufRate").innerText = ufRate.toFixed(2);
}

// Reset functionality
document.getElementById("resetButton").addEventListener("click", function () {
    // Reset all input fields
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = "";
    });

    // Reset dropdown selection
    const shiftType = document.getElementById("shiftType");
    shiftType.value = "day"; // Default to "day shift"

    // Clear the output section
    document.getElementById("shiftGoal").innerText = "0.00";
    document.getElementById("predictedIntake").innerText = "0.00";
    document.getElementById("totalOutput").innerText = "0.00";
    document.getElementById("grossOutput").innerText = "0.00";
    document.getElementById("ufRate").innerText = "0.00";

    console.log("All fields and outputs have been reset.");
});
