import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChatService, Message } from 'src/app/services/chat.service';
import * as io from 'socket.io-client';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  socket:any;
  value: string = "";


  constructor(private router : Router,private activateRoute : ActivatedRoute,private chatService:ChatService) { }



  ngOnInit() {
      // this.socket = io("http://localhost:3000", {transports: ['websocket'], secure: true})
      // this.socket.on("chat",(d)=>{
      //   console.log.o
      // })
      this.chatService.conversation.subscribe((val:any) => {
      this.messages = this.messages.concat(val);
    });
  }

  sendMessage() {
    this.chatService.getBotAnswer(this.value);
    this.value = '';
  }

}
