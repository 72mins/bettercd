import { useCallback, useState } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';

const CodeEditor = () => {
    const [value, setValue] = useState<string>("#!/bin/bash\n\n# Write your bash script here\n\necho 'Hello, World!'");

    const onChange = useCallback((val: string) => {
        console.log(val);

        setValue(val);
    }, []);

    return (
        <CodeMirror
            basicSetup
            theme={dracula}
            value={value}
            onChange={onChange}
            height="500px"
            extensions={[StreamLanguage.define(shell)]}
        />
    );
};

export default CodeEditor;
