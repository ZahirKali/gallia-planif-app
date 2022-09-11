import { Collaborator } from "./collaborator";


/**
 * Mission representation
 */
export class Mission {
    id: number;
    startDate: Date;
    endDate: Date;
    comment: string;
    client: Client;
    site: Site;
    provider: Provider;
    collaborator: Collaborator;
    totalWorkedHoursNumber: number;
    morningWorkedHoursNumber: number;
    nightWorkedHoursNumber: number;
    holidayWorkedHoursNumber: number;
    nightHolidayWorkedHoursNumber: number;
    sundayWorkedHoursNumber: number;
}

export class Client {
    id: number;
    name: string;
    address: Address;
}

export class FlatClient {
    id: number;
    name: string;    
}

export class Site {
    id: number;
    name: string;
    address: Address;
}

export class Address {
    id: number;
    number: number;
    type: string;
    label: string;
    postCode: number;
    city: string;
}

export class Provider {
    id: number;
    name: string;
}
