import React from 'react';

interface Props {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Component = ({ onClick }: Props) => {

    const colors = [
        { class: 'bg-slate-400', value: '#94A3B8' },
        { class: 'bg-gray-400', value: '#9CA3AF' },
        { class: 'bg-zinc-400', value: '#A1A1AA' },
        { class: 'bg-neutral-400', value: '#A3A3A3' },
        { class: 'bg-stone-400', value: '#A8A29E' },
        { class: 'bg-red-400', value: '#F87171' },
        { class: 'bg-orange-400', value: '#FB923C' },
        { class: 'bg-amber-400', value: '#FBBF24' },
        { class: 'bg-yellow-400', value: '#FACC15' },
        { class: 'bg-lime-400', value: '#A3E635' },
        { class: 'bg-green-400', value: '#4ADE80' },
        { class: 'bg-emerald-400', value: '#34D399' },
        { class: 'bg-teal-400', value: '#2DD4BF' },
        { class: 'bg-cyan-400', value: '#22D3EE' },
        { class: 'bg-sky-400', value: '#38BDF8' },
        { class: 'bg-blue-400', value: '#60A5FA' },
        { class: 'bg-indigo-400', value: '#818CF8' },
        { class: 'bg-violet-400', value: '#A78BFA' },
        { class: 'bg-purple-400', value: '#C084FC' },
        { class: 'bg-fuchsia-400', value: '#E879F9' },
        { class: 'bg-pink-400', value: '#F472B6' },
        { class: 'bg-rose-400', value: '#FB7185' }
    ];

    return (
        <React.Fragment>
            {colors.map((color, index) => (
                <React.Fragment key={index}>
                    <button type="button" className={`rounded-full ${color.class} p-3 mr-2 w-0 mt-3 focus:ring-4 focus:ring-default`} value={color.value} title={color.value} onClick={onClick}></button>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default Component;