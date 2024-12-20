import React, {FC, useRef, useState} from 'react';
import "./AddNodeForm.scss"
import { UploadedFile } from '@/types/UploadedFile';

interface AddNodeFormProps {
	mindMapId: number;
	onClose: () => void;
	onNodeAdded: () => void;
}

const AddNodeForm: FC<AddNodeFormProps> = ({ mindMapId, onClose, onNodeAdded }) => {
	const [formState, setFormState] = useState({
		content: '',
		priority: 0,
		categories: [] as string[],
		files: [] as File[],
	});
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const updateFormField = (field: keyof typeof formState, value: any) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = e.target.files ? Array.from(e.target.files) : [];
		updateFormField('files', [...formState.files, ...newFiles].slice(0, 5));
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleRemoveFile = (index: number) => {
		updateFormField('files', formState.files.filter((_, i) => i !== index));
	};

	const handleAddCategory = (category: string) => {
		if (category && !formState.categories.includes(category)) {
			updateFormField('categories', [...formState.categories, category]);
		}
	};

	const handleRemoveCategory = (index: number) => {
		updateFormField('categories', formState.categories.filter((_, i) => i !== index));
	};

	const uploadFiles = async (): Promise<UploadedFile[]> => {
		return Promise.all(
			formState.files.map(async (file) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				return new Promise<UploadedFile>((resolve) => {
					reader.onloadend = async () => {
						const res = await fetch('/api/upload', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ data: reader.result }),
						});
						const { url } = await res.json();
						resolve({ url, type: file.type });
					};
				});
			})
		);
	};

	const handleSubmit = async () => {
		setLoading(true);
		
		try {
			const uploadedFiles = await uploadFiles();
			const payload = {
				mindMapId,
				content: formState.content,
				xPosition: window.innerWidth / 2,
				yPosition: window.innerHeight / 2,
				nodeIcons: [
					{ type: 'priority', content: formState.priority.toString() },
					...formState.categories.map((category) => ({ type: 'category', content: category })),
				],
				nodeFiles: uploadedFiles,
			};
			
			console.log(payload)

			const res = await fetch('http://localhost:8080/api/mind-map/add-node', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				console.log('Node added successfully!');
				onNodeAdded();
				onClose();
			} else {
				console.error('Failed to add node');
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-node-form">
			<h3>Add Node</h3>
			<input
				type="text"
				placeholder="Content"
				value={formState.content}
				onChange={(e) => updateFormField('content', e.target.value)}
				required
			/>
			<input
				type="number"
				placeholder="Priority (optional)"
				value={formState.priority || ''}
				onChange={(e) => updateFormField('priority', Number(e.target.value) || 0)}
			/>
			<div className="category-input-container">
				<input
					type="text"
					placeholder="Add category"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAddCategory((e.target as HTMLInputElement).value);
							(e.target as HTMLInputElement).value = '';
						}
					}}
				/>
				<div className="category-list">
					{formState.categories.map((category, index) => (
						<div key={index} className="category-item">
							<p>{category}</p>
							<button onClick={() => handleRemoveCategory(index)} className="remove-category-btn">
								&times;
							</button>
						</div>
					))}
				</div>
			</div>
			<div className="file-upload-container">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					multiple
					style={{ display: 'none' }}
				/>
				<button onClick={() => fileInputRef.current?.click()} type="button" className="file-upload-btn">
					Add Files
				</button>
				<div className="file-list">
					{formState.files.map((file, index) => (
						<div key={index} className="file-item">
							<p>{file.name} ({file.type})</p>
							<button onClick={() => handleRemoveFile(index)} className="remove-file-btn">
								&times;
							</button>
						</div>
					))}
				</div>
			</div>
			<div className="controls">
				<button onClick={handleSubmit} disabled={loading}>
					{loading ? 'Saving...' : 'Save Node'}
				</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	);
};

export default AddNodeForm;
