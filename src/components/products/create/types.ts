export interface IProductCreate {
    category_id:string;
    name: string;
    description: string;
    price: string;
    quantity: string;
    images: File[];
}