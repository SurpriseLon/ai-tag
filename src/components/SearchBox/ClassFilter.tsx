import { createEffect, createSelector, For, Show, useContext } from 'solid-js';
import type { ITagData } from '../../app/main/App';
import { CSVToJSON } from '../../utils/CSVToJSON';
import { atom, resource, useEffectWithoutFirst } from '@cn-ui/use';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import { memoize } from 'lodash-es';
import { ColorPicker } from '../../utils/ColorPicker';
import { GlobalData } from '../../store/GlobalData';
import { Notice } from '../../utils/notice';

const getClassify = memoize(async () => {
    const binary = await fetch('./tagClassify.csv').then((res) => res.blob());
    const data = await CSVToJSON<{ en: string; cn: string; type: string }>(binary);

    return data;
});
export const useClassFilter = () => {
    const { searchText, result } = GlobalData.getApp('tag-control')!;
    const Colors = new ColorPicker();
    const FilterClass = new Set(['全部']);
    const data = resource(() =>
        getClassify().then((res) =>
            res.map((i) => {
                FilterClass.add(i.type);
                return { ...i, r18: 0, count: Infinity, text: i.en, emphasize: 0 } as ITagData & {
                    type: string;
                };
            })
        )
    );
    const selectType = atom('全部');
    const isSelect = createSelector(selectType);
    useEffectWithoutFirst(() => {
        if (FilterClass.has(selectType()) && data.isReady()) {
            if (selectType() === '全部') {
                Notice.success('直接搜索即可');
            } else {
                const showing = data().filter((i) => i.type === selectType());
                result(showing);
            }
        }
    }, [selectType]);
    const ClassFilterList = () => {
        return (
            <Show when={data.isReady()}>
                <For each={[...FilterClass.values()]}>
                    {(item) => {
                        return (
                            <div
                                class={'btn  '}
                                classList={{
                                    [Colors.pick() + 'text-white ']: isSelect(item),
                                }}
                                onclick={() => {
                                    selectType(item);
                                }}
                            >
                                {item}
                            </div>
                        );
                    }}
                </For>
            </Show>
        );
    };
    return {
        ClassFilterList,
        selectType,
    };
};
export const ClassFilter = () => {
    const { ClassFilterList, selectType } = useClassFilter();
    return (
        <FloatPanelWithAnimate
            animateProps={{
                anime: 'scale',
                extraClass: 'animate-duration-150',
            }}
            popup={() => (
                <div class="blur-background mt-4 flex h-64 w-32 flex-col  gap-2 overflow-auto rounded-xl  p-2 ">
                    <ClassFilterList></ClassFilterList>
                </div>
            )}
        >
            <div class="btn relative bg-pink-700 text-neutral-300">{selectType}</div>
        </FloatPanelWithAnimate>
    );
};
