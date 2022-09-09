import { CdkDragDrop, CdkDragEnter, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService, Request } from 'src/app/services/api.service';

@Component({
  selector: 'app-assigntask',
  templateUrl: './assigntask.component.html',
  styleUrls: ['./assigntask.component.scss']
})
export class AssigntaskComponent implements OnInit {

  taskList : any =[];
  userList : any =[];
  userId : any =[];
  taskId : string ="";
  addedTaskArray : any =[]
  singleTaskList = {};

public nestedArray :any = [{
  "title" : "taskList",
  "id" : '101',
  "child" : []
},{
  "title" : "userList",
  "id" : '102',
  "child" : [{
    "id":"103",
    "child":[]
  }]
}];

public get connectedTo(): string[] {
  return this.getIdsRecursive(this.nestedArray[1])
}

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

  getSingleTaskList(taskid : string){
    console.log(taskid);
    let request : Request = {
      path : 'task/getSingleTask/' + taskid
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.singleTaskList = response;
    })
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
         this.nestedArray[0]["child"] = this.taskList;
        //  this.nestedArray[1]["child"][i]["child"] = this.taskList;
         console.log('nest inside',  this.nestedArray[1],this.nestedArray,this.nestedArray[1],this.nestedArray[1]["child"],this.nestedArray[1]["child"]["child"])
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
    return new Promise((resolve)=>{
    this.apiService.get(request).subscribe((response:any)=>{
      this.userList = response;
      for(let i=0;i<this.userList.length;i++){
        this.nestedArray[1]["child"] = this.userList;
        this.nestedArray[1]["child"][i]["child"] = [];
       }

      //  for(let i=0;i<this.taskList.length;i++){
      //   this.nestedArray[1]["child"][i]["child"] = this.taskList;
      //   console.log(this.nestedArray,'hihi')
      //  }

      console.log('nested array',this.nestedArray)
    })
    resolve(null);
    })

  } 




dropItem(event:any) {
  console.log('drop event',event,event.item.dropContainer.id,event.container.data)
  if (event.previousContainer !== event.container) {

    console.log('in if',event.container.data[0])
    event.previousContainer.data.forEach((d:any,i:number)=>{
      console.log(d,'data here')
      if(d["_id"] === event.item.element.nativeElement.id){
        console.log('matched!!')
        this.userId.push(event.container.id);
        var newArr = new Set(this.userId);
        this.userId = [...newArr];
        this.taskId = d["_id"];
        console.log(i,d,'debug',this.nestedArray[1]["child"])
        // this.nestedArray[1]["child"][event.currentIndex]["child"].push(d);
        copyArrayItem(
          event.previousContainer.data,
          this.nestedArray[1]["child"][event.currentIndex]["child"],
          event.previousIndex,
          event.currentIndex
        );
      }
    })
    // for(let i=0;i<=event.previousContainer.data.length;i++){
    //   if(event.previousContainer.data["_id"] === event.item.element.nativeElement.id){
    //     console.log('matched!!')
    //     this.userId.push(event.container.id);
    //     this.taskId = event.previousContainer.data["_id"];
    //     console.log(i,event.previousContainer.data,'debug')
    //     this.nestedArray[1]["child"][i]["child"] = event.previousContainer.data;
    //   }
    // }
    console.log(this.userId,this.taskId,'both here',this.nestedArray[1]);


    // this.userId.push(event.container.id);
    // this.taskId = event.item.dropContainer.id;
    console.log(this.userId,this.taskId,'www',this.nestedArray[1]["child"][event.currentIndex]["child"])

  } else {
    console.log('in else')
    transferArrayItem(
      event.previousContainer.data,
      this.nestedArray[1]["child"][event.currentIndex]["child"],
      event.previousIndex,
      event.currentIndex
    );
  }
  console.log('in vv',event.container.data[0])
  // event.container.data.forEach((singleItem:any,i:any)=>{
  //   if(singleItem["_id"] === event.item.element.nativeElement.id){
  //     this.nestedArray[1]["child"]["child"][i] = singleItem;
  //   }
  // })
  // for(let i=0;i<=event.container.data.length;i++){
  //   console.log(event.container.data)
  //   if(event.container.data[i]._id === event.container.id){
  //     console.log('match')
  //     this.nestedArray[1]["child"][i]["child"] = event.container.data[i];
  //   }
  // }
  // console.log(this.nestedArray[1],'see new array')
}

// entered(event: CdkDragEnter) {
//   moveItemInArray(this., event.item.data, event.container.data);
// }

// dropItem(event:any){
//   console.log(event)
//   if (event.previousContainer !== event.container) {
//     copyArrayItem(
//       event.previousContainer.data,
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
      "userId" : this.userId,
      "taskId" : this.taskId,
    }
    request = {
      path : 'task/assign/task',
      data : objData
    }
    this.apiService.post(request).subscribe((response:any)=>{
      console.log('response',response);
      if(response["status"]["code"] === "Assigned" && this.userId && this.taskId){
        this.toaster.success(response["status"]["message"]);
        this.router.navigate(['/taskDashboard']);
      }
      else{
        this.toaster.error("Please assign the task first");
      }
    })
}



private getIdsRecursive(item: any): string[] {
  let ids : any =[];

  if(item.child!=undefined){
    item.child.forEach((childItem:any) => {
      ids.push(childItem._id)
      ids = ids.concat(this.getIdsRecursive(childItem));
    });
  }
  return ids;
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



