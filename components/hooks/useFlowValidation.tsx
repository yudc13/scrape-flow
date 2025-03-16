import { useContext } from 'react'
import { FlowValidationContext } from '@/components/context/FlowValidationContext'

export const useFlowVlidation = () => {
	const context = useContext(FlowValidationContext)

	if (!context) {
		throw new Error('useFlowVlidation must used with FlowValidationContext')
	}

	return context
}
