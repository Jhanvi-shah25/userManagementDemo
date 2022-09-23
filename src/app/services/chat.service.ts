import { Injectable } from '@angular/core';
import {  Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  socket: any;
  id : string ="";

  constructor() {
    let obj = this;
    this.socket = io('http://localhost:3001');
    this.socket.on('connected', function() {
        console.log("connected !",obj);
        console.log('socket id',obj.socket.id,obj.socket.connected);
        
    });

    console.log('socket',this.socket)

    // this.socket.on('getid',function(data:any,data1:any){
    //   console.log(data,data.connected,data1)
    // })

    // this.socket.on('disconnected',function(){
    //   console.log('disconnected!!')
    //   console.log('socket id diconnected',obj.socket.id);
    // })
    // console.log('socket id',this.socket.id)
    this.id = this.socket.id;
  }

  getConnectedUserWithSocket(){
    return this.socket;
  }

  listen(eventName: string) {
    console.log(eventName,'ename')
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data:any) => {
        subscriber.next(data);
      })
    });
  }

  getConenctedId(){
    this.socket.on('getid',(data:any) =>{
      console.log('connected user id',this.socket.id,data,data.connected,this.socket.connected);
      this.id = data;
    })
    return this.id;
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
              console.log(message,'2');
                observer.next(message);
            });
    });

  } 
  public getOldMessages = () => {
    return new Observable((observer:any) => {
            this.socket.on('findAllMessage', (message:any) => {
              console.log(message,'2')
                observer.next(message);
            });
    });

  }

  public isConnected = () => {
    return Observable.create((obs:any)=>{
      this.socket.on('isConnect',(msg:any)=>{
        console.log(msg,'from isconnected!!!!')
        obs.next(msg);
      })
    })
  }

  ngAfterViewInit(){
    console.log('in view')
  }
}
