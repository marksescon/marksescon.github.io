document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("input, select");
    const shiftType = document.getElementById("shiftType");
    const magnitudeSliderContainer = document.getElementById("magnitudeSliderContainer");
    const magnitudeSlider = document.getElementById("magnitudeSlider");
    const magnitudeValue = document.getElementById("magnitudeValue");

    // Attach input listeners for real-time updates
    inputs.forEach(input => input.addEventListener("input", updateCalculations));
    shiftType.addEventListener("change", toggleMagnitudeSlider);
    magnitudeSlider.addEventListener("input", function () {
        magnitudeValue.innerText = `${magnitudeSlider.value}%`;
        updateCalculations();
    });

    // Toggle magnitude slider based on shift type
    function toggleMagnitudeSlider() {
        if (shiftType.value === "day") {
            magnitudeSliderContainer.style.display = "block";
        } else {
            magnitudeSliderContainer.style.display = "none";
        }
        updateCalculations();
    }

    // Update calculations dynamically
    function updateCalculations() {
        const currentBalance = parseFloat(document.getElementById("currentBalance").value) || 0;
        const netGoal24hr = parseFloat(document.getElementById("netGoal24hr").value) || 0;
        const primaryIVRate = parseFloat(document.getElementById("primaryIVRate").value) || 0;
        const secondaryIV = parseFloat(document.getElementById("secondaryIV").value) || 0;
        const enteralRate = parseFloat(document.getElementById("enteralRate").value) || 0;

        // Get current time and calculate remaining time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        let remainingHours, remainingMinutes;

        if (shiftType.value === "day") {
            remainingHours = 19 - currentHour; // Day shift ends at 7 PM
        } else {
            remainingHours = currentHour < 7 ? 7 - currentHour : 31 - currentHour; // Night shift ends at 7 AM
        }

        remainingMinutes = 60 - currentMinute;
        if (remainingMinutes === 60) {
            remainingMinutes = 0;
        } else {
            remainingHours -= 1;
        }

        if (remainingHours < 0) remainingHours = 0;
        if (remainingMinutes < 0) remainingMinutes = 0;

        // Update time remaining display
        document.getElementById("remainingHoursDisplay").innerText = remainingHours;
        document.getElementById("remainingMinutesDisplay").innerText = remainingMinutes;

        const totalRemainingTime = remainingHours + remainingMinutes / 60;

        // Calculate Remaining Goal
        const remainingGoal = netGoal24hr - currentBalance;

        // Calculate Shift Goal
        let shiftGoal;
        if (shiftType.value === "day") {
            const magnitudePercentage = parseFloat(magnitudeSlider.value);
            shiftGoal = (netGoal24hr * magnitudePercentage / 100) - currentBalance;
        } else {
            const dayShiftGoal = netGoal24hr * parseFloat(magnitudeSlider.value) / 100;
            shiftGoal = remainingGoal - dayShiftGoal;
        }

        // Calculate Predicted Intake
        const predictedIntake = (primaryIVRate + enteralRate) * totalRemainingTime + secondaryIV;

        // Calculate Gross Output Needed
        const grossOutput = predictedIntake - shiftGoal;

        // Calculate Suggested UF Rate
        let ufRate = grossOutput / totalRemainingTime;
        if (ufRate < 0) ufRate = 0;

        // Update output fields
        document.getElementById("remainingGoal").innerText = remainingGoal.toFixed(2);
        document.getElementById("shiftGoal").innerText = shiftGoal.toFixed(2);
        document.getElementById("predictedIntake").innerText = predictedIntake.toFixed(2);
        document.getElementById("grossOutput").innerText = grossOutput.toFixed(2);
        document.getElementById("ufRate").innerText = ufRate.toFixed(2);
    }

    // Reset functionality
    document.getElementById("resetButton").addEventListener("click", function () {
        inputs.forEach(input => input.value = "");
        shiftType.value = "day";
        magnitudeSlider.value = 50;
        magnitudeValue.innerText = "50%";
        magnitudeSliderContainer.style.display = "block";

        document.getElementById("remainingHoursDisplay").innerText = "0";
        document.getElementById("remainingMinutesDisplay").innerText = "0";
        document.getElementById("remainingGoal").innerText = "0.00";
        document.getElementById("shiftGoal").innerText = "0.00";
        document.getElementById("predictedIntake").innerText = "0.00";
        document.getElementById("grossOutput").innerText = "0.00";
        document.getElementById("ufRate").innerText = "0.00";
    });

    // Initialize state
    toggleMagnitudeSlider();
});