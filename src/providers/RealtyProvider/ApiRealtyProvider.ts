import { RealtyDataset } from '../../models/RealtyData';
import { RealtyProvider } from '.';

export default class ApiRealtyProvider implements RealtyProvider {
    
    private url: string = "http://www.mocky.io/v2/5b2c9e292f00002a00ebd2d7";

    public async getRealtyData(): Promise<RealtyDataset> {
        const response = await fetch(this.url);
        return <RealtyDataset> await response.json();
    }    
}