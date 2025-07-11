
document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const correctBtn = document.getElementById('correctBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const messageBox = document.getElementById('messageBox');
  

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
    }, 3000); 
  }
  
  // call fstapi
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
        
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full corrected text:", data.corrected_text);
      return data.corrected_text;

    } catch (error) {
      console.error('Error during API call:', error);
      throw new Error(`Failed to correct text: ${error.message}`);
    }
  }
  
  
  correctBtn.addEventListener('click', async () => {
    const originalText = inputText.value;
    if (originalText.trim() === '') {
      showMessage('Please enter some text to correct.', 'error');
      outputText.value = 'Your corrected text will appear here...';
      outputText.classList.add('empty');
      return;
    }

    // loading state
    correctBtn.innerHTML = '<div class="loading-spinner"></div> Correcting...';
    correctBtn.disabled = true;
    outputText.value = 'Correcting grammar, please wait...';
    outputText.classList.add('empty'); 

    try {

      const corrected = await correctGrammar(originalText);
      outputText.value = corrected;
      if (corrected.trim() !== '') {
        outputText.classList.remove('empty');
        showMessage('Text corrected successfully!', 'success');
      } else {
        outputText.value = 'No corrections needed or text was empty.';
        outputText.classList.add('empty');
      }
    } catch (error) {
      console.error('Error during grammar correction:', error);
      outputText.value = `An error occurred: ${error.message}. Please try again.`;
      outputText.classList.add('empty');
      showMessage(`Error: ${error.message}`, 'error');
    } finally {
      correctBtn.disabled = false;
      correctBtn.innerHTML = 'Correct Grammar'; 
    }
  });
  
  
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = 'Your corrected text will appear here...';
    outputText.classList.add('empty');
    inputText.focus();
    showMessage('Text area cleared.', 'success');
  });
  
  
  if (outputText.value.trim() === '' || outputText.value === 'Your corrected text will appear here...') {
    outputText.classList.add('empty');
    outputText.value = 'Your corrected text will appear here...';
  } else {
    outputText.classList.remove('empty');
  }
});
