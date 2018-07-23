export interface RealtyData {
    id: string,
    price: number,
    bedrooms: number,
    bathrooms: number,
    stories: number,
    type: string,
    year: number
}

export interface RealtyDataset extends Array<RealtyData> {}