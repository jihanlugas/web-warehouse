import { ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import { HTMLProps, useEffect, useState } from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
	name: string;
	field?: boolean;
}

const TextFieldNumberFloat: NextPage<Props> = ({ name, ...props }) => {
	const [field, meta, helpers] = useField(name);
	const [displayValue, setDisplayValue] = useState<string>(field.value?.toString() || '');

	const hasError = meta.touched && meta.error;

	const className = [
		'w-full',
		'h-10',
		'px-2',
		'select-all',
		hasError && '!border-rose-400',
		props.className || ''
	].filter(Boolean).join(' ');

	const formatNumber = (value: string | number) => {
		if (value === '') return '';
		const parsed = parseFloat(value.toString().replace(',', '.'));
		if (isNaN(parsed)) return value.toString();
		return new Intl.NumberFormat('id-ID', {
			useGrouping: true,
			minimumFractionDigits: 0,
			maximumFractionDigits: 10, // mendukung hingga 10 digit desimal
		}).format(parsed);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let raw = e.target.value;

		// Hanya izinkan angka, koma, titik, dan hapus karakter lainnya
		raw = raw.replace(/[^0-9.,]/g, '');

		// Ganti koma dengan titik agar sesuai parseFloat
		const normalized = raw.replace(',', '.');

		// Simpan ke state Formik
		const parsed = parseFloat(normalized);
		helpers.setValue(isNaN(parsed) ? '' : parsed);

		// Update display sementara tanpa format ribuan
		setDisplayValue(raw);

		props.onChange?.(e);
	};

	useEffect(() => {
		setDisplayValue(field.value === '' ? '' : formatNumber(field.value));
	}, [field.value]);

	return (
		<div className="flex flex-col w-full relative pb-6">
			{props.label && (
				<div className="mb-1">
					<span>{props.label}</span>
					{props.required && <span className="text-rose-600">*</span>}
				</div>
			)}
			<input
				type="text"
				{...field}
				{...props}
				value={displayValue}
				onChange={handleChange}
				className={className}
			/>
			<ErrorMessage name={name}>
				{(msg) => (
					<div className="absolute bottom-0 text-rose-600 text-sm normal-case">{msg}</div>
				)}
			</ErrorMessage>
		</div>
	);
};

export default TextFieldNumberFloat;
