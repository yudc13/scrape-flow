import Logo from '@/components/Logo';
import { ReactNode } from 'react';

const AuthLayout = ({children}: { children: ReactNode }) => {
	return (
		<div className={'flex flex-col items-center justify-center gap-4 min-h-screen w-full'}>
			<Logo />
			{children}
		</div>
	)
}

export default AuthLayout