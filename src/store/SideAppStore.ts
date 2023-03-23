import { atom } from '@cn-ui/use';
import isMobile from 'is-mobile';
import type { PanelIds } from '../app/main/SideApp';
import { createSelector } from 'solid-js';
import { GlobalData } from './GlobalData';

export type ISideAPPStore = ReturnType<typeof initSideApp>;

export const initSideApp = () => {
    const sideAppMode = atom(!isMobile());
    const visibleId = atom<PanelIds | ''>('ai-prompt');
    const isPanelVisible = createSelector(visibleId);
    const context = { sideAppMode, visibleId, isPanelVisible };
    GlobalData.register('side-app', context);
    return context;
};
