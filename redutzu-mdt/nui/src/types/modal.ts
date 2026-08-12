import React from "react";

export default interface Modal {
    icon?: string;
    title: string;
    description?: string;
    content?: React.FC;
    onClick: (...args: any[]) => void;
}
