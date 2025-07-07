import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  http = inject(HttpClient);
  socket: any;
  users: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  newMessage = '';
  currentUser: any;
  onlineUsers: string[] = [];
  messageCounts: { [userId: string]: number } = {};
  showOptions = false;

  API_BASE = 'http://localhost:3200';

  constructor() {
    this.socket = io(this.API_BASE, {
      path: '/socket.io',
      forceNew: true,
      reconnectionAttempts: 3,
      timeout: 2000,
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ data: any }>(`${this.API_BASE}/getuserdata`, { headers }).subscribe(res => {
      this.currentUser = res.data;

      this.socket.emit('register', this.currentUser._id);
      this.fetchChatUsers();

      this.socket.on('online-users', (ids: string[]) => {
        this.onlineUsers = ids;
      });

      this.socket.on('private-message', (data: any) => {
        const senderId = this.getId(data.senderId);
        const receiverId = this.getId(data.receiverId);

        const isCurrentChat = this.selectedUser &&
          (senderId === this.selectedUser._id || receiverId === this.selectedUser._id);

        if (!isCurrentChat) {
          const otherUserId = senderId === this.currentUser._id ? receiverId : senderId;
          if (otherUserId) {
            this.messageCounts[otherUserId] = (this.messageCounts[otherUserId] || 0) + 1;
          }
        }

        if (isCurrentChat) {
          const exists = this.messages.some(m => m._id === data._id);
          if (!exists) {
            this.messages.push(data);
          }

          if (receiverId === this.currentUser._id) {
            this.socket.emit('message-read', { messageId: data._id });
            data.isRead = true;
          }
        }
      });

      this.socket.on('message-read', ({ messageId }: { messageId: string }) => {
        const msg = this.messages.find(m => m._id === messageId);
        if (msg) {
          msg.isRead = true;
        }
      });
    });
  }

  getId(idOrObj: any): string | undefined {
    if (!idOrObj) return undefined;
    if (typeof idOrObj === 'string') return idOrObj;
    if (idOrObj.$oid) return idOrObj.$oid;
    return undefined;
  }

  fetchChatUsers() {
    const oppositeRole = this.currentUser.role === 'student' ? 'faculty' : 'student';
    const url = `${this.API_BASE}/user/${oppositeRole}`;

    this.http.get<{ [key: string]: any[] }>(url).subscribe(res => {
      this.users = res[oppositeRole];
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = [];
    this.messageCounts[user._id] = 0;
    this.showOptions = false;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
    this.http.get<any[]>(`${this.API_BASE}/conversation/${user._id}`, { headers }).subscribe(res => {
      this.messages = res;

      this.messages.forEach(msg => {
        if (!msg.isRead && this.getId(msg.receiverId || msg.receiver) === this.currentUser._id) {
          this.socket.emit('message-read', { messageId: msg._id });
          msg.isRead = true;
        }
      });
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const messagePayload = {
      senderId: this.currentUser._id,
      receiverId: this.selectedUser._id,
      message: this.newMessage.trim(),
    };

    this.socket.emit('private-message', messagePayload);
    this.newMessage = '';
  }

  deleteConversation() {
    if (!this.selectedUser || !confirm('Are you sure you want to delete this conversation?')) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);

    this.http.put(`${this.API_BASE}/conversation/${this.selectedUser._id}/delete`, {}, { headers })
      .subscribe(() => {
        this.messages = [];
        alert('Conversation deleted for you.');
      });
  }

  getLastUserMessage() {
    const reversed = [...this.messages].reverse();
    return reversed.find(m => m.senderId === this.currentUser._id);
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
