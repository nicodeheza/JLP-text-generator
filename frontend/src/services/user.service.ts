import { useEffect, useState } from 'react'
import type { IsAiSetup } from '../types/user.types'
import type { AsyncData } from '../types/asyncData.types'

import { useUserStore } from '../store/User.store'
import {
  getIdleState,
  getLoadingState,
  getSuccessState,
  getErrorState,
} from '../helpers/async.helpers'
import { getAiAuth, setAiAuth, deleteAiAuth } from '../api/user.api'
import type { IdleAsyncData } from '../types/asyncData.types'

export function useGetIsAiSetUp() {
  const { aiEnabled, updateAiEnabled } = useUserStore()
  const [res, setRes] = useState<AsyncData<IsAiSetup>>(() =>
    aiEnabled === undefined ? getLoadingState() : getSuccessState(aiEnabled)
  )

  useEffect(() => {
    if (aiEnabled !== undefined) return
    getAiAuth()
      .then(({ auth }) => {
        updateAiEnabled(auth)
        setRes(getSuccessState(auth))
      })
      .catch((error: Error) => {
        setRes(getErrorState(error))
      })
    // only need it on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return aiEnabled !== undefined ? getSuccessState(aiEnabled) : res
}

export function useSetAiKey() {
  const { updateAiEnabled } = useUserStore()
  const [res, setRes] = useState<IdleAsyncData<void>>(getIdleState())

  function setKey(apiKey: string) {
    setRes(getLoadingState())
    setAiAuth(apiKey)
      .then(() => {
        updateAiEnabled(true)
        setRes(getSuccessState(undefined))
      })
      .catch((error: Error) => {
        setRes(getErrorState(error))
      })
  }

  function reset() {
    setRes(getIdleState())
  }
  return { res, setKey, reset }
}

export function useDeleteAiKey() {
  const { updateAiEnabled } = useUserStore()
  const [res, setRes] = useState<IdleAsyncData<void>>(getIdleState())

  function deleteKey() {
    setRes(getLoadingState())
    deleteAiAuth()
      .then(() => {
        updateAiEnabled(false)
        setRes(getSuccessState(undefined))
      })
      .catch((error: Error) => {
        setRes(getErrorState(error))
      })
  }

  function reset() {
    setRes(getIdleState())
  }

  return { res, deleteKey, reset }
}
