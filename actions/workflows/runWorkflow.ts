'use server';

import { executeWorkflow } from '@/lib/workflow/executeWorkflow';
import { TaskRegistry } from '@/lib/workflow/task/register';
import {auth} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkFlowExecutionStatus,
  WorkFlowExecutionTrigger,
} from '@/types/workflow';
import {flowToExecutionPlan} from "@/lib/workflow/executionPlan";
import { redirect } from 'next/navigation';

export async function runWorkflow({workflowDefinition, workflowId}: {
  workflowId: string,
  workflowDefinition?: string
}) {
  const {userId} = await auth();

  if (!userId) {
    throw new Error('userId is required');
  }

  if (!workflowId) {
    throw new Error('workflowId is required');
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userid: userId,
      id: workflowId,
    }
  });

  if (!workflow) {
    throw new Error('workflowId is required');
  }

  let executionPlan: WorkflowExecutionPlan;

  if (!workflowDefinition) {
    throw new Error('workflowDefinition is required');
  }

  const flow = JSON.parse(workflowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error('workflow error');
  }

  if (!result.executionPlan) {
    throw new Error('workflow not plan');
  }

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userid: userId,
      status: WorkFlowExecutionStatus.PENDING,
      trigger: WorkFlowExecutionTrigger.MANUAL,
      startAt: new Date(),
      phase: {
        create: executionPlan.flatMap(plan => plan.nodes.flatMap(node => ({
          userid: userId,
          status: ExecutionPhaseStatus.CREATED,
          number: plan.phase,
          node: JSON.stringify(node),
          name: TaskRegistry[node.data.type].label,
        })))
      }
    },
    select: {
      id: true,
      phase: true
    }
  });

  if (!execution) {
    throw new Error('create workflow execution error');
  }

  await executeWorkflow(execution.id)

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}