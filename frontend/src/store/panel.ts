import { create } from 'zustand';

const INITIAL_VALUE = `#!/bin/bash\n\n# Write your bash script here...\n\n`;

interface PanelStore {
    panel: string;

    panelOpen: boolean;
    openPanel: (panel: string) => void;
    closePanel: () => void;

    panelValue: string;
    setPanelValue: (panelValue: string) => void;
}

export const usePanelStore = create<PanelStore>((set) => ({
    panel: '0',

    panelOpen: false,
    openPanel: (panel) => set({ panel: panel, panelOpen: true }),
    closePanel: () => set({ panel: '0', panelOpen: false }),

    panelValue: INITIAL_VALUE,
    setPanelValue: (panelValue) => set({ panelValue }),
}));
