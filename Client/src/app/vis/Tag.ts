export class Tag {
    id: string;

    constructor(
        public name: string,
        public type: string,
        public color: string,
        public position: string,
        public comment: string,
        public date?: string,
        public variable?: string
    ) { }
}
