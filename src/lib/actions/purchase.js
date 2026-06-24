import { serverMutation } from "../core/server";

export const createPurchase = async (purchaseData) => {
    return serverMutation('/api/purchases', purchaseData);
}

