import { useCallback } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { vim } from '@replit/codemirror-vim';

import { useTheme } from '@/components/theme/theme-provider';

const CodeEditor = ({ value, setValue }: { value: string; setValue: (val: string) => void }) => {
    const { theme } = useTheme();

    const onChange = useCallback((val: string) => setValue(val), [setValue]);

    return (
        <CodeMirror
            className="code-editor"
            theme={theme === 'light' ? githubLight : githubDark}
            value={value}
            onChange={onChange}
            height={`${window.innerHeight * 0.8}px`}
            extensions={[vim({ status: true }), StreamLanguage.define(shell)]}
        />
    );
};

export default CodeEditor;
