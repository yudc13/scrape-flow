'use client'

import SaveBtn from '@/app/workflow/_components/topbar/SaveBtn';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';

interface Props {
	workflowId: string
	title: string
	subTitle?: string
}
const TopBar = ({title, subTitle, workflowId}: Props) => {
	return (
		<header className={'flex p-2 border-separate border-b-2 justify-between w-full h-[60px] sticky top-0 bg-background z-10'}>
			<div className={'flex gap-1 flex-1'}>
				<TooltipWrapper content={'返回'}>
					<Button variant={'ghost'} size={'icon'}>
						<ChevronLeftIcon size={30} />
					</Button>
				</TooltipWrapper>
				<div>
					<p className={'font-bold text-ellipsis truncate'}>{title}</p>
					{
						subTitle && (
							<p className={'text-sm text-muted-foreground truncate text-ellipsis'}>{subTitle}</p>
						)
					}
				</div>
			</div>
			<div>
				<SaveBtn workflowId={workflowId} />
			</div>
		</header>
	)
}

export default TopBar