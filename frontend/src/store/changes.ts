import { create } from 'zustand';

export interface Params {
    [key: string]: string;
}

interface Change {
    stage_id: number;
    params: Params | null;
}

interface ChangesStore {
    changeCount: number;
    changes: Change[];
    resetChanges: () => void;
    addChange: (change: Change) => void;
}

export const useChangesStore = create<ChangesStore>((set) => ({
    changeCount: 0,
    changes: [],

    resetChanges: () => {
        set({
            changeCount: 0,
            changes: [],
        });
    },

    addChange: (change: Change) => {
        set((state) => {
            // Find if there's an existing change with the same stage_id
            const existingChangeIndex = state.changes.findIndex((c) => c.stage_id === change.stage_id);

            let updatedChanges;
            let newChangeCount = state.changeCount;

            if (existingChangeIndex !== -1) {
                const existingChange = state.changes[existingChangeIndex];
                let newKeysCount = 0;

                // Check for new keys only if both params objects are non-null
                if (change.params !== null && existingChange.params !== null) {
                    const newKeys = Object.keys(change.params).filter((key) => !(key in existingChange.params!));
                    newKeysCount = newKeys.length;
                } else if (change.params !== null && existingChange.params === null) {
                    // If existing params is null but new params isn't, count all keys as new
                    newKeysCount = Object.keys(change.params).length;
                }

                // Increment changeCount only if there are new keys
                if (newKeysCount > 0) {
                    newChangeCount += newKeysCount;
                }

                // Merge the params
                updatedChanges = [...state.changes];
                updatedChanges[existingChangeIndex] = {
                    ...updatedChanges[existingChangeIndex],
                    params:
                        change.params !== null
                            ? existingChange.params !== null
                                ? { ...existingChange.params, ...change.params }
                                : { ...change.params }
                            : existingChange.params,
                };
            } else {
                // If not found, add as a new change
                updatedChanges = [...state.changes, change];

                // Increment changeCount by the number of params in the new change
                if (change.params !== null) {
                    newChangeCount += Object.keys(change.params).length;
                }
            }

            return {
                changeCount: newChangeCount,
                changes: updatedChanges,
            };
        });
    },
}));
