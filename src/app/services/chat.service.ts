import { Injectable } from '@angular/core';
import {  Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversation = new Subject<Message[]>();
  
  messageMap = {
    "Hi": "Hello",
    "Who are you": "My name is Agular Bot",
    "What is Angular": "Angular is the best framework ever",
    "default": "I can't understand. Can you please repeat"
  }

  socket: any;
  id : string ="";

  constructor() {
    this.socket = io('http://localhost:3001');
    this.socket.on('connected', function() {
        console.log("connected !");
    });
    console.log(this.socket,'here')
    this.id = this.socket.id;
  }

  listen(eventName: string) {
    console.log(eventName,'ename')
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data:any) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data:any) {
    this.socket.emit(eventName, data);
  }

  public sendMessage(newData:any) {
    this.socket.emit('msgToServer', newData);
  }

  public getMessages = () => {
    console.log('coming')
    return Observable.create((observer:any) => {
      console.log('1',observer)
            this.socket.on('msgToClient', (message:any) => {
              console.log(message,'2')
                observer.next(message);
            });
    });

  } 
  ngAfterViewInit(){
    console.log('in view')
  }



  //For design part


  getBotAnswer(msg: string) {
    console.log(msg,'llllllll')
    const userMessage = new Message('user', msg);  
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1500);
  }

  getBotMessage(question: string){
    let answer = question;
    return answer || this.messageMap['default'];
  }
}
