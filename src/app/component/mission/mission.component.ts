import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mission } from '../../model/mission';
import { MissionService } from '../../service/mission.service';
import { NotificationService } from '../../service/notification.service';


@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {

  missionForm: any;
  dataSource: MatTableDataSource<Mission>;
  isMale = true;
  isFeMale = false;


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'FirstName', 'LastName', 'DateofBirth', 'EmailId', 'Gender', 'Country', 'State', 'City', 'Address', 'Pincode', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: UntypedFormBuilder,
    private missionService: MissionService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private notificationService: NotificationService) {
    // this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
    this.missionService.getAllMissions().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    this.missionForm = this.formbulider.group({
      proCardNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDay: ['', [Validators.required]],
    });
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  onFormSubmit() {
  }


  resetForm() {
    this.missionForm.reset();
  }
}