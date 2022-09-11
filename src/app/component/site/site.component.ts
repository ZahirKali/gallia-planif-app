import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { Client, Site } from 'src/app/model/mission';
import { ClientService } from 'src/app/service/client.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SiteService } from 'src/app/service/site.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {


  form: any;
  dataSource: MatTableDataSource<Site>;
  selection = new SelectionModel<Site>(true, []);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'name', 'address.number', 'address.type', 'address.label', 'address.postCode', 'address.city'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: UntypedFormBuilder,
    private siteService: SiteService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private notificationService: NotificationService) {
      this.loadAllSites()
  }

  ngOnInit() {
    this.form = this.formbulider.group({
      name: ['', [Validators.required]],
      address : this.formbulider.group({
        number: ['', []],
        type: ['', []],
        label: ['', []],
        postCode: ['', []],
        city: ['', []]
      })
    });
  }

  onFormSubmit() {
    const site = this.form.value;
    this.siteService.createSite(site).subscribe({
      error: (e) => this.notificationService.showError(e.message),
      complete: () => {
        this.loadAllSites();
        this.form.reset()
      }
    })
  }


  loadAllSites() {
    this.siteService.getAll().subscribe(data => {
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
    checkboxLabel(row: Site): string {
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
            calls.push(this.siteService.deleteSite(element))
          })
          forkJoin(calls).subscribe({
            complete: () => this.loadAllSites()
          })
        }
      } else {
        alert("Sélectionner au moins un élément à supprimer");
      }
    }

}
