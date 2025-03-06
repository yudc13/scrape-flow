'use client'

import { getQueryClient } from '@/lib/helper/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

const AppProvider = ({children}: { children: ReactNode }) => {
	const queryClient = getQueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute={'class'} defaultTheme={'system'} enableSystem>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}

export default AppProvider