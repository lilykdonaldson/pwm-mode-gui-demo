document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('globalFrequency').addEventListener('input', updatePairFrequencies);
    document.getElementById('sendSequence').addEventListener('click', sendPulsingSequence);
    const phaseInputs = document.querySelectorAll('input[name$="Phase"]');
    phaseInputs.forEach(input => {
        input.addEventListener('input', restrictPhaseInput);
    });
});

function updatePairFrequencies() {
    var globalFrequency = document.getElementById('globalFrequency').value;
    var pairFrequencies = document.querySelectorAll('.pairFrequency');
    pairFrequencies.forEach(function (freqInput) {
        freqInput.value = globalFrequency;
    });
}

function restrictPhaseInput() {
    if (this.value < 0) this.value = 0;
    if (this.value > 100) this.value = 100;
}

function sendPulsingSequence() {
    const jsonData = document.getElementById('unitModeForm').elements['jsonData'].value;
    alert('Pulsing sequence sent successfully! (Note: This is an online demo which is not connected to a pulsing device.)');
}

document.getElementById('displaySequence').addEventListener('click', function() {
    const existingCanvas = document.getElementById('waveCanvas');
    const existingCloseButton = document.getElementById('closeButton');
    if (existingCanvas) existingCanvas.remove();
    if (existingCloseButton) existingCloseButton.remove();

    const whiteBlueFrequency = document.querySelector('input[name="whiteBlueFrequency"]').value;
    const limeGreenFrequency = document.querySelector('input[name="limeGreenFrequency"]').value;
    const deepRedFarRedFrequency = document.querySelector('input[name="deepRedFarRedFrequency"]').value;

    if (!(whiteBlueFrequency === limeGreenFrequency && limeGreenFrequency === deepRedFarRedFrequency)) {
        alert('All pairs must be at the same frequency to generate a display.');
    } else {
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'canvasContainer';
        canvasContainer.style.position = 'relative';

        const canvas = document.createElement('canvas');
        canvas.id = 'waveCanvas';
        canvas.width = 600;
        canvas.height = 300;
        canvas.style.border = '1px solid #000';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'x';
        closeButton.id = 'closeButton';
        closeButton.addEventListener('click', function() {
            canvasContainer.remove();
        });

        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(closeButton);
        const form = document.getElementById('unitModeForm');
        form.appendChild(canvasContainer);

        const ctx = canvas.getContext('2d');
        canvas.style.backgroundColor = 'black';
        const channelNames = ['white', 'blue', 'lime', 'green', 'deepRed', 'farRed'];
        const bluePhase = parseFloat(document.getElementById("whiteBluePhase").value);
        const redPhase = parseFloat(document.getElementById('deepRedFarRedPhase').value);
        const greenPhase = parseFloat(document.getElementById('limeGreenPhase').value);

        for (const channelName of channelNames) {
            if (document.getElementById(channelName + 'On').checked) {
                const dutyCycle = parseFloat(document.getElementById(channelName + 'DutyCycle').value);
                const waveWidth = (dutyCycle / 100) * canvas.width;

                let phaseShift = 0;
                if (dutyCycle < 100) {
                    if (channelName === 'deepRed' || channelName === 'farRed') {
                        phaseShift = redPhase;
                    } else if (channelName === 'lime' || channelName === 'green') {
                        phaseShift = greenPhase;
                    } else {
                        phaseShift = bluePhase;
                    }
                }

                const shift = (phaseShift / 100) * (canvas.width / 3);

                ctx.fillStyle = channelName === 'deepRed' ? 'red' :
                                channelName === 'farRed' ? 'maroon' : channelName;

                const y = (channelNames.indexOf(channelName) * 50) + 10;
                ctx.fillRect(0 + shift, y, waveWidth / 3, 20);
                ctx.fillRect((canvas.width / 3) + shift, y, waveWidth / 3, 20);
                ctx.fillRect((2 * (canvas.width / 3)) + shift, y, waveWidth / 3, 20);
            }
        }
    }
});

function updateJsonData() {
    const formElements = document.getElementById('unitModeForm').elements;
    const textArea = document.getElementById('jsonData');
    const jsonData = {};

    for (let i = 0; i < formElements.length; i++) {
        const elem = formElements[i];
        if (elem.type !== 'button' && elem.id !== 'jsonData') {
            if (elem.type === 'checkbox' && elem.id.endsWith('On')) {
                const channelName = elem.id.replace('On', '');
                const dutyCycleElement = document.getElementById(channelName + 'DutyCycle');
                jsonData[channelName + 'DutyCycle'] = elem.checked ? dutyCycleElement.value : "0";
            } else if (!elem.id.endsWith('DutyCycle')) {
                jsonData[elem.name] = elem.value;
            }
        }
    }

    textArea.value = JSON.stringify(jsonData, null, 2);
    console.log(textArea.value);
}

document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', updateJsonData);
});

document.getElementById('unitModeForm').addEventListener('change', function() {
    updateJsonData();
});

document.addEventListener('DOMContentLoaded', function() {
    const formElements = document.getElementById('unitModeForm').elements;
    for (let i = 0; i < formElements.length; i++) {
        const elem = formElements[i];
        if (elem.type !== 'button' && elem.id !== 'jsonData') {
            elem.addEventListener('change', updateJsonData);
        }
    }
});
