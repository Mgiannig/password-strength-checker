const meter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateMeter);
updateMeter();

function updateMeter() {
    const weaknesses = calculatePasswordStrength(passwordInput.value);
    let strength = 100;
    reasonsContainer.innerHTML = '';
    weaknesses.forEach(weakness => {
        if (weakness == null) {
            return;
        }
        strength -= weakness.deduction;
        const messageElement = document.createElement('div');
        messageElement.innerText = weakness.message;
        reasonsContainer.appendChild(messageElement);
    });
    meter.style.setProperty('--strength', strength);
}

function calculatePasswordStrength(password) {
    const weaknessess = [];

    weaknessess.push(lengthWeakness(password));
    weaknessess.push(characterTypeWeakness(password, /[a-z]/g, 'lowercase'));
    weaknessess.push(characterTypeWeakness(password, /[A-Z]/g, 'uppercase'));
    weaknessess.push(characterTypeWeakness(password, /[0-9]/g, 'numbers'))
    weaknessess.push(characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, 'special'));
    weaknessess.push(repeatCharacterWeakness(password));

    return weaknessess;
}



function lengthWeakness(password) {
    const lenght = password.length;

    if (lenght <= 5) {
        return {
            message: 'Your password is too short',
            deduction: 40
        }
    }

    if (lenght <= 10) {
        return {
            message: 'Your password could be longer',
            deduction: 15
        }
    }
}

function characterTypeWeakness(password, regex, type) {
    const matches = password.match(regex) || [];

    if (matches.length === 0) {
        return {
            message: `Your password has no ${type} characters`,
            deduction: 20
        }
    }

    if (matches.length <= 2) {
        return {
            message: `Your password could use more ${type} characters`,
            deduction: 5
        }
    }
}

function repeatCharacterWeakness(password) {
    const matches = password.match(/(.)\1/g) || [];

    if (matches.length > 0) {
        return {
            message: 'Your password has repeated characters',
            deduction: matches.length * 10
        };
    }
}

