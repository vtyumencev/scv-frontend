import { toast, type ToastOptions } from 'vue3-toastify'
import type { AxiosResponse } from 'axios'
import { h, type RendererElement } from 'vue'
import RestoreRecord from '@/pages/backend/components/NotifyCallback.vue'

const RESPONSE_OK = 200
const RESPONSE_CREATED = 201
const RESPONSE_ACCEPTED = 202
const RESPONSE_NO_CONTENT = 204
const RESPONSE_UNPROCESSABLE = 422

const NOTIFY_AUTO_CLOSE_TIMEOUT = 5000
const NOTIFY_THEME = 'colored'

type Action = 'store' | 'update' | 'delete' | 'restore'

const actionComments = {
    store: {
        success: 'New record has been added',
        error: 'An unknown error has occurred'
    },
    update: {
        success: 'Changes have been saved successfully',
        error: 'An unknown error has occurred'
    },
    delete: {
        success: 'The record has been deleted',
        error: 'An unknown error has occurred'
    },
    restore: {
        success: 'The record has been restored',
        error: 'An unknown error has occurred'
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

type Restore = {
    title?: string,
    onRestore(): void
}

type HandlerOption = {
    formEl?: Element,
    restore?: Restore
}

export function fetchStatusHandler(response: AxiosResponse, action: Action, options?: HandlerOption) {
    
    if (response.status === RESPONSE_OK || 
        response.status === RESPONSE_CREATED || 
        response.status === RESPONSE_NO_CONTENT) {
            const restore = options?.restore
            if (restore) {
                toast(
                    ({ closeToast, toastProps }) => h(<RendererElement>RestoreRecord, { closeToast, toastProps }), 
                    { ...success, data: { comment: actionComments.delete.success, onRestore: restore.onRestore }, closeOnClick: false },
                  );
            } else {
                toast(actionComments[action].success, success)
            }
    } else if (response.status === RESPONSE_UNPROCESSABLE) {

        Object.entries(response.data.errors as Record<string, Array<string>>).forEach(entry => {
            const [key, value] = entry

            toast(value[0], error)

            if (options?.formEl) {
                const errorTextBox = options?.formEl.querySelector(`[data-error-for="${ key }"]`)
                if (errorTextBox) {
                    errorTextBox.innerHTML = value[0]
                }
            }
        });
    
    } else {
        toast(actionComments[action].error, error)
    }
}