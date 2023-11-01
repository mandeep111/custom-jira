import { API } from '../utils/api';
import Http from './Http';

export default class SpaceService {

    static async Fetch<T>(setState: (data: T[]) => void) {
        try {
            const response: T[] = await Http.getAll(`${API.SPACE}/all`);
            setState(response);
        } catch (error) {
            throw new Error(error as string);
        }
    }

}
