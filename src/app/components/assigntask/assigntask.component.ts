import { CdkDragDrop, CdkDragEnter, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService, Request } from 'src/app/services/api.service';

type IMenu = {
  title: string;
  id: number;
  price: number;
  temp?: boolean;
};

@Component({
  selector: 'app-assigntask',
  templateUrl: './assigntask.component.html',
  styleUrls: ['./assigntask.component.scss']
})
export class AssigntaskComponent implements OnInit {

  taskList : any =[];
  userList : any =[];

  menu: Array<IMenu> = [
    { title: 'pork', price: 12, id: 1 },
    { title: 'duck', price: 12, id: 2 },
    { title: 'chicken', price: 12, id: 3 },
    { title: 'beef', price: 12, id: 4 },
    { title: 'soup', price: 12, id: 5 },
  ];
  table: Array<IMenu> = [];


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

// public onDragDrop$ = new Subject<CdkDragDrop<Array<any>>>();

  constructor(private apiService:ApiService,private toaster:ToastrService,private router:Router) { }

  // ngOnInit(): void {
  //   this.getAllTask();
  //   this.getAllUsers();
  // }

  async ngOnInit() {
    await this.getAllTask();
    console.log(this.taskList,this.userList)
    console.log('see nested',this.nestedArray)
    this.idList = this.nestedArray.map((parent:any) => { console.log('in id',parent); parent.id});
    // this.onDragDrop$.subscribe(this.onDragDrop);
  }

  // private onDragDrop = (event: CdkDragDrop<Array<any>>) => {
  //   if (event.container === event.previousContainer) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // };

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




dropItem(event:any) {
  console.log('drop event',event)
  if (event.container !== event.previousContainer) {
    copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}

// entered(event: CdkDragEnter) {
//   moveItemInArray(this., event.item.data, event.container.data);
// }

mouseEnterHandler(
  event: MouseEvent,
  chapterExpansionPanel: MatExpansionPanel
) {
  if (event.buttons && !chapterExpansionPanel.expanded) {
    chapterExpansionPanel.open();
  }
}

assignTaskToUser(){
    let request : any = {};
    let objData = {
      "userId" : "",
      "taskId" : "",
    }
    request = {
      path : 'task/assign/task',
      data : objData
    }

    this.apiService.post(request).subscribe((response:any)=>{
      console.log('response',response);
      if(response["status"]["code"] === "Assigned"){
        this.toaster.success(response["message"]);
        this.router.navigate(['/taskDashboard']);
      }
      else{
        this.toaster.error("Not assigned!");
      }
    })
}


}


//ids

// showOptions(event, id) {
//   if (event.checked == true) {
//     if (this.institutionInfo.authorizedBank == false && this.userReqFromApproval == false) {
//       $('#errorPopup').click();
//     } else {
//       this.checkedIds.push(id);
//     }
//   }
//   else if (event.checked == false) {
//     this.checkedIds.forEach((value, index) => {
//       if (value == id) {
//         this.checkedIds.splice(index, 1)
//       }
//     })
//   }
// }

// toggleCheckBox(elementId) {
//   return ((this.alreadyExist.indexOf(elementId) != -1 && this.institutionInfo.authorizedBank == true) || this.userReqFromApproval) ? true : false;
// }


//https://stackoverflow.com/questions/67337934/angular-nested-drag-and-drop-cdk-material-cdkdroplistgroup-cdkdroplist-nested
