class Block {
    public opcode: string;
    public data: string;
    public parent: string;
    public depth: number;
    public childCount: number;

    constructor() {}
}

export { Block as default };
