import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
	return (
		<div className={'flex flex-col items-center justify-center min-h-screen p-4'}>
			<div className={'text-center'}>
				<h1 className={'text-6xl font-bold text-primary mb-4'}>404</h1>
				<h2>您访问等页面不存在</h2>
			</div>
			<div className={'mt-8'}>
				<Link href={'/'} className={'flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors'}>
					<ArrowLeft className={'w-4 h-4 mr-2'} />
					返回首页
				</Link>
			</div>
		</div>
	)
}

export default NotFound