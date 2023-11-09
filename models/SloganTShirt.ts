interface ISloganTShirt{
    id: number;
    slogan: string;
    tshirt: string;
    size: string;
    color: string;
}

export default class SloganTShirt implements ISloganTShirt{
    id: number;
    slogan: string;
    tshirt: string;
    size: string;
    color: string;
    constructor(id: number, slogan: string, tshirt: string, size: string, color: string) {
        this.id = id;
        this.slogan = slogan;
        this.tshirt = tshirt;
        this.size = size;
        this.color = color;
    }   
}
