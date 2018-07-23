import { RealtyDataset } from "../../models/RealtyData";

export interface RealtyProvider {
    getRealtyData(): Promise<RealtyDataset>;
}
