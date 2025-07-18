import * as React from "react"

export interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "success" | "danger" | "warning" | "info"
  autoHide?: boolean
  delay?: number
}

export interface InternalToast extends ToastOptions {
  id: string
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

interface State {
  toasts: InternalToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function genId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function dispatch(toast: InternalToast) {
  memoryState = {
    toasts: [toast, ...memoryState.toasts.slice(0, TOAST_LIMIT - 1)],
  }
  listeners.forEach((listener) => listener(memoryState))

  const delay = toast.delay ?? TOAST_REMOVE_DELAY
  if (toast.autoHide !== false) {
    const timeout = setTimeout(() => {
      removeToast(toast.id)
    }, delay)
    toastTimeouts.set(toast.id, timeout)
  }
}

function removeToast(toastId: string) {
  toastTimeouts.delete(toastId)
  memoryState = {
    toasts: memoryState.toasts.filter((t) => t.id !== toastId),
  }
  listeners.forEach((listener) => listener(memoryState))
}

function useToasts() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  const addToast = (options: ToastOptions) => {
    const id = genId()
    const toast: InternalToast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "info",
      autoHide: options.autoHide,
      delay: options.delay,
    }
    dispatch(toast)
    return id
  }

  const dismissToast = (id: string) => {
    if (toastTimeouts.has(id)) {
      clearTimeout(toastTimeouts.get(id)!)
      toastTimeouts.delete(id)
    }
    removeToast(id)
  }


  const ToastContainer = () => (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show text-bg-${toast.variant}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">{toast.title}</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close"
            ></button>
          </div>
          {toast.description && (
            <div className="toast-body">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )

  return {
    toasts: state.toasts,
    addToast,
    dismissToast,
    ToastContainer, 
  }
}

export { useToasts }
