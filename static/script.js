const inputTextarea = document.getElementById('inputText');
const correctButton = document.getElementById('correctBtn');
const clearButton = document.getElementById('clearBtn');
const outputDiv = document.getElementById('outputText');
const messageBox = document.getElementById('messageBox');

// Function to show temporary message
function showMessage(message, type = 'success') {
    messageBox.textContent = message;
    messageBox.className = `message-box show`;
    if (type === 'error') {
        messageBox.style.backgroundColor = '#ef4444';
    } else {
        messageBox.style.backgroundColor = '#10b981';
    }
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000); // Remember 3 seconds
}

// Function to call fstapi
async function correctGrammar(text) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/correct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            // Attempt to read
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
<<<<<<< HEAD
=======
        console.log("Full corrected text:", data.corrected_text); // Line 34

>>>>>>> bfbbdef (Prepare project for Render deployment)
        return data.corrected_text;

    } catch (error) {
        console.error('Error during API call:', error);
        throw new Error(`Failed to correct text: ${error.message}`);
    }
}

//listener for the "Correct Grammar" button
correctButton.addEventListener('click', async () => {
    const originalText = inputTextarea.value;
    if (originalText.trim() === '') {
        showMessage('Please enter some text to correct.', 'error');
        outputDiv.textContent = 'Your corrected text will appear here...';
        outputDiv.classList.add('empty');
        return;
    }

    // Show loading state
    correctButton.innerHTML = '<div class="loading-spinner"></div> Correcting...';
    correctButton.disabled = true;
    outputDiv.textContent = 'Correcting grammar, please wait...';
    outputDiv.classList.add('empty'); // Keep empty class while loading

    try {
        // Call the actual grammar correction function
        const corrected = await correctGrammar(originalText);
        outputDiv.textContent = corrected;
        if (corrected.trim() !== '') {
            outputDiv.classList.remove('empty');
        } else {
            outputDiv.textContent = 'No corrections needed or text was empty.';
            outputDiv.classList.add('empty');
        }
    } catch (error) {
        console.error('Error during grammar correction:', error);
        outputDiv.textContent = `An error occurred: ${error.message}. Please try again.`;
        outputDiv.classList.add('empty');
        showMessage(`Error: ${error.message}`, 'error');
    } finally {
<<<<<<< HEAD
        // Reset button state
        correctButton.disabled = false;
    }
=======
    correctButton.disabled = false;
    correctButton.innerHTML = 'Correct Grammar'; 
    }

>>>>>>> bfbbdef (Prepare project for Render deployment)
});

// its for the clear text button
clearButton.addEventListener('click', () => {
    inputTextarea.value = '';
    outputDiv.textContent = 'Your corrected text will appear here...';
    outputDiv.classList.add('empty');
    showMessage('Text area cleared.', 'success');
});


if (outputDiv.textContent.trim() === 'Your corrected text will appear here...') {
    outputDiv.classList.add('empty');
} else {
    outputDiv.classList.remove('empty');
}
