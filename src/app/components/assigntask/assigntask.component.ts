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
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
