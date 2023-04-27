const chatForm = document.querySelector('.chat-form');
const chatBox = document.querySelector('.chat');
let url = 'http://127.0.0.1:5000/process_data';
const typingIndicator = document.querySelector('.typing-indicator');
const langSwitch = document.getElementById('lang-switch');

chatForm.addEventListener('submit', (event) => {
  let answer;
  event.preventDefault();
  const message = event.target.querySelector('input').value;
  appendChatBox('user', message);
  appendTyping();
  const data = {
    question: message,
    language: 'arabic'
  };
  fetch('http://127.0.0.1:5000/process_data', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)  
  })
  .then(response => response.json())
  .then(answer => {
    stopTyping();
    appendChatBox('bot', answer["answer"]);
    console.log("The answer is retrieved sucessfuly !")
    })
  .catch(error => {
    console.error('Error:', error);
    stopTyping();
    appendChatBox('bot', "أنا آسف ، لم أتمكن من العثور على الإجابة على ويكيبيديا");
  });
  event.target.reset();
});

function appendChatBox(userType, message) {
  const chatBubble = document.createElement('div');
  const chatBoxDiv = document.createElement('div');
  chatBubble.classList.add('chat-bubble');
  chatBubble.classList.add(userType);
  chatBubble.textContent = message;
  chatBoxDiv.classList.add('chat-box-'+userType);
  chatBoxDiv.appendChild(chatBubble);
  chatBox.appendChild(chatBoxDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}



function appendTyping(){
  const divTyping = document.createElement('div');
  divTyping.classList.add("typing-indicator");
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const span3 = document.createElement('span');
  divTyping.appendChild(span1);
  divTyping.appendChild(span2);
  divTyping.appendChild(span3);
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

