import axios from '@/lib/axios';
import type { Method } from 'axios';
import { toast, type ToastOptions } from "vue3-toastify";
import { h, type Ref, type RendererElement } from "vue";
import NotifyCallback from "@/components/backend/NotifyCallback.vue";
import type {NotifyCallbackOptions} from "@/types/NotifyCallbackOptions";
import type { AxiosResponse } from "axios";
import { useUsers } from "@/stores/user";

export declare type FetchResponse<T> = {
    error?: AxiosResponse,
    data?: T,
    isSuccessful: boolean
}

const RESPONSE_UNAUTHORIZED = 401;
const RESPONSE_NOT_FOUND = 404;
const RESPONSE_UNPROCESSABLE = 422;

const NOTIFY_AUTO_CLOSE_TIMEOUT = 5000;

type Action = 'index' | 'show' | 'store' | 'update' | 'delete' | 'restore' | 'login';

type ActionComments = {
    success?: string,
    error: string,
    errorNotFound: string,
    errorUnauthorized: string
}

const actionCommentBase = {
    error: 'An unknown error has occurred',
    errorNotFound: 'Resource not found',
    errorUnauthorized: 'Unauthorized action',
}

const actionComments : Record<string, ActionComments> = {
    index: {
        ...actionCommentBase
    },
    show: {
        ...actionCommentBase
    },
    store: {
        success: 'New entry has been added',
        ...actionCommentBase
    },
    update: {
        success: 'Changes have been saved successfully',
        ...actionCommentBase
    },
    delete: {
        success: 'The entry has been deleted',
        ...actionCommentBase
    },
    restore: {
        success: 'The entry has been restored',
        ...actionCommentBase
    },
    login: {
        ...actionCommentBase
    }
}

const success : ToastOptions = {
    autoClose: NOTIFY_AUTO_CLOSE_TIMEOUT,
    type: 'success',
    transition: 'slide',
}

const error : ToastOptions = {
    autoClose: NOTIFY_AUTO_CLOSE_TIMEOUT,
    type: 'error',
    transition: 'slide',
}

type HandlerOption = {
    formEl?: Element,
    notifyOptions?: NotifyCallbackOptions,
    processing?: Ref,
    disableNotify?: boolean,
    onSuccess?(response: AxiosResponse): void,
    successMsg?: string,
    postHandler?: () => void
}
type HandlerOptionFull = HandlerOption & {
    action: Action,
}

export function useAPI() {

    const notify = <T>(response: FetchResponse<T>, options: HandlerOptionFull) => {

        const action = options.action;
        const actionComment = actionComments[action];

        if (response.error?.status === RESPONSE_UNPROCESSABLE) {
            Object.entries(response.error.data.errors as Record<string, Array<string>>).forEach(entry => {
                const [key, value] = entry;

                toast(value[0], error);

                if (options?.formEl) {
                    const errorTextBox = options?.formEl.querySelector(`[data-error-for="${ key }"]`);
                    if (errorTextBox) {
                        errorTextBox.innerHTML = value[0];
                    }
                }
            });
        }
        else if (response.error?.status === RESPONSE_NOT_FOUND) {
            toast(actionComment.errorNotFound, error);
        }
        else if (response.error?.status === RESPONSE_UNAUTHORIZED) {
            toast(actionComment.errorUnauthorized, error);
        }
        else if (response.error) {
            toast(actionComment.error, error);
        }
        else if (options.notifyOptions) {
            toast(
                ({ closeToast, toastProps }) => h(<RendererElement>NotifyCallback, { closeToast, toastProps }),
                { ...success, data: { comment: actionComment.success, onClick: options.notifyOptions.onClick }, closeOnClick: false },
            );
        }
        else if (actionComment.success) {
            toast(options.successMsg ??  actionComment.success, success);
        }

    }
    const execute = async <T>(
        method: Method,
        path: string,
        params: object = { },
        requestData: object = { },
        options?: HandlerOptionFull
    ) : Promise<FetchResponse<T>> => {
        if (options?.processing) {
            options.processing.value = true;
        }

        const userStore = useUsers();

        //{
        //             data?: object,
        //             error? object,
        //             status: string
        //         }

        const response = await axios({
            method: method,
            url: path,
            data: requestData,
            params: params,
            headers: {
                Authorization: `Bearer ${userStore.userToken}`
            }
        }).then((response) => {
            if (options?.onSuccess) {
                options?.onSuccess(response);
            }
            return { data: response.data, isSuccessful: true };
        }).catch((error) => {
            console.log(error.response);
            return { error: error.response, isSuccessful: false };
        });

        if (options && !options.disableNotify) {
            notify<T>(response, options);
        }

        if (options?.processing) {
            options.processing.value = false;
        }

        if (response.isSuccessful && options?.postHandler) {
            options.postHandler();
        }

        return response;
    }

    return {
        async index<T>(resource: string, params?: object, options?: HandlerOption) {
            return await execute<T>('get', `/api/${resource}`, params, { }, { action: 'index', ...options });
        },
        async show<T>(resource: string, id: number) {
            return await execute<T>('get', `/api/${resource}/${id}`, {}, {}, { action: 'show' });
        },
        async store<T>(resource: string, data: object = { }, options?: HandlerOption) {
            return await execute<T>('post', `/api/${resource}`, {}, data, { action: 'store', ...options });
        },
        async update(resource: string, id: number, data: object, options?: HandlerOption) {
            return await execute('put', `/api/${resource}/${id}`, {}, data, { action: 'update', ...options });
        },
        async delete(resource: string, id: number, options?: HandlerOption) {
            return await execute<void>('delete', `/api/${resource}/${id}`, {},
                { },
                { action: 'delete', ...options });
        },
        async restore(resource: string, id: number) {
            return await execute<void>('put', `/api/${resource}/${id}/restore`, {}, {}, { action: 'restore' });
        },
        async login<T>(credentials: object, options?: HandlerOption) {
            return await execute<T>('post', `/login`, {}, credentials, { action: 'login', ...options });
        }
    }
}