'use client'

import ExecuteBtn from '@/app/workflow/_components/topbar/ExecuteBtn';
import SaveBtn from '@/app/workflow/_components/topbar/SaveBtn';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
	workflowId: string
	title: string
	subTitle?: string
	hiddenButs?: boolean
}
const TopBar = ({title, subTitle, workflowId, hiddenButs = false}: Props) => {
	const { back } = useRouter()
	return (
		<header className={'flex p-2 border-separate border-b-2 justify-between w-full h-[60px] sticky top-0 bg-background z-10'}>
			<div className={'flex gap-1 flex-1'}>
				<TooltipWrapper content={'返回'}>
					<Button variant={'ghost'} size={'icon'} onClick={back}>
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
			<div className={'flex items-center gap-4'}>
				{
					hiddenButs === false && (
						<>
							<ExecuteBtn workflowId={workflowId} />
							<SaveBtn workflowId={workflowId} />
						</>
					)
				}
			</div>
		</header>
	)
}

export default TopBar