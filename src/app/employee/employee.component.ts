import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';


interface Country {
  CountryId: string;
  CountryName: string;
}

interface State {
  StateId: string;
  StateName: string;
  CountryId: string;
}

interface City {
  Cityid: string;
  CityName: string;
  StateId: string;
  CountryId: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<Employee[]>;
  dataSource: MatTableDataSource<Employee>;
  selection = new SelectionModel<Employee>(true, []);
  employeeIdUpdate = null;
  massage = null;
  allCountry: Observable<Country[]>;
  allState: Observable<State[]>;
  allCity: Observable<City[]>;
  CountryId = null;
  StateId = null;
  CityId = null;
  SelectedDate = null;
  isMale = true;
  isFeMale = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'FirstName', 'LastName', 'DateofBirth', 'EmailId', 'Gender', 'Country', 'State', 'City', 'Address', 'Pincode', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: UntypedFormBuilder, private employeeService: EmployeeService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.employeeService.getAllEmployee().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      DateofBirth: ['', [Validators.required]],
      EmailId: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Pincode: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{6}')])]
    });
    this.FillCountryDDL();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

 /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.EmpId + 1}`;
  }
  
  DeleteData() {
    debugger;
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items ")) {
        this.employeeService.deleteData(numSelected).subscribe(result => {
          this.SavedSuccessful(2);
          this.loadAllEmployees();
        })
      }
    } else {
      alert("Select at least one row");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAllEmployees() {
    this.employeeService.getAllEmployee().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onFormSubmit() {
    this.dataSaved = false;
    const employee = this.employeeForm.value;
    this.CreateEmployee(employee);
    this.employeeForm.reset();
  }

  loadEmployeeToEdit(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      this.massage = null;
      this.dataSaved = false;
      this.employeeIdUpdate = employee.EmpId;
      this.employeeForm.controls['FirstName'].setValue(employee.FirstName);
      this.employeeForm.controls['LastName'].setValue(employee.LastName);
      this.employeeForm.controls['DateofBirth'].setValue(employee.DateofBirth);
      this.employeeForm.controls['EmailId'].setValue(employee.EmailId);
      this.employeeForm.controls['Gender'].setValue(employee.Gender);
      this.employeeForm.controls['Address'].setValue(employee.Address);
      this.employeeForm.controls['Pincode'].setValue(employee.Pincode);
      this.employeeForm.controls['Country'].setValue(employee.CountryId);
      this.allState = this.employeeService.getState(employee.CountryId);
      this.CountryId = employee.CountryId;
      this.employeeForm.controls['State'].setValue(employee.StateId);
      this.allCity = this.employeeService.getCity(employee.StateId);
      this.StateId = employee.StateId;
      this.employeeForm.controls['City'].setValue(employee.Cityid);
      this.CityId = employee.Cityid;
      this.isMale = employee.Gender.trim() == "0" ? true : false;
      this.isFeMale = employee.Gender.trim() == "1" ? true : false;
    });

  }
  CreateEmployee(employee: Employee) {
    console.log(employee.DateofBirth);
    if (this.employeeIdUpdate == null) {
      employee.CountryId = this.CountryId;
      employee.StateId = this.StateId;
      employee.Cityid = this.CityId;

      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.employeeForm.reset();
        }
      );
    } else {
      employee.EmpId = this.employeeIdUpdate;
      employee.CountryId = this.CountryId;
      employee.StateId = this.StateId;
      employee.Cityid = this.CityId;
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();
      });
    }
  }
  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();

      });
    }

  }

  FillCountryDDL() {
    this.allCountry = this.employeeService.getCountry();
    this.allState = this.StateId = this.allCity = this.CityId = null;
  }

  FillStateDDL(SelCountryId) {
    this.allState = this.employeeService.getState(SelCountryId.value);
    this.CountryId = SelCountryId.value;
    this.allCity = this.CityId = null;
  }

  FillCityDDL(SelStateId) {
    this.allCity = this.employeeService.getCity(SelStateId.value);
    this.StateId = SelStateId.value
  }

  GetSelectedCity(City) {
    this.CityId = City.value;
  }

  resetForm() {
    this.employeeForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.isMale = true;
    this.isFeMale = false;
    this.loadAllEmployees();
  }

  SavedSuccessful(isUpdate) {
    if (isUpdate == 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } 
    else if (isUpdate == 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
