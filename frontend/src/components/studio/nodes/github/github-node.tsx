import { NodeProps } from '@xyflow/react';

import BaseNode from '../base-node';
import GithubNodeForm from './github-node-form';
import GithubDark from '@/img/github-dark.svg';
import GithubLight from '@/img/github-light.svg';
import { useTheme } from '@/components/theme/theme-provider';

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

    const { theme } = useTheme();

    return (
        <>
            <BaseNode
                title={label}
                icon={<img src={theme === 'light' ? GithubDark : GithubLight} alt="Github Logo" />}
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
