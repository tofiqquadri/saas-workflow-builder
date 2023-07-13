import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Icon from '@mdi/react';
import { mdiEarthArrowRight } from '@mdi/js';
import { mdiShieldAccount } from '@mdi/js';
import { mdiNavigationVariant } from '@mdi/js';

import styles from './CustomNode.module.css';

const ICONS_MAP = {
    earthArrowRight: mdiEarthArrowRight,
    shieldAccount: mdiShieldAccount,
    navigationVarient: mdiNavigationVariant
};

const _mapIconTypeToMUIcon = (node) => {
    return ICONS_MAP[node.icon];
};

export default memo(({ data, isConnectable, ...rest }) => {
    const { label, hasSource, hasTarget } = data;
    const icon = _mapIconTypeToMUIcon(data);

    return (
        <div className={styles.Container}>
            {hasSource && (
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{ background: '#555' }}
                    onConnect={(params) =>
                        console.log('handle onConnect', params)
                    }
                    isConnectable={isConnectable}
                />
            )}
            <div
                className={`${styles.Wrapper} flex items-center justify-between space-x-1`}
                data-id={rest.id}
                dataset={{ ...data, ...rest }}>
                <Icon
                    data-id={rest.id}
                    path={icon}
                    size={0.75}
                    dataset={{ ...data, ...rest }}
                />
                <span data-id={rest.id}>{label}</span>
            </div>
            {hasTarget && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{
                        background: '#555'
                    }}
                    isConnectable={isConnectable}
                />
            )}
        </div>
    );
});
