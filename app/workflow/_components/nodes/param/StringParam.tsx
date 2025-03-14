'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import { useEffect, useId, useState } from 'react';

const StringParam = ({param, disabled, value, onUpdateNodeParamValue}: ParamProps) => {
	const [internalValue, setInternalValue] = useState(value);
	const id = useId();

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	let Component: any = Input;

	if (param.variant === 'textarea') {
		Component = Textarea
	}

	return (
		<div className={'space-y-1 p-1 w-full'}>
			<Label htmlFor={id} className={'text-xs flex items-center'}>
				{param.name}
				{param.required && <p className={'text-destructive px-2 flex items-center'}>*</p>}
			</Label>
			<Component
				id={id}
				disabled={disabled}
				value={internalValue}
				onChange={(e: any) => setInternalValue(e.target.value)}
				onBlur={(e: any) => onUpdateNodeParamValue(e.target.value)}
				className={'text-xs'}
			/>
			{param.helperText && <p className={'text-xs text-muted-foreground'}>{param.helperText}</p>}
		</div>
	);
};

export default StringParam;