import React from 'react';

// Assets
import './styles.scss';

type BadgeTypes = 'default' | 'normal' | 'error';

interface Props {
    label: string;
    type?: BadgeTypes;
}

const Badge: React.FC<Props> = ({ label, type = 'default' }) => {
    return (
        <div className={`badge ${type}`}>
            {label}
        </div>
    );
}

export default Badge;
