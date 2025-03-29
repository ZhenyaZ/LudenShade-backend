# 🌐 Secure Web Chat  

A **real-time chat application** that allows users to exchange messages securely. This project implements strong **end-to-end encryption**, supports **group chats**, and provides essential messaging features like **editing and deleting messages**.  

## ✨ Features  

- 🔐 **End-to-end encrypted messaging** using a hybrid encryption approach (Asymmetric + Symmetric).  
- 👤 **User profiles** – update personal information.  
- 💬 **Group chats** – create and manage group conversations.  
- 📝 **Edit & delete messages** – refine or remove messages as needed.  
- 🗑 **Delete chats** – clear conversations when necessary.  

## 🔒 Encryption Details  

The project uses a **hybrid encryption scheme**:  

1. **Asymmetric Encryption (Public/Private Key Pair)**  
   - Each user has a unique pair of asymmetric keys.  
   - These keys are stored in **encrypted form**.  

2. **Symmetric Encryption for Message Exchange**  
   - When a chat is created, a **symmetric key** is generated.  
   - This key is **encrypted with the public keys** of both users.  
   - Only the respective **private keys** can decrypt and access this symmetric key to read messages.  

This ensures that **even the server cannot read messages**, as only users hold the necessary private keys to decrypt the data.  

## 🔑 Authentication & Security  

- **JWT-based authentication**  
  - Uses **Access Tokens** (short-lived) and **Refresh Tokens** (long-lived) for secure session management.  
- **Secure password handling**  
  - User passwords are **hashed with bcrypt** before being stored.  
- **WebSocket communication**  
  - Utilizes **socket.io** for real-time messaging.  

## 🛠 Technologies Used  

### **Frontend**  
- **React.js + TypeScript**  
- **bcrypt** – Secure password hashing  
- **node-forge** – Cryptographic functions  
- **react-router-dom** – Client-side routing  
- **zustand** – State management  
- **framer-motion** – Animations  
- **Radix-UI** – Modern UI components  

### **Backend**  
- **Node.js + Express.js**  
- **bcrypt** – Password hashing  
- **node-forge** – Encryption utilities  
- **socket.io** – Real-time communication  

### **Database**  
- **MongoDB** – NoSQL database for storing user data and messages  

## ❗ Known Issue  

**Apple devices (iOS/macOS) are currently unsupported** due to an issue where cookies are not properly stored. This affects authentication functionality, making login impossible on these devices.  

## 📚 What I Learned  

While working on this project, I:  
- Deepened my understanding of **encryption (asymmetric & symmetric)**.  
- Gained experience with **real-time communication using WebSockets**.  
- Improved my knowledge of **JWT authentication and MongoDB**.  
