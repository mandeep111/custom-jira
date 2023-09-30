import React from 'react';
import useCheckboxChecked, { CheckboxCheckedHandler } from '../../hooks/useCheckboxChecked';
import { Modal } from '../Modal';
import { Grid } from '../Grid';
import { Color } from '../Color';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { save } from '../../services/Sapce';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchingData: () => Promise<void>;
}

const Component = ({ isOpen, setIsOpen, fetchingData }: Props) => {

    const checkboxChange: CheckboxCheckedHandler = useCheckboxChecked();

    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [space, setSpace] = React.useState({
        id: null,
        name: '',
        tags: '',
        color: '#94a3b8',
        url: '',
        userIds: [],
        isPrivate: false
    });

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSpace((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { id, value } = target;
        const filteredValue = value.replace(/[^0-9a-z\s]/gi, '');
        setSpace((prevState) => ({
            ...prevState,
            [id]: filteredValue
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await save(space, config);
            setIsOpen(false);
            await fetchingData();
            setSpace({
                id: null,
                name: '',
                tags: '',
                color: '#94a3b8',
                url: '',
                userIds: [],
                isPrivate: false
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        setSpace((prevState) => ({
            ...prevState,
            url: space.name.toLowerCase().replace(/\s+/g, '-')
        }));
    }, [space.name]);

    return (
        <React.Fragment>
            <Modal
                title={'Create new Space'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className="max-w-xl"
            >
                <form onSubmit={(event) => void handleFormSubmit(event)}>
                    <Grid column={12} gap={1}>
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <Color onClick={handleColorChange} />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Space name'}</label>
                            <input
                                id="name"
                                type="text"
                                maxLength={32}
                                title="Only alphanumeric characters are allowed."
                                value={space.name || ''}
                                className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                autoComplete="off"
                                onChange={handleNameChange}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="checkbox-group">
                                <input
                                    id="isPrivate"
                                    type="checkbox"
                                    checked={space.isPrivate}
                                    onChange={(event) => checkboxChange(event, setSpace)}
                                />
                                <label htmlFor="isPrivate" className="label cursor-pointer inline-flex ml-1">{'Private'}</label>
                            </div>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <span
                                className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2"
                                style={{ backgroundColor: space.color }}
                            >
                                {space.name.toUpperCase().charAt(0) || '?'}
                            </span>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <label htmlFor="name" className="label">{'Link :'} {'/' + (space.url || 'your-url')}</label>
                        </Grid.Column>
                    </Grid>
                    <Grid column={12} gap={1} className="mt-5 text-center">
                        <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Create'}</button>
                        </Grid.Column>
                    </Grid>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default Component;