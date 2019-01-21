export class DatasetDetail {
    name: string;
    minValue: number;
    maxValue: number;
}

export class DatasetInfo {
    serverEndPoint: string;
    visImageBasePath: string;
    minDate: string;
    maxDate: string;
    variableList: DatasetDetail[];
}
