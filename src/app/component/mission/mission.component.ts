import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { Collaborator } from 'src/app/model/collaborator';
import { ClientService } from 'src/app/service/client.service';
import { CollaboratorService } from 'src/app/service/collaborator.service';
import { ProviderService } from 'src/app/service/provider.service';
import { SiteService } from 'src/app/service/site.service';
import { Client, Mission, Provider, Site } from '../../model/mission';
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
  allClients: Client[];
  selectedClient: Client

  allSites: Site[]
  selectedSite: Site

  allProviders: Provider[]
  selectedProvider: Provider

  allCollaborators: Collaborator[]
  selectedCollaborator: Collaborator


  selection = new SelectionModel<Mission>(true, []);


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'startDate', 'endDate', 'client', 'site', 'provider', 'collaborator', 'comment', 'totalWorkedHoursNumber',
   'morningWorkedHoursNumber', 'nightWorkedHoursNumber', 'holidayWorkedHoursNumber', 'nightHolidayWorkedHoursNumber', 'sundayWorkedHoursNumber'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  

  
  constructor(private formbulider: UntypedFormBuilder,
    private missionService: MissionService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private clientService: ClientService,
    private siteService: SiteService,
    private providerService: ProviderService,
    private collaboratorService: CollaboratorService) {

    this.loadAllMissions()

    this.clientService.getAll().subscribe(data => {
      this.allClients = data;
    })

    this.siteService.getAll().subscribe(data => {
      this.allSites = data;
    })

    this.providerService.getAll().subscribe(data => {
      this.allProviders = data;
    })

    this.collaboratorService.getAll().subscribe(data => {
      this.allCollaborators = data;
    })
  }

  ngOnInit() {
    this.missionForm = this.formbulider.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      client: ['', [Validators.required]],
      comment: ['', []],
      site: ['', [Validators.required]],
      provider: ['', [Validators.required]],
      collaborator: ['', [Validators.required]]
    });
  }

  onFormSubmit() {
    const mission = this.missionForm.value;
    mission.client = this.selectedClient
    mission.site = this.selectedSite
    mission.provider = this.selectedProvider
    mission.collaborator = this.selectedCollaborator
    this.missionService.createMission(mission).subscribe({
      error: (e) => this.notificationService.showError(e.message),
      complete: () => {
        this.loadAllMissions();
        this.missionForm.reset()
      }
    })
  }


  resetForm() {
    this.missionForm.reset();
  }

  selectClient(clientId) {
    this.selectedClient = this.allClients.filter(c => c.id == clientId.value)[0]
  }

  selectSite(siteId) {
    this.selectedSite = this.allSites.filter(c => c.id == siteId.value)[0]
  }

  selectProvider(providerId) {
    this.selectedProvider = this.allProviders.filter(c => c.id == providerId.value)[0]
  }

  selectCollaborator(collaboratorId) {
    this.selectedCollaborator = this.allCollaborators.filter(c => c.id == collaboratorId.value)[0]
  }

  loadAllMissions() {
    this.missionService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row: Mission): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  deleteData() {
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Êtes vous sur de vouloir effectuer la suppression ?")) {
        const calls = [];
        numSelected.forEach(element => {
          calls.push(this.missionService.deleteMission(element))
        })
        forkJoin(calls).subscribe({
          complete: () => this.loadAllMissions()
        })
      }
    } else {
      alert("Sélectionner au moins un élément à supprimer");
    }
  }

}
