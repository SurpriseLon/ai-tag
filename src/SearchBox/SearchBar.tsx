import { Setter, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import { Data } from '../App';
import { stringToTags } from '../use/TagsConvertor';
import { useTranslation } from '../../i18n';
import { useDragAndDropData } from '../use/useDragAndDropData';
import { Notice } from '../utils/notice';
import { Message } from '../MessageHint';

export const SearchBar = () => {
    const { usersCollection, lists, searchText, iconBtn } = useContext(Data);
    const triggerSearch = debounce(searchText, 200) as Setter<string>;
    const { t } = useTranslation();
    const { receive, detect } = useDragAndDropData();
    return (
        <nav class="flex w-full items-center">
            <input
                class="input my-2 mr-1 flex-1"
                value={searchText()}
                placeholder={t('searchBox.hint.searchPlaceholder')}
                oninput={(e: any) => triggerSearch(e.target.value)}
            ></input>

            <div
                class="flex "
                classList={{
                    'font-icon': iconBtn(),
                }}
            >
                <div
                    class="btn flex-none bg-red-800 px-4"
                    onclick={() => triggerSearch('')}
                    title={t('searchBox.hint.deleteHint')}
                    ondragover={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        detect(e.dataTransfer, {
                            USER_SELECTED() {
                                Message.warn(t('searchBox.hint.deleteMessage'));
                            },
                        });
                    }}
                    onDrop={(e) => {
                        receive(e.dataTransfer, 'USER_SELECTED', (item) => {
                            usersCollection((i) => i.filter((i) => i.en !== item.en));
                            Notice.success(t('success'));
                        });
                    }}
                >
                    {iconBtn() ? 'clear' : t('clear')}
                </div>
                <span
                    class="btn flex-none"
                    onclick={() => {
                        const name = searchText();
                        usersCollection((i) => [...i, ...stringToTags(name, lists())]);
                    }}
                >
                    {iconBtn() ? 'create' : t('searchBox.create')}
                </span>
            </div>
        </nav>
    );
};
