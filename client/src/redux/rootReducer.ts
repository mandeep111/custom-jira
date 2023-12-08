import { combineReducers } from 'redux';
import authenticationReducer from './Authentication/reducers';
import { State as Authentication } from './Authentication/type';
import dialogReducer from './Dialog/reducers';
import { State as Dialog } from './Dialog/type';
import editReducer from './Edit/reducers';
import { State as Edit } from './Edit/type';
import projectReducer from './Project/reducers';
import { State as Project } from './Project/type';
import sidebarReducer from './Sidebar/reducers';
import { State as Sidebar } from './Sidebar/type';
import subtaskReducer from './Subtask/reducers';
import { State as Subtask } from './Subtask/type';
import taskReducer from './Task/reducers';
import { State as Task } from './Task/type';
import themeReducer from './Theme/reducers';
import { State as Theme } from './Theme/type';
import userReducer from './User/reducers';
import { State as User } from './User/type';

export interface RootState {
    authentication: Authentication;
    dialog: Dialog;
    edit: Edit,
    project: Project;
    sidebar: Sidebar;
    task: Task;
    subtask: Subtask
    theme: Theme;
    user: User;
}

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    dialog: dialogReducer,
    edit: editReducer,
    project: projectReducer,
    sidebar: sidebarReducer,
    task: taskReducer,
    subtask: subtaskReducer,
    theme: themeReducer,
    user: userReducer
});

export default rootReducer;