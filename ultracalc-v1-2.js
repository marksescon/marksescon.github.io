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
        const urineOutput = parseFloat(document.getElementById("urineOutput").value) || 0;
        const ngtOutputRate = parseFloat(document.getElementById("ngtOutputRate").value) || 0;
        const drainOutputRate = parseFloat(document.getElementById("drainOutputRate").value) || 0;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        let remainingHours, remainingMinutes;

        if (shiftType.value === "day") {
            remainingHours = 19 - currentHour;
        } else {
            remainingHours = currentHour < 7 ? 7 - currentHour : 31 - currentHour;
        }

        remainingMinutes = 60 - currentMinute;
        if (remainingMinutes === 60) {
            remainingMinutes = 0;
        } else {
            remainingHours -= 1;
        }

        if (remainingHours < 0) remainingHours = 0;
        if (remainingMinutes < 0) remainingMinutes = 0;

        document.getElementById("remainingHoursDisplay").innerText = remainingHours;
        document.getElementById("remainingMinutesDisplay").innerText = remainingMinutes;

        const totalRemainingTime = remainingHours + remainingMinutes / 60;

        const remainingGoal = netGoal24hr - currentBalance;

        let shiftGoal;
        if (shiftType.value === "day") {
            const magnitudePercentage = parseFloat(magnitudeSlider.value);
            shiftGoal = (netGoal24hr * magnitudePercentage / 100) - currentBalance;
        } else {
            const dayShiftGoal = netGoal24hr * parseFloat(magnitudeSlider.value) / 100;
            shiftGoal = remainingGoal - dayShiftGoal;
        }

        const predictedIntake = (primaryIVRate + enteralRate) * totalRemainingTime + secondaryIV;
        const totalOutput = (urineOutput + ngtOutputRate + drainOutputRate) * totalRemainingTime;
        const grossOutput = predictedIntake - shiftGoal - totalOutput;

        let ufRate = grossOutput / totalRemainingTime;
        if (ufRate < 0) ufRate = 0;

        document.getElementById("remainingGoal").innerText = remainingGoal.toFixed(2);
        document.getElementById("shiftGoal").innerText = shiftGoal.toFixed(2);
        document.getElementById("predictedIntake").innerText = predictedIntake.toFixed(2);
        document.getElementById("totalOutput").innerText = totalOutput.toFixed(2);
        document.getElementById("grossOutput").innerText = grossOutput.toFixed(2);
        document.getElementById("ufRate").innerText = ufRate.toFixed(2);
    }

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
        document.getElementById("totalOutput").innerText = "0.00";
        document.getElementById("grossOutput").innerText = "0.00";
        document.getElementById("ufRate").innerText = "0.00";
    });

    toggleMagnitudeSlider();
});
