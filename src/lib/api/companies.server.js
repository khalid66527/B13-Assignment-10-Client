import { getUserSession } from "../core/session";
import { getArtistCompany } from "./companies";

export const getLoggedInUserCompany = async () => {
    const user = await getUserSession();
    return getArtistCompany(user?.id);
};
