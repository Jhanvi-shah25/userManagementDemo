import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  newMessage: any;
  feedback:any;
  messageList:  any[] = [];
  admin : boolean = false;
  user : boolean =false;
  admin_id : string = '';
  user_id_at_login : string = '';
  user_id : string = '';
  singleUserList : any = {};
  sender_id : string = '';
  receiver_id:string = '';
  msg:any;
  connectedId : string = '';
  newConnected : any = [];
  activeStatus : boolean = false;


  constructor(
    private chatService: ChatService,
    private authService:AuthenticationService,
    private apiService:ApiService,
    private route : ActivatedRoute,
    private router : Router) 
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
    console.log('loading')

    //Listen connected event mentioned on server side
    this.chatService.listen('connected').subscribe((data:any) => {
      console.log('connect or not?',data);
      // this.newConnected = data;
      // let connectedSocket =  this.chatService.getConnectedUserWithSocket();
      // if(data.connected === true){
      //   this.activeStatus = true;
      // }else{
      //   this.activeStatus = false;
      // }

    })

    // this.chatService.listen('getid').subscribe((obj:any)=>{
    //   console.log(obj,'see')
    //   this.connectedId = obj
    //   console.log('connected or not using get id event',obj.connected,this.newConnected)
    //   if(this.newConnected.length!==0){
    //     console.log('in if');
    //     this.newConnected.filter((val:any)=>{
    //       if(val === this.connectedId){
    //         this.activeStatus = true;
    //       }else{
    //         this.activeStatus =false;
    //       }
    //     })
    //   }
    // })


    //Getting old messages
    this.chatService.listen('findAllMessage').subscribe((data:any)=>{
      console.log('event findall',data);      
    })

    this.chatService.listen('getid').subscribe((data:any)=>{
      console.log('connected ids all',data);
      if(data.connected){
        this.activeStatus = true;
      }else{
        this.activeStatus = false;
      }
    })

    //Typing
    this.chatService.listen('typing').subscribe((data:any)=>{
      this.updateFeedback(data);
    })

    //Get message using msgToClient event
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

    if(this.user_id!==''){this.getsingleUserList(this.user_id);}
    
    //Get all past messages using findAllMessage event
    this.chatService
    .getOldMessages()
    .subscribe((data:any)=>{
      console.log('data',data);
      data.forEach((data:any)=>{
        if(data.sender === this.sender_id || data.receiver === this.sender_id){
          if(data.sender === this.user_id || data.receiver === this.user_id && this.admin){
          this.messageList.push(data);
          }
          else if(data.sender === this.receiver_id || data.receiver === this.receiver_id && this.user){
            this.messageList.push(data);
          }
          else{
            console.log('No data!')
          }
        }
        else{
          console.log('No data!')
        }
      })
      console.log(this.messageList,'old messages of particular user');
    })
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

  //Get single user list
  getsingleUserList(userId : string){
    console.log(userId);
    let request : Request = {
      path : 'users/get/' + userId
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.singleUserList = response;
    })
  }

  back(){
    // window.location.reload();
    this.router.navigate(['/dashboard']);
  }

  updateFeedback(data: any) {
    console.log(data,'data from feedback');
    this.feedback = `${data} is typing a message`;
  }





}
