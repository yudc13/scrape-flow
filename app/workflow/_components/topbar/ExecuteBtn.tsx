'use client'

import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';

export default function ExecuteBtn({}: { workflowId: string }) {
	return (
		<Button variant={'outline'} className={'flex items-center gap-2'}>
			<PlayIcon size={16} className={'stroke-orange-400'} />
			执行
		</Button>
	)
}