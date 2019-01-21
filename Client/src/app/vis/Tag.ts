export class Tag {
    constructor(
        public name: string,
        public type: string,
        public color: string,
        public position: string,
        public comment: string,
        public date?: string,
        public variable?: string,
        public id?: string
    ) { }

    static Clone(tag: Tag) {
        return new Tag(
            tag.name,
            tag.type,
            tag.color,
            tag.position,
            tag.comment,
            tag.date,
            tag.variable,
            tag.id
        );
    }
}
