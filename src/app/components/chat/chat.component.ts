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
  newMessage: string="";
  messageList: string[] = [];


  constructor(private router : Router,private activateRoute : ActivatedRoute,private chatService:ChatService) { }


//   ngOnInit(){
//     // this.chatService.listen('connected').subscribe((data)=>{
//     //   console.log('from ngoninit',data)
//     // })
//     this.chatService.listen('chat').subscribe((data:any)=>{
//       console.log('from ngoninit',data)
//       this.messages.push(data);
//       console.log(this.messages);
//     })
//  }

ngOnInit(){
 let d = this.chatService.getNewMessage()
 console.log('all',d);
}



  // ngOnInit() {
  //     this.chatService.conversation.subscribe((val:any) => {
  //     this.messages = this.messages.concat(val);
  //   });
  // }

  // sendMessage() {
  //   this.chatService.emit('chat',this.messages);
  // }

  sendMessage() {
    console.log('msg',this.newMessage)
  //   let data = {
  //     "sender" : "6310332d0003cd963d795890",
  //     "receiver" : "631033710003cd963d795895",
  //     "message" : "demo 1 user",
  //     "isRead" : true
  // }
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

}
