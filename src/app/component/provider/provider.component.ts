import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { Provider } from 'src/app/model/mission';
import { ClientService } from 'src/app/service/client.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProviderService } from 'src/app/service/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {


  form: any;
  dataSource: MatTableDataSource<Provider>;
  selection = new SelectionModel<Provider>(true, []);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'name'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: UntypedFormBuilder,
    private providerService: ProviderService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private notificationService: NotificationService) {
      this.loadAllproviders()
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
    const provider = this.form.value;
    this.providerService.createProvider(provider).subscribe({
      error: (e) => this.notificationService.showError(e.message),
      complete: () => {
        this.loadAllproviders();
        this.form.reset()
      }
    })
  }


  loadAllproviders() {
    this.providerService.getAll().subscribe(data => {
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
    checkboxLabel(row: Provider): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    

    deleteData() {
      const numSelected = this.selection.selected;
      if (numSelected.length > 0) {
        if (confirm("??tes vous sur de vouloir effectuer la suppression ?")) {
          const calls  = [];
          numSelected.forEach(element => {
            calls.push(this.providerService.deleteProvider(element))
          })
          forkJoin(calls).subscribe({
            complete: () => this.loadAllproviders()
          })
        }
      } else {
        alert("S??lectionner au moins un ??l??ment ?? supprimer");
      }
    }

}
