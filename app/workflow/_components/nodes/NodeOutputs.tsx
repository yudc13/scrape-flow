'use client';

import { ColorForHandle } from '@/app/workflow/_components/nodes/common';
import { cn } from '@/lib/utils';
import { TaskParam } from '@/types/task';
import { Handle, Position } from '@xyflow/react';
import React from 'react';

export function NodeOutputs({children}: { children: React.ReactNode }) {
	return (
		<div className={'flex flex-col divide-y gap-1'}>{children}</div>
	);
}

export function NodeOutput({output}: { output: TaskParam, nodeId: string }) {
	return (
		<div className={'flex justify-end relative p-3 bg-secondary'}>
			<p className={'text-xs text-muted-foreground'}>{output.name}</p>
			<Handle
				id={output.name}
				type={'source'}
				position={Position.Right}
				className={cn('!border-2 !border-background !-right-2 !w-4 !h-4', ColorForHandle[output.type])}/>
		</div>
	);
}