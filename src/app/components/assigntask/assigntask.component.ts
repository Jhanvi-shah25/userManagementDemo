import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getAllTask();
    this.getAllUsers();
  }

  getAllTask(){
    let request : Request = {
      path : 'task/getAll'
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.taskList = response;
      console.log('in task',response)
    })
  }

  getAllUsers(){
    let request : Request = {
      path : 'users/getAll'
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.userList = response;
      console.log(this.userList)
    })
  }



  drop(event: any) {
    console.log(event.previousContainer,event.container)
    if (event.previousContainer !== event.container) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    if (event.previousContainer.data) {
      this.menu = this.menu.filter((f) => !f.temp);
    }
  }

  exited(event: any) {
    const currentIdx = event.container.data.findIndex(
      (f:any) => f.id === event.item.data.id
    );
    this.menu.splice(currentIdx + 1, 0, {
      ...event.item.data,
      temp: true,
    });
  }
  entered() {
    this.menu = this.menu.filter((f) => !f.temp);
  }

  drop1(event: CdkDragDrop<string[]>) {
    console.log(event.previousContainer,event.container)
    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    // }
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





// nestedArray = [
//   {
//     title: 'Parent 1',
//     id: '1', // Make sure ID is in string as to attach it with cdkDropListConnectedTo we need it in string
//     child: [
//       {
//         title: 'Child 11',
//       },
//       {
//         title: 'Child 12',
//       },
//       {
//         title: 'Child 13',
//       },
//     ],
//   },
//   {
//     title: 'Parent 2',
//     id: '2',
//     child: [
//       {
//         title: 'Child 21',
//       },
//       {
//         title: 'Child 22',
//       },
//       {
//         title: 'Child 23',
//       },
//     ],
//   },
//   {
//     title: 'Parent 3',
//     id: '3',
//     child: [
//       {
//         title: 'Child 31',
//       },
//       {
//         title: 'Child 32',
//       },
//       {
//         title: 'Child 33',
//       },
//     ],
//   },
// ];
// idList = [];

// ngOnInit() {
//   this.idList = this.nestedArray.map((parent) => parent.id);
// }

// dropItem(event) {
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
// }

// mouseEnterHandler(
//   event: MouseEvent,
//   chapterExpansionPanel: MatExpansionPanel
// ) {
//   if (event.buttons && !chapterExpansionPanel.expanded) {
//     chapterExpansionPanel.open();
//   }
// }