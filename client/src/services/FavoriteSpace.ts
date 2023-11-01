import { API } from '../utils/api';
import Http from './Http';

export default class FavoriteSpaceService {

    static async Fetch<T>(setState: (data: T[]) => void) {
        try {
            const response: T[] = await Http.getAll(`${API.USER_PROFILE}/favorite/space`);
            setState(response);
        } catch (error) {
            throw new Error(error as string);
        }
    }

}
