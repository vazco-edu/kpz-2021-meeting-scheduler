export default class Calendar{

    constructor(id: string, summary: string, description: string) {
        this.id = id;
        this.summary = summary;
        this.description = description;
    }

    id: string | undefined;
    summary: string | undefined;
    description: string | undefined;
}
