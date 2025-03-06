import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Props {
	title?: string;
	subTitle?: string;
	icon?: LucideIcon;

	titleClassName?: string;
	subTitleClassName?: string;
	iconClassName?: string;
}

const CustomDialogHeader = (props: Props) => {
	return (
		<DialogHeader className={'py-6'}>
			<DialogTitle asChild>
				<div className={'flex flex-col items-center gap-2 mb-2'}>
					{
						props.icon && <props.icon size={30} className={cn('stroke-primary', props.iconClassName)}/>
					}
					{
						props.title && (
							<p className={cn('text-xl text-primary', props.titleClassName)}>{props.title}</p>
						)
					}
					{
						props.subTitle && (
							<p className={cn('text-sm text-muted-foreground', props.subTitleClassName)}>{props.subTitle}</p>
						)
					}
				</div>
			</DialogTitle>
			<Separator />
		</DialogHeader>
	);
};

export default CustomDialogHeader;