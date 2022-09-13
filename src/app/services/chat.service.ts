import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  public message$: BehaviorSubject<string> = new BehaviorSubject('');


  socket = io('http://localhost:3001');

  constructor() {
    // this.socket = io('http://localhost:3001');

    

    this.socket.on('connect', function() {
        console.log("connected ----------!")
        ;
    });

  }

  // constructor() { }

  // conversation = new Subject<Message[]>();
  
  // messageMap = {
  //   "Hi": "Hello",
  //   "Who are you": "My name is Agular Bot",
  //   "What is Angular": "Angular is the best framework ever",
  //   "default": "I can't understand. Can you please repeat"
  // }

  // getBotAnswer(msg: string) {
  //   const userMessage = new Message('user', msg);  
  //   this.conversation.next([userMessage]);
  //   const botMessage = new Message('bot', this.getBotMessage(msg));
    
  //   setTimeout(()=>{
  //     this.conversation.next([botMessage]);
  //   }, 1500);
  // }

  // getBotMessage(question: string){
  //   console.log(question);
  //   let answer = question
  //   return answer || this.messageMap['default'];
  // }

  // socket: any;



  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data:any) => {
        console.log('ee',eventName,data)
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data:any) {
    console.log('in emit',data)
    this.socket.emit(eventName, data);
  }

 

  public sendMessage(message:any) {
    console.log('in chat service send message',message)
    this.socket.emit('chat', message);
  }

  public getNewMessage(){
    return this.socket.emit('findAllMessage');
  }


  // public getNewMessage = () => {
  //   this.socket.on('findAllMessage', (message) =>{
  //     console.log('see messages',message);
  //     this.message$.next(message);
  //     let d = this.socket.emit('findAllMessage')
  //     console.log('is???',d);
  //   });
    
  //   return this.message$.asObservable();
  // };
}
