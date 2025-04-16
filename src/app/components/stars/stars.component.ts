import { Component, Input, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, RouterModule} from '@angular/router';

@Component({
  selector: 'app-stars',
  standalone: true,
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
  @Input() type: string = '';
  @Input() rating: number = 0;
  id!: number;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
  }
}
