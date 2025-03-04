import BreadcrumbHeader from '@/components/BreadcrumbHeader';
import DesktopSidebar from '@/components/Sidebar';
import ThemeModeToggle from '@/components/ThemeModeToggle';
import { Separator } from '@/components/ui/separator';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { ReactNode } from 'react';

const HomeLayout = (
	{children}: { children: ReactNode },
) => {
	return (
		<div className={'flex h-screen'}>
			<DesktopSidebar />
			<div className="flex flex-col flex-1 min-h-screen">
				<header className={'flex items-center justify-between px-6 py-4 h-[50px] container'}>
					<BreadcrumbHeader />
					<div className={'gap-4 flex items-center'}>
						<ThemeModeToggle />
						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</header>
				<Separator />
				<main className={'flex-1 py-4 container text-accent-foreground'}>
					{children}
				</main>
			</div>
		</div>
	);
};

export default HomeLayout;