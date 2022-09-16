import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService, Message } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  newMessage: any;
  messageList:  any[] = [];
  admin : boolean = false;
  user : boolean =false;
  admin_id : string = '';
  user_id_at_login : string = '';
  user_id : string = '';

  sender_id : string = '';
  receiver_id:string = '';
  msg:any;


  constructor(
    private chatService: ChatService,
    private authService:AuthenticationService,
    private route : ActivatedRoute) 
    {

      //Get id or not according to login type
      this.route.queryParams.subscribe((param : Params)=>{
        console.log('get id from params',param);
        if(param['id']){
          this.user_id = param['id'];
        }else{
          this.user_id = '';
        }
      })
    

      //for current individual ( Admin / User)
      if(this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'Admin')
      {
        this.admin = true;
        this.admin_id = this.authService.data.authDetail._id;
        this.sender_id = this.authService.data.authDetail._id;

      }
      else if(this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'User')
      {
        this.user = true;
        this.user_id_at_login = this.authService.data.authDetail._id;
        if(this.receiver_id===''){
          this.receiver_id = "6310332d0003cd963d795890"
        }
        this.sender_id = this.authService.data.authDetail._id;
      }
      else 
      {
        this.admin = false;
        this.user = false;
        this.admin_id = '';
        this.user_id_at_login = '';
      }
      console.log('here is sender',this.sender_id)
      console.log('data ',this.sender_id,this.admin,this.admin_id,this.user_id,this.user_id_at_login,this.authService.data.authDetail)
    }

  ngOnInit() {

    //Listen connected event mentioned on server side
    this.chatService.listen('connected').subscribe((data) => {
      console.log('connect or not?',data);
    })

    //Get all messages using msgToClient event
    this.chatService
    .getMessages()
    .subscribe((message: string) => {
      this.messageList.push(message);
      this.messageList.forEach((data)=>{
        this.receiver_id = data.sender;
      })
      console.log(this.messageList,'list')
    });
    console.log(this.messageList,'list')

  }

  //Send message to server using msgToserver event
  sendMessage() {
    let requestData = {}
    if(this.admin){
      requestData = {
        "sender" : this.sender_id,
        "receiver" : this.user_id,
        "isRead" : true,
        "message" : this.newMessage
      }
    }
    if(this.user){
      requestData = {
        "sender" : this.sender_id,
        "receiver" : this.receiver_id,
        "isRead" : true,
        "message" : this.newMessage
      }
    }

    this.chatService.sendMessage(requestData);
    this.messageList.push(requestData);
    this.newMessage = '';
  }

  //For design part
  messages: Message[] = [];
  value: string ='';


  ngOnInit1() {
      this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
  }

  sendMessage1() {
    this.chatService.getBotAnswer(this.value);
    this.value = '';
  }
}
