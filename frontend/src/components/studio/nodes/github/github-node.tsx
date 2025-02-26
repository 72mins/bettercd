import { NodeProps } from '@xyflow/react';

import BaseNode from '../base-node';
import GithubNodeForm from './github-node-form';
import GithubIcon from '@/img/github-dark.svg';

interface GithubNodeProps extends NodeProps {
    data: {
        label: string;
        order: number;
    };
}

const GithubNode = (props: GithubNodeProps) => {
    const {
        data: { label, order },
    } = props;

    return (
        <>
            <BaseNode
                title={label}
                icon={<img src={GithubIcon} alt="Github Logo" />}
                description="Checkout latest changes from Github repository"
                order={order}
                stageType="VCS"
            >
                <GithubNodeForm />
            </BaseNode>
        </>
    );
};

export default GithubNode;
