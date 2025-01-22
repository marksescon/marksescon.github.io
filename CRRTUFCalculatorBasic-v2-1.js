function updateCalculations() {
    // Get inputs
    const startingBalance = parseFloat(document.getElementById("startingBalance").value) || 0;
    const netGoal24hr = parseFloat(document.getElementById("netGoal24hr").value) || 0;
    const shiftType = document.getElementById("shiftType").value;
    const primaryIVRate = parseFloat(document.getElementById("primaryIVRate").value) || 0;
    const secondaryIV = parseFloat(document.getElementById("secondaryIV").value) || 0;
    const enteralRate = parseFloat(document.getElementById("enteralRate").value) || 0;
    const remainingHours = parseFloat(document.getElementById("remainingHours").value) || 0;
    const remainingMinutes = parseFloat(document.getElementById("remainingMinutes").value) || 0;

    // Convert remaining time to hours
    const totalRemainingTime = remainingHours + (remainingMinutes / 60);

    // Calculate predicted intake
    const predictedIntake = (primaryIVRate + enteralRate) * totalRemainingTime + secondaryIV;

    // Calculate remaining 24-hour goal
    const remainingGoal = netGoal24hr - startingBalance;

    // Determine shift-specific goal
    let shiftGoal;
    if (shiftType === "day") {
        shiftGoal = (netGoal24hr / 2) - startingBalance;
    } else {
        shiftGoal = remainingGoal;
    }

    // Calculate gross CRRT output for the shift
    const grossOutput = predictedIntake - shiftGoal;

    // Calculate suggested UF rate
    let ufRate = grossOutput / totalRemainingTime;

    // Ensure UF rate is not negative
    if (ufRate < 0) {
        ufRate = 0;
    }

    // Update the output fields dynamically
    document.getElementById("predictedIntake").innerText = predictedIntake.toFixed(2);
    document.getElementById("remainingGoal").innerText = remainingGoal.toFixed(2);
    document.getElementById("shiftGoal").innerText = shiftGoal.toFixed(2);
    document.getElementById("grossOutput").innerText = grossOutput.toFixed(2);
    document.getElementById("ufRate").innerText = ufRate.toFixed(2);
}

// Attach event listeners to all input fields
const inputs = document.querySelectorAll("input, select");
inputs.forEach(input => {
    input.addEventListener("input", updateCalculations);
});

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
    document.getElementById("predictedIntake").innerText = "0.00";
    document.getElementById("remainingGoal").innerText = "0.00";
    document.getElementById("shiftGoal").innerText = "0.00";
    document.getElementById("grossOutput").innerText = "0.00";
    document.getElementById("ufRate").innerText = "0.00";
});
