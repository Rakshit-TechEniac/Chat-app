const socket = io();

const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg-input');
const userId = document.getElementById('userId').value;
const receiverIdInput = document.getElementById('receiverId');

// Join own private room
socket.emit('join', userId);

// FCM Registration
async function registerFCM() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Manually register the service worker first
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      
      const token = await messaging.getToken({
        serviceWorkerRegistration: registration,
        vapidKey: window.vapidKey
      });

      if (token) {
        console.log('FCM Token:', token);
        // Save token to server
        await fetch('/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
      }
    } else {
      console.warn('Notification permission denied');
    }
  } catch (err) {
    console.error('FCM Error:', err);
  }
}

registerFCM();

// Scroll to bottom
if (chatWindow) {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Message from server
socket.on('message', (message) => {
  // Only display if the message is part of current 1v1 conversation
  const currentReceiverId = receiverIdInput ? receiverIdInput.value : null;
  
  // Logic: either I sent it to the current other user, OR the current other user sent it to me
  const isRelevant = 
    (message.sender._id === userId && message.receiver === currentReceiverId) ||
    (message.sender._id === currentReceiverId && message.receiver === userId);

  if (isRelevant && chatWindow) {
    const div = document.createElement('div');
    div.classList.add('mb-2');
    if (message.sender._id === userId) {
      div.classList.add('text-end');
    }

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('d-inline-block', 'p-2', 'rounded');
    innerDiv.classList.add(message.sender._id === userId ? 'bg-primary' : 'bg-light');
    if (message.sender._id === userId) {
      innerDiv.classList.add('text-white');
    }

    innerDiv.innerHTML = `<span>${message.content}</span>`;
    div.appendChild(innerDiv);
    chatWindow.appendChild(div);

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});

// Message submit
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = msgInput.value;
    const receiverId = receiverIdInput.value;

    // Emit private message to server
    socket.emit('privateMessage', {
      senderId: userId,
      receiverId: receiverId,
      message: msg
    });

    msgInput.value = '';
    msgInput.focus();
  });
}
