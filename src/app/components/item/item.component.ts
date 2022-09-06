import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService, Request } from 'src/app/services/api.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {


  taskList : any =[];
  userList : any =[];
  nestedArray :any = [{
    "title" : "taskList",
    "id" : '101',
    "child" : []
  },{
    "title" : "userList",
    "id" : '102',
    "child" : []
  }];
  
  idList : any= [];
  @Input('onDragDrop') public onDragDrop$!: Subject<CdkDragDrop<Array<any>>>;
  @Input() child!: any;
  @Input() invert!: boolean;

  constructor(private apiService:ApiService,private toaster:ToastrService,private router:Router) { }

 
  async ngOnInit() {
    await this.getAllTask();
    console.log(this.taskList,this.userList)
    console.log('see nested',this.nestedArray)
    this.idList = this.nestedArray.map((parent:any) => { console.log('in id',parent); parent.id});
  }

   getAllTask(){
    let request : Request = {
      path : 'task/getAll'
    }
    return new Promise((resolve)=>{
      this.apiService.get(request).subscribe((response:any)=>{
        this.taskList = response;
        console.log(this.taskList)
        for(let i=0;i<this.taskList.length;i++){
         this.nestedArray[0]["child"] = this.taskList
         console.log('nest inside',this.nestedArray)
        }
        this.getAllUsers();
        console.log('in task',response ,'nest',this.nestedArray)
      })
      resolve(null);
    })
  }

  getAllUsers(){
    let request : Request = {
      path : 'users/getAll'
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.userList = response;
      for(let i=0;i<this.userList.length;i++){
        this.nestedArray[1]["child"] = this.userList;
       }

      console.log(this.userList,this.nestedArray)
    })
  }

}
