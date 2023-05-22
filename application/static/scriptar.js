const chatForm = document.querySelector('.chat-form');
const chatBox = document.querySelector('.chat');
const url = '/process_data';
const typingIndicator = document.querySelector('.typing-indicator');
const langSwitch = document.getElementById('lang-switch');

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = event.target.querySelector('input').value;
  appendChatBox('user', message);
  appendTyping();
  const data = {
    question: message,
    language: 'arabic'
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const answer = await response.json();
    stopTyping();
    appendChatBox('bot', answer.answer);
    console.log("The answer is retrieved successfully!");
  } catch (error) {
    console.error('Error:', error);
    stopTyping();
    appendChatBox('bot', "أنا آسف ، لم أتمكن من العثور على الإجابة على ويكيبيديا");
  }
  event.target.reset();
});

function appendChatBox(userType, message) {
  const chatBubble = document.createElement('div');
  const chatBoxDiv = document.createElement('div');
  chatBubble.classList.add('chat-bubble', userType);
  chatBubble.textContent = message;
  chatBoxDiv.classList.add('chat-box-' + userType);
  chatBoxDiv.appendChild(chatBubble);
  chatBox.appendChild(chatBoxDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTyping() {
  const divTyping = document.createElement('div');
  divTyping.classList.add('typing-indicator');
  divTyping.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(divTyping);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
}

function startTyping() {
  showTypingIndicator();
  setTimeout(() => {
    console.log('Bot is typing...');
  }, 1000);
}


function stopTyping() {
  const typingIndicator = document.querySelector('.typing-indicator');
  typingIndicator.remove();
}

