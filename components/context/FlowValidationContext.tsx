import { AppNodeMissingInputs } from '@/types/appNode'
import { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useState } from 'react'

type FlowValidationContextType = {
	invalidInputs: AppNodeMissingInputs[]
	setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>
	clearErrors: () => void
}

export const FlowValidationContext = createContext<FlowValidationContextType | null>(null)

export function FlowValidationContextProvider({ children }: { children: ReactNode }) {
	const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([])

	const clearErrors = useCallback(() => {
		setInvalidInputs([])
	}, [])

	return (
		<FlowValidationContext.Provider
			value={{
				invalidInputs,
				setInvalidInputs,
				clearErrors,
			}}
		>
			{children}
		</FlowValidationContext.Provider>
	)
}
