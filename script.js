// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyBUec5oAEwTE8GZ-pdmr5Rg_54tLITAZHs",
    authDomain: "chat-advance-3c85f.firebaseapp.com",
    databaseURL: "https://chat-advance-3c85f-default-rtdb.firebaseio.com",
    projectId: "chat-advance-3c85f",
    storageBucket: "chat-advance-3c85f.appspot.com",
    messagingSenderId: "42300338182",
    appId: "1:42300338182:web:566cc235c995a371619387"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// DOM Elements
const signUpPage = document.getElementById("signUpPage");
const chatPage = document.getElementById("chatPage");
const signUpForm = document.getElementById("signUpForm");
const userNameInput = document.getElementById("userName");
const messagesContainer = document.getElementById("messages");
const userMessageInput = document.getElementById("userMessage");
const sendUserMessageButton = document.getElementById("sendUserMessage");

// Global Variables
const adminId = "admin"; // Admin's unique ID
const adminName = "Mehedi"; // Admin's display name
let currentUserName = '';
let currentUserId;

// Check if User is Already Logged In
window.onload = function () {
    if (localStorage.getItem('userId')) {
        currentUserId = localStorage.getItem('userId');
        currentUserName = localStorage.getItem('userName');
        signUpPage.style.display = "none";
        chatPage.style.display = "block";
        document.getElementById("welcomeName").textContent = currentUserName;
        loadChat();
    } else {
        signUpPage.style.display = "block";
        chatPage.style.display = "none";
    }
};

// Sign Up User
signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentUserName = userNameInput.value.trim();
    if (currentUserName !== "") {
        createUserAccount(currentUserName);
    }
});

// Create User in Firebase
function createUserAccount(name) {
    const newUserId = database.ref().child('users').push().key;
    const userData = {
        name: name
    };

    database.ref('users/' + newUserId).set(userData).then(function () {
        currentUserId = newUserId;
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('userName', name);
        signUpPage.style.display = "none";
        chatPage.style.display = "block";
        document.getElementById("welcomeName").textContent = name;
        loadChat();
    });
}

// Load Chat Between User and Admin
function loadChat() {
    document.getElementById("chatArea").style.display = "block"; // Show Chat Area
    loadMessages(); // Load Existing Messages
}

// Load Messages from Firebase
function loadMessages() {
    database.ref("messages/" + adminId + "/" + currentUserId).on("child_added", function (snapshot) {
        const messageData = snapshot.val();
        const messageKey = snapshot.key;

        // Create Message Container
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Add Sender's Name
        const senderName = document.createElement("div");
        senderName.style.fontWeight = "bold";
        senderName.style.color = "yellow";
        senderName.style.marginBottom = "5px";

        // Debug: Log sender ID and admin ID to check the condition
        console.log("Message sender ID: " + messageData.senderId);
        console.log("Admin ID: " + adminId);

        if (messageData.senderId === adminId) {
            // Display 'Mehedi' if sender is admin
            senderName.textContent = adminName;
        } else {
            // Display the message sender's name if not the admin
            senderName.textContent = messageData.senderName;
        }

        console.log("Sender Name displayed: " + senderName.textContent); // Debug log to see the displayed name

        // Add Message Content
        const messageContent = document.createElement("span");
        messageContent.textContent = messageData.text;

        // Add Timestamp
        const messageTimestamp = document.createElement("div");
        messageTimestamp.style.fontSize = "0.4em";
        messageTimestamp.style.color = "#888";
        messageTimestamp.textContent = messageData.timestamp;

        // Append Elements to Message Container
        messageElement.appendChild(senderName);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTimestamp);

        // Add Action Buttons for User's Messages
        if (messageData.senderId === currentUserId) {
            const actionsContainer = document.createElement("span");
            actionsContainer.style.float = "right";

            // Edit Button
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-sm", "btn-warning", "ms-2");
            editButton.innerHTML = `<i class="fas fa-edit"></i>`;
            editButton.addEventListener("click", function () {
                editMessage(messageKey, messageData.text);
            });

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-sm", "btn-danger");
            deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
            deleteButton.addEventListener("click", function () {
                deleteMessage(messageKey);
            });

            // Append Buttons to Actions Container
            actionsContainer.appendChild(editButton);
            actionsContainer.appendChild(deleteButton);
            messageElement.appendChild(actionsContainer);
        }

        messagesContainer.appendChild(messageElement); // Add Message to Chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to Latest Message
    });
}

// Send Message
sendUserMessageButton.addEventListener("click", function () {
    const messageText = userMessageInput.value.trim();
    if (messageText !== "") {
        sendMessage(messageText);
        userMessageInput.value = ""; // Clear Input Field
    }
});

// Send Message to Firebase
function sendMessage(messageText) {
    const timestamp = new Date().toLocaleString(); // Generate Timestamp
    const messageData = {
        senderId: currentUserId,
        senderName: currentUserName,
        text: messageText,
        timestamp: timestamp
    };

    // Send Message to Admin-User Chat
    database.ref("messages/" + adminId + "/" + currentUserId).push(messageData);
    // Mirror Message in User-Admin Chat
    database.ref("messages/" + currentUserId + "/" + adminId).push(messageData);
}

// Edit a Message
function editMessage(messageKey, currentText) {
    const newMessage = prompt("Edit your message:", currentText);
    if (newMessage !== null && newMessage.trim() !== "") {
        database.ref("messages/" + adminId + "/" + currentUserId + "/" + messageKey).update({
            text: newMessage
        });
        database.ref("messages/" + currentUserId + "/" + adminId + "/" + messageKey).update({
            text: newMessage
        });
    }
}

// Delete a Message
function deleteMessage(messageKey) {
    if (confirm("Are you sure you want to delete this message?")) {
        database.ref("messages/" + adminId + "/" + currentUserId + "/" + messageKey).remove();
        database.ref("messages/" + currentUserId + "/" + adminId + "/" + messageKey).remove();
    }
}