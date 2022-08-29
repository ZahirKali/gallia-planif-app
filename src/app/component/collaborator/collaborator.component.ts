import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable, of } from 'rxjs';
import { Collaborator } from 'src/app/model/collaborator';
import { CollaboratorService } from 'src/app/service/collaborator.service';
import { NotificationService } from 'src/app/service/notification.service';


@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.css']
})
export class CollaboratorComponent implements OnInit {

  form: any;
  dataSource: MatTableDataSource<Collaborator>;
  selection = new SelectionModel<Collaborator>(true, []);
  isMale = true;
  isFeMale = false;


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'proCardNumber', 'firstName', 'lastName', 'birthDay'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: UntypedFormBuilder,
    private collaboratorService: CollaboratorService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private notificationService: NotificationService) {
      this.loadAllCollaborators()
  }

  ngOnInit() {
    this.form = this.formbulider.group({
      proCardNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDay: ['', [Validators.required]],
    });
  }

  onFormSubmit() {
    const collaborator = this.form.value;
    this.collaboratorService.createCollaborator(collaborator)
    .subscribe({
      error: (e) => this.notificationService.showError(e.message),
      complete: () => {
        this.loadAllCollaborators();
        this.form.reset()
      }
    })
  }

  loadAllCollaborators() {
    this.collaboratorService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }

  isAllSelected() : boolean {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row: Collaborator): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    

    deleteData() {
      const numSelected = this.selection.selected;
      if (numSelected.length > 0) {
        if (confirm("Êtes vous sur de vouloir effectuer la suppression ?")) {
          const calls  = [];
          numSelected.forEach(element => {
            calls.push(this.collaboratorService.deleteCollaborator(element))
          })
          forkJoin(calls).subscribe({
            complete: () => this.loadAllCollaborators()
          })
        }
      } else {
        alert("Sélectionner au moins un élément à supprimer");
      }
    }
}
