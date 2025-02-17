import { useCallback } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';

const CodeEditor = ({ value, setValue }: { value: string; setValue: (val: string) => void }) => {
    const onChange = useCallback((val: string) => setValue(val), [setValue]);

    return (
        <CodeMirror
            className="code-editor"
            basicSetup
            theme={dracula}
            value={value}
            onChange={onChange}
            height={`${window.innerHeight * 0.75}px`}
            extensions={[StreamLanguage.define(shell)]}
        />
    );
};

export default CodeEditor;
