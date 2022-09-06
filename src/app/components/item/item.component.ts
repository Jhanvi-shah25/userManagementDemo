import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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


  @Input() item: any;
  @Input()
  connectedTo!: string[];
  @Output() itemDrop: EventEmitter<CdkDragDrop<any>>;

  constructor() {
    this.itemDrop = new EventEmitter();
  }

  public onDragDrop(event:any): void {
    this.itemDrop.emit(event);
  }
  ngOnInit(){
    console.log(this.item,'this item is here')
  }
}
