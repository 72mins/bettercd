import { NodeProps } from '@xyflow/react';

import BaseNode from '../base-node';
import GithubNodeForm from './github-node-form';
import GithubDark from '@/img/github-dark.svg';
import GithubLight from '@/img/github-light.svg';
import { useTheme } from '@/components/theme/theme-provider';
import { Params } from '@/store/changes';

interface GithubNodeProps extends NodeProps {
    data: {
        label: string;
        order: number;
        params: Params;
        last_order: number;
    };
}

const GithubNode = (props: GithubNodeProps) => {
    const {
        id,
        data: { label, order, params, last_order },
    } = props;

    const { theme } = useTheme();

    return (
        <>
            <BaseNode
                id={id}
                title={label}
                icon={<img src={theme === 'light' ? GithubDark : GithubLight} alt="Github Logo" />}
                description="Checkout latest changes from Github repository"
                order={order}
                last_order={last_order}
                stageType="VCS"
            >
                <GithubNodeForm stageID={id} params={params} />
            </BaseNode>
        </>
    );
};

export default GithubNode;
