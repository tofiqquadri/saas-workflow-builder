import React from 'react';
import uuid4 from 'uuid4';
import styles from './SideBar.module.css';

export default ({ nodeTypes, onExport, onLoad }) => {
    const onDragStart = (event, nodeData) => {
        event.dataTransfer.setData(
            'application/reactflow',
            JSON.stringify(nodeData)
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className={styles.Aside}>
            <button
                onClick={onExport}
                className={`px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm hover:bg-sky-300 mb-8`}>
                Export
            </button>

            <button
                onClick={onLoad}
                className={`px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm hover:bg-sky-300 ml-4 mb-8`}>
                Load
            </button>

            {nodeTypes.map((uiNode) => {
                const { label } = uiNode;
                const id = uuid4();

                return (
                    <div
                        key={id}
                        className={`${styles.DndNode}`}
                        onDragStart={(event) => onDragStart(event, uiNode)}
                        draggable>
                        {label}
                    </div>
                );
            })}
        </aside>
    );
};
