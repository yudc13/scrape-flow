import { Loader2Icon } from 'lucide-react';

const Loading = () => {
	return (
		<div className={'flex items-center justify-center h-screen w-full'}>
			<Loader2Icon size={30} className={'animate-spin stroke-primary'} />
		</div>
	)
}

export default Loading