import { forwardRef } from 'react'
import type { ReactNode, DialogHTMLAttributes } from 'react'
import styles from './Modal.module.css'

interface Props extends DialogHTMLAttributes<HTMLDialogElement> {
  children: ReactNode
}

export const Modal = forwardRef<HTMLDialogElement, Props>(({ children, ...props }, ref) => (
  <dialog ref={ref} className={styles.dialog} {...props}>
    <div className={styles.content}>{children}</div>
  </dialog>
))
