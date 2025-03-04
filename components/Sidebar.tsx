'use client';


import Logo from '@/components/Logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const routes = [
	{
		href: '',
		label: '首页',
		icon: HomeIcon,
	},
	{
		href: 'workflows',
		label: '流水线',
		icon: Layers2Icon,
	},
	{
		href: 'credentials',
		label: '授权',
		icon: ShieldCheckIcon,
	},
	{
		href: 'billing',
		label: '统计',
		icon: CoinsIcon,
	},
];

const DesktopSidebar = () => {
	const pathname = usePathname();
	const activeRoute = routes.find(route => route.href.length > 0 && pathname.startsWith(route.href)) || routes[0];
	return (
		<div
			className={'hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate'}>
			<div className={'flex flex-col items-center justify-center gap-2 border-b-[1px] border-separate p-4'}>
				<Logo/>
			</div>
			<div className={'flex flex-col p-2'}>
				{routes.map(route => (
					<Link
						href={route.href} key={route.href}
						className={buttonVariants({variant: route.href === activeRoute.href ? 'sidebarItemActive' : 'sidebarItem'})}
					>
						<route.icon size={20}/>
						{route.label}
					</Link>
				))}
			</div>
		</div>
	);
};

export const MobileSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const pathname = usePathname();
	const activeRoute = routes.find(route => route.href.length > 0 && pathname.startsWith(route.href)) || routes[0];

	return (
		<div className={'block border-separate bg-background md:hidden'}>
			<nav className={'flex items-center justify-between px-8'}>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant={'ghost'} size={'icon'}>
							<MenuIcon />
						</Button>
					</SheetTrigger>
					<SheetContent side={'left'} className={'w-[400px] sm:w-[540px] space-y-4'}>
						<Logo />
						<div className={'flex flex-col gap-1'}>
							{routes.map(route => (
								<Link
									href={route.href} key={route.href}
									className={buttonVariants({variant: route.href === activeRoute.href ? 'sidebarItemActive' : 'sidebarItem'})}
									onClick={() => setIsOpen(prev => !prev)}
								>
									<route.icon size={20}/>
									{route.label}
								</Link>
							))}
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	)
}



export default DesktopSidebar;
