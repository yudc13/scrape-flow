import {
	flowToExecutionPlan,
	FlowToExecutionPlanValidationError,
} from '@/lib/workflow/executionPlan'
import { AppNode } from '@/types/appNode'
import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { useFlowVlidation } from './useFlowValidation'
import { toast } from 'sonner'

export const useExecutionPlan = () => {
	const { toObject } = useReactFlow()

	const { setInvalidInputs, clearErrors } = useFlowVlidation()

	const handleError = useCallback(
		(error: any) => {
			switch (error.type) {
				case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
					toast.error('No entry point')
					break
				case FlowToExecutionPlanValidationError.INVALID_INPUTS:
					toast.error('Not all inputs values are set')
					setInvalidInputs(error.invalidElements)
					break
				default:
					toast.error('sonmething went wrong')
					break
			}
		},
		[setInvalidInputs]
	)

	const generateExecutionPlan = useCallback(() => {
		const { nodes, edges } = toObject()
		const { executionPlan, error } = flowToExecutionPlan(nodes as AppNode[], edges)

		if (error) {
			handleError(error)
			return null
		}

		clearErrors()
		return executionPlan
	}, [toObject, handleError, clearErrors])

	return generateExecutionPlan
}
