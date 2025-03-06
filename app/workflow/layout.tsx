import Logo from '@/components/Logo';
import ThemeModeToggle from '@/components/ThemeModeToggle';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';

const Layout = ({children}: { children: ReactNode }) => {
	return (
		<div className={'flex-col flex h-screen'}>
			{children}
			<Separator />
			<footer className={'flex items-center justify-between py-2 px-4'}>
				<Logo />
				<ThemeModeToggle />
			</footer>
		</div>
	)
}

export default Layout