'use client'

import { ReactNode } from 'react';

export function NodeInputs({children}: { children: ReactNode }) {
	return (
		<div className={'flex flex-col gap-2 divide-y'}>
			{children}
		</div>
	)
}

export function NodeInput({input}: {input: any}) {
	return (
		<div>
			{input.name}
		</div>
	)
}