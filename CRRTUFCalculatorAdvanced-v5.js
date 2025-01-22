
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
