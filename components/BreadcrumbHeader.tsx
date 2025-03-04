'use client'
import { MobileSidebar } from '@/components/Sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

const BreadcrumbHeader = () => {
	const pathname = usePathname()
	const paths = pathname === '/' ? [''] : pathname.split('/')
	return (
		<div className={'flex items-center flex-start'}>
			<MobileSidebar />
			<Breadcrumb>
				<BreadcrumbList>
					{paths.map((path, index) => (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink className={'capitalize'} href={path}>
									{path === '' ? '首页' : path}
								</BreadcrumbLink>
							</BreadcrumbItem>
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}

export default BreadcrumbHeader