'use server';

import {auth} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";
import {WorkflowExecutionPlan} from "@/types/workflow";
import {flowToExecutionPlan} from "@/lib/workflow/executionPlan";

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

  if (!result.error) {
    throw new Error('workflow error');
  }

  if (!result.executionPlan) {
    throw new Error('workflow not plan');
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userid: userId,
      status: 'PENDING',
      trigger: 'manual',
      startAt: new Date(),
      phase: {
        create: []
      }
    }
  });
}